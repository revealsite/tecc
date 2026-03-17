"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionForm } from "./section-form";
import { LinkForm } from "./link-form";
import type { Newsletter, NewsletterSection } from "@/lib/types";

interface SectionManagerProps {
  newsletter: Newsletter;
}

export function SectionManager({ newsletter }: SectionManagerProps) {
  const [showNewSection, setShowNewSection] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [addingLinkToSection, setAddingLinkToSection] = useState<string | null>(null);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);

  const nextSectionOrder =
    newsletter.newsletter_sections.length > 0
      ? Math.max(...newsletter.newsletter_sections.map((s) => s.sort_order)) + 1
      : 0;

  return (
    <div className="space-y-4">
      {newsletter.newsletter_sections.map((section) => (
        <Card key={section.id} className="p-4" accent>
          {editingSectionId === section.id ? (
            <SectionForm
              newsletterId={newsletter.id}
              section={section}
              nextSortOrder={section.sort_order}
              onCancel={() => setEditingSectionId(null)}
            />
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-navy">
                  {section.section_title}
                </h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingSectionId(section.id)}
                >
                  Edit Section
                </Button>
              </div>
              {section.summary && (
                <p className="text-sm text-medium-gray mb-3">
                  {section.summary}
                </p>
              )}

              {/* Links */}
              <div className="space-y-2 mt-3">
                <h4 className="text-sm font-medium text-navy">Links</h4>
                {section.section_links.map((link) =>
                  editingLinkId === link.id ? (
                    <LinkForm
                      key={link.id}
                      sectionId={section.id}
                      newsletterId={newsletter.id}
                      link={link}
                      nextSortOrder={link.sort_order}
                      onCancel={() => setEditingLinkId(null)}
                    />
                  ) : (
                    <div
                      key={link.id}
                      className="flex items-center justify-between rounded-md border border-border bg-light-gray px-3 py-2"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-xs text-medium-gray">
                          #{link.sort_order}
                        </span>
                        <span className="font-medium">{link.label}</span>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-blue hover:underline truncate max-w-[300px]"
                        >
                          {link.url}
                        </a>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditingLinkId(link.id)}
                      >
                        Edit
                      </Button>
                    </div>
                  )
                )}

                {addingLinkToSection === section.id ? (
                  <LinkForm
                    sectionId={section.id}
                    newsletterId={newsletter.id}
                    nextSortOrder={
                      section.section_links.length > 0
                        ? Math.max(...section.section_links.map((l) => l.sort_order)) + 1
                        : 0
                    }
                    onCancel={() => setAddingLinkToSection(null)}
                  />
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setAddingLinkToSection(section.id)}
                  >
                    + Add Link
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>
      ))}

      {showNewSection ? (
        <SectionForm
          newsletterId={newsletter.id}
          nextSortOrder={nextSectionOrder}
          onCancel={() => setShowNewSection(false)}
        />
      ) : (
        <Button onClick={() => setShowNewSection(true)}>+ Add Section</Button>
      )}
    </div>
  );
}
