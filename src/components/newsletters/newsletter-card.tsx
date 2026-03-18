"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { HighlightText } from "@/components/ui/highlight-text";
import { MONTH_NAMES } from "@/lib/types";
import type { Newsletter } from "@/lib/types";

interface NewsletterCardProps {
  newsletter: Newsletter;
  searchTerm?: string;
}

export function NewsletterCard({ newsletter, searchTerm }: NewsletterCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [iframeHtml, setIframeHtml] = useState<string | null>(null);
  const [loadingHtml, setLoadingHtml] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const snippet = searchTerm ? getSearchSnippet(newsletter, searchTerm) : null;

  // Fetch HTML via proxy when expanded
  const fetchHtml = useCallback(async () => {
    if (!newsletter.source_url || iframeHtml !== null) return;
    setLoadingHtml(true);
    try {
      const res = await fetch(
        `/api/proxy-newsletter?url=${encodeURIComponent(newsletter.source_url)}`
      );
      const data = await res.json();
      if (data.html) {
        setIframeHtml(data.html);
      }
    } catch {
      // Fall back to direct iframe
    } finally {
      setLoadingHtml(false);
    }
  }, [newsletter.source_url, iframeHtml]);

  useEffect(() => {
    if (expanded && newsletter.source_url) {
      fetchHtml();
    }
  }, [expanded, fetchHtml, newsletter.source_url]);

  // Highlight search term inside iframe after it loads
  const handleIframeLoad = useCallback(() => {
    if (!searchTerm || !iframeRef.current) return;
    try {
      const doc = iframeRef.current.contentDocument;
      if (!doc) return;

      // Inject highlight styles
      const style = doc.createElement("style");
      style.textContent = `
        .tecc-highlight {
          background-color: #fef08a !important;
          color: inherit !important;
          border-radius: 2px;
          padding: 0 1px;
        }
      `;
      doc.head.appendChild(style);

      // Walk the DOM and highlight text nodes
      highlightInDocument(doc.body, searchTerm);

      // Scroll to first highlight
      const firstHighlight = doc.querySelector(".tecc-highlight");
      if (firstHighlight) {
        firstHighlight.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } catch {
      // Cross-origin — can't access iframe content
    }
  }, [searchTerm]);

  return (
    <Card accent>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 text-left hover:bg-light-gray/50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="navy">{newsletter.year}</Badge>
            <span className="text-sm text-medium-gray">
              {MONTH_NAMES[newsletter.month - 1]}
            </span>
            <h3 className="text-lg font-semibold text-navy">
              <HighlightText text={newsletter.title} searchTerm={searchTerm} />
            </h3>
          </div>
          <div className="flex items-center gap-3">
            {newsletter.source_url && (
              <a
                href={newsletter.source_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-sm text-sky-blue hover:underline"
              >
                View Source
              </a>
            )}
            <svg
              className={`h-5 w-5 text-medium-gray transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {snippet && (
          <p className="mt-2 text-sm text-medium-gray line-clamp-2">
            <HighlightText text={snippet} searchTerm={searchTerm} />
          </p>
        )}
      </button>
      {expanded && (
        <div className="border-t border-border">
          <div className="px-5 py-4">
            {newsletter.source_url ? (
              loadingHtml ? (
                <div className="flex items-center justify-center py-12">
                  <svg className="h-6 w-6 animate-spin text-sky-blue" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="ml-2 text-sm text-medium-gray">Loading newsletter...</span>
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  srcDoc={iframeHtml ?? undefined}
                  src={iframeHtml ? undefined : newsletter.source_url}
                  loading="lazy"
                  onLoad={handleIframeLoad}
                  className="w-full rounded-md border border-border"
                  style={{ height: "70vh" }}
                  title={newsletter.title}
                  sandbox="allow-same-origin"
                />
              )
            ) : (
              <p className="text-sm text-medium-gray">
                No source URL available for this newsletter.
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

function highlightInDocument(root: Node, searchTerm: string) {
  const term = searchTerm.toLowerCase();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodesToProcess: Text[] = [];

  let node: Text | null;
  while ((node = walker.nextText())) {
    if (node.textContent && node.textContent.toLowerCase().includes(term)) {
      nodesToProcess.push(node);
    }
  }

  for (const textNode of nodesToProcess) {
    const text = textNode.textContent!;
    const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    const parts = text.split(regex);

    if (parts.length <= 1) continue;

    const fragment = document.createDocumentFragment();
    for (const part of parts) {
      if (regex.test(part)) {
        const mark = document.createElement("span");
        mark.className = "tecc-highlight";
        mark.textContent = part;
        fragment.appendChild(mark);
        // Reset regex lastIndex since it's stateful with global flag
        regex.lastIndex = 0;
      } else {
        fragment.appendChild(document.createTextNode(part));
      }
    }

    textNode.parentNode?.replaceChild(fragment, textNode);
  }
}

// Extend TreeWalker to have a typed nextText helper
declare global {
  interface TreeWalker {
    nextText(): Text | null;
  }
}

TreeWalker.prototype.nextText = function (): Text | null {
  return this.nextNode() as Text | null;
};

function getSearchSnippet(
  newsletter: Newsletter,
  searchTerm: string
): string | null {
  const term = searchTerm.toLowerCase();

  if (newsletter.content_text) {
    const idx = newsletter.content_text.toLowerCase().indexOf(term);
    if (idx !== -1) {
      const start = Math.max(0, idx - 60);
      const end = Math.min(newsletter.content_text.length, idx + term.length + 60);
      const prefix = start > 0 ? "..." : "";
      const suffix = end < newsletter.content_text.length ? "..." : "";
      return prefix + newsletter.content_text.slice(start, end) + suffix;
    }
  }

  for (const section of newsletter.newsletter_sections) {
    if (section.section_title.toLowerCase().includes(term)) {
      return section.section_title;
    }
    if (section.summary?.toLowerCase().includes(term)) {
      const idx = section.summary.toLowerCase().indexOf(term);
      const start = Math.max(0, idx - 60);
      const end = Math.min(section.summary.length, idx + term.length + 60);
      const prefix = start > 0 ? "..." : "";
      const suffix = end < section.summary.length ? "..." : "";
      return prefix + section.summary.slice(start, end) + suffix;
    }
  }

  return null;
}
