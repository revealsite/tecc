"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { addSection, updateSection, deleteSection } from "@/app/(protected)/admin/actions";
import type { NewsletterSection } from "@/lib/types";

interface SectionFormProps {
  newsletterId: string;
  section?: NewsletterSection;
  nextSortOrder: number;
  onCancel?: () => void;
}

export function SectionForm({ newsletterId, section, nextSortOrder, onCancel }: SectionFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    formData.set("newsletter_id", newsletterId);
    if (!section) {
      formData.set("sort_order", String(nextSortOrder));
      await addSection(formData);
    } else {
      await updateSection(section.id, formData);
    }
    formRef.current?.reset();
    setPending(false);
    onCancel?.();
  }

  async function handleDelete() {
    if (section && confirm("Delete this section and all its links?")) {
      await deleteSection(section.id, newsletterId);
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4 rounded-lg border border-border bg-white p-4">
      <Input
        id={`section_title_${section?.id ?? "new"}`}
        name="section_title"
        label="Section Title"
        required
        defaultValue={section?.section_title}
        placeholder="e.g. Featured Articles"
      />
      <Textarea
        id={`summary_${section?.id ?? "new"}`}
        name="summary"
        label="Summary (optional)"
        defaultValue={section?.summary ?? ""}
        placeholder="Brief description of this section..."
      />
      <Input
        id={`sort_order_${section?.id ?? "new"}`}
        name="sort_order"
        label="Sort Order"
        type="number"
        defaultValue={section?.sort_order ?? nextSortOrder}
      />
      <input type="hidden" name="newsletter_id" value={newsletterId} />
      <div className="flex gap-2">
        <Button type="submit" size="sm" loading={pending}>
          {section ? "Update Section" : "Add Section"}
        </Button>
        {section && (
          <Button type="button" variant="danger" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        )}
        {onCancel && (
          <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
