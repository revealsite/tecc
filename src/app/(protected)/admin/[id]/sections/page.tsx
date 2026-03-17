import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionManager } from "@/components/admin/section-manager";
import { MONTH_NAMES } from "@/lib/types";
import type { Newsletter } from "@/lib/types";

export default async function SectionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: newsletter } = await supabase
    .from("newsletters")
    .select("*, newsletter_sections(*, section_links(*))")
    .eq("id", id)
    .single();

  if (!newsletter) {
    notFound();
  }

  const nl = newsletter as Newsletter;

  // Sort sections and links by sort_order
  nl.newsletter_sections.sort((a, b) => a.sort_order - b.sort_order);
  nl.newsletter_sections.forEach((s) => {
    s.section_links.sort((a, b) => a.sort_order - b.sort_order);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-navy">{nl.title}</h1>
            <Badge>{nl.year}</Badge>
            <Badge variant="blue">{MONTH_NAMES[nl.month - 1]}</Badge>
          </div>
          <p className="text-sm text-medium-gray">
            Manage sections and links
            {nl.ai_processed && (
              <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                AI Generated
              </span>
            )}
          </p>
        </div>
        <Link href={`/admin/${nl.id}`}>
          <Button variant="secondary">Edit Details</Button>
        </Link>
      </div>

      {nl.overall_summary && (
        <Card className="p-4">
          <h3 className="text-sm font-medium text-navy mb-1">AI Summary</h3>
          <p className="text-sm text-medium-gray">{nl.overall_summary}</p>
          {nl.key_topics && nl.key_topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {nl.key_topics.map((topic) => (
                <Badge key={topic} variant="blue">{topic}</Badge>
              ))}
            </div>
          )}
        </Card>
      )}

      <SectionManager newsletter={nl} />
    </div>
  );
}
