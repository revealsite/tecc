"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionDisplay } from "./section-display";
import { AiChat } from "./ai-chat";
import { MONTH_NAMES } from "@/lib/types";
import type { Newsletter } from "@/lib/types";

interface NewsletterCardProps {
  newsletter: Newsletter;
}

type Tab = "newsletter" | "breakdown" | "ai";

const tabs: { key: Tab; label: string }[] = [
  { key: "newsletter", label: "Newsletter" },
  { key: "breakdown", label: "Breakdown" },
  { key: "ai", label: "AI Helper" },
];

export function NewsletterCard({ newsletter }: NewsletterCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("newsletter");

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
        <div className="border-t border-border">
          {/* Tabs */}
          <div className="flex border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "border-b-2 border-sky-blue text-sky-blue"
                    : "text-medium-gray hover:text-navy"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="px-5 py-4">
            {activeTab === "newsletter" && (
              <div>
                {newsletter.source_url ? (
                  <iframe
                    src={newsletter.source_url}
                    className="w-full rounded-md border border-border"
                    style={{ height: "70vh" }}
                    title={newsletter.title}
                  />
                ) : (
                  <p className="text-sm text-medium-gray">
                    No source URL available for this newsletter.
                  </p>
                )}
              </div>
            )}

            {activeTab === "breakdown" && (
              <div className="space-y-4">
                {newsletter.overall_summary && (
                  <p className="text-sm text-foreground/80">
                    {newsletter.overall_summary}
                  </p>
                )}
                {newsletter.key_topics && newsletter.key_topics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {newsletter.key_topics.map((topic) => (
                      <Badge key={topic} variant="blue">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                )}
                {newsletter.newsletter_sections.length > 0 ? (
                  newsletter.newsletter_sections.map((section) => (
                    <SectionDisplay key={section.id} section={section} />
                  ))
                ) : (
                  <p className="text-sm text-medium-gray">
                    No sections added yet.
                  </p>
                )}
              </div>
            )}

            {activeTab === "ai" && <AiChat newsletter={newsletter} />}
          </div>
        </div>
      )}
    </Card>
  );
}
