"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionDisplay } from "./section-display";
import { MONTH_NAMES } from "@/lib/types";
import type { Newsletter } from "@/lib/types";

interface NewsletterCardProps {
  newsletter: Newsletter;
}

export function NewsletterCard({ newsletter }: NewsletterCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card accent>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="navy">{newsletter.year}</Badge>
            <span className="text-sm text-medium-gray">
              {MONTH_NAMES[newsletter.month - 1]}
            </span>
            <h3 className="text-lg font-semibold text-navy">
              {newsletter.title}
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
      </button>
      {expanded && (
        <div className="border-t border-border px-5 py-4 space-y-4">
          {newsletter.newsletter_sections.length > 0 ? (
            newsletter.newsletter_sections.map((section) => (
              <SectionDisplay key={section.id} section={section} />
            ))
          ) : (
            <p className="text-sm text-medium-gray">No sections added yet.</p>
          )}
        </div>
      )}
    </Card>
  );
}
