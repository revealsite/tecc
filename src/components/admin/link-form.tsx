"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addLink, updateLink, deleteLink } from "@/app/(protected)/admin/actions";
import type { SectionLink } from "@/lib/types";

interface LinkFormProps {
  sectionId: string;
  newsletterId: string;
  link?: SectionLink;
  nextSortOrder: number;
  onCancel?: () => void;
}

export function LinkForm({ sectionId, newsletterId, link, nextSortOrder, onCancel }: LinkFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    formData.set("section_id", sectionId);
    formData.set("newsletter_id", newsletterId);
    if (!link) {
      formData.set("sort_order", String(nextSortOrder));
      await addLink(formData);
    } else {
      await updateLink(link.id, formData);
    }
    formRef.current?.reset();
    setPending(false);
    onCancel?.();
  }

  async function handleDelete() {
    if (link && confirm("Delete this link?")) {
      await deleteLink(link.id, newsletterId);
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-wrap items-end gap-3 rounded-md border border-border bg-light-gray p-3">
      <div className="flex-1 min-w-[150px]">
        <Input
          id={`label_${link?.id ?? "new"}`}
          name="label"
          label="Label"
          required
          defaultValue={link?.label}
          placeholder="Link text"
        />
      </div>
      <div className="flex-1 min-w-[200px]">
        <Input
          id={`url_${link?.id ?? "new"}`}
          name="url"
          label="URL"
          type="url"
          required
          defaultValue={link?.url}
          placeholder="https://..."
        />
      </div>
      <div className="w-20">
        <Input
          id={`link_sort_${link?.id ?? "new"}`}
          name="sort_order"
          label="Order"
          type="number"
          defaultValue={link?.sort_order ?? nextSortOrder}
        />
      </div>
      <input type="hidden" name="section_id" value={sectionId} />
      <input type="hidden" name="newsletter_id" value={newsletterId} />
      <div className="flex gap-2">
        <Button type="submit" size="sm" loading={pending}>
          {link ? "Update" : "Add"}
        </Button>
        {link && (
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
