"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MONTH_NAMES } from "@/lib/types";
import type { Newsletter } from "@/lib/types";

interface NewsletterFormProps {
  newsletter?: Newsletter;
  action: (formData: FormData) => void;
}

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 20 }, (_, i) => ({
  value: String(currentYear - i),
  label: String(currentYear - i),
}));

const monthOptions = MONTH_NAMES.map((name, i) => ({
  value: String(i + 1),
  label: name,
}));

export function NewsletterForm({ newsletter, action }: NewsletterFormProps) {
  const [sourceType, setSourceType] = useState<"url" | "file">(
    newsletter?.source_type ?? "url"
  );

  return (
    <form action={action} className="space-y-6">
      <Input
        id="title"
        name="title"
        label="Newsletter Title"
        required
        defaultValue={newsletter?.title}
        placeholder="e.g. Spring 2024 Newsletter"
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          id="year"
          name="year"
          label="Year"
          required
          options={yearOptions}
          defaultValue={newsletter ? String(newsletter.year) : ""}
          placeholder="Select year"
        />
        <Select
          id="month"
          name="month"
          label="Month"
          required
          options={monthOptions}
          defaultValue={newsletter ? String(newsletter.month) : ""}
          placeholder="Select month"
        />
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-navy">Source Type</legend>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="source_type"
              value="url"
              checked={sourceType === "url"}
              onChange={() => setSourceType("url")}
              className="accent-sky-blue"
            />
            URL
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="source_type"
              value="file"
              checked={sourceType === "file"}
              onChange={() => setSourceType("file")}
              className="accent-sky-blue"
            />
            File Upload
          </label>
        </div>
      </fieldset>

      {sourceType === "url" && (
        <Input
          id="source_url"
          name="source_url"
          label="Newsletter URL"
          type="url"
          defaultValue={newsletter?.source_url ?? ""}
          placeholder="https://example.com/newsletter.pdf"
        />
      )}

      {sourceType === "file" && (
        <p className="text-sm text-medium-gray">
          You can upload a file after creating the newsletter.
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit">
          {newsletter ? "Update Newsletter" : "Create Newsletter"}
        </Button>
      </div>
    </form>
  );
}
