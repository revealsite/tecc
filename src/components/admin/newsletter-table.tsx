"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MONTH_NAMES } from "@/lib/types";
import { deleteNewsletter } from "@/app/(protected)/admin/actions";
import type { Newsletter } from "@/lib/types";

interface NewsletterTableProps {
  newsletters: Newsletter[];
}

export function NewsletterTable({ newsletters }: NewsletterTableProps) {
  async function handleDelete(id: string) {
    if (confirm("Delete this newsletter and all its sections?")) {
      await deleteNewsletter(id);
    }
  }

  if (newsletters.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-white p-12 text-center">
        <p className="text-medium-gray">No newsletters yet.</p>
        <Link
          href="/admin/new"
          className="mt-2 inline-block text-sm text-sky-blue hover:underline"
        >
          Create your first newsletter
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-light-gray">
            <th className="px-4 py-3 text-left font-medium text-navy">Year</th>
            <th className="px-4 py-3 text-left font-medium text-navy">Month</th>
            <th className="px-4 py-3 text-left font-medium text-navy">Title</th>
            <th className="px-4 py-3 text-left font-medium text-navy">Sections</th>
            <th className="px-4 py-3 text-left font-medium text-navy">Source</th>
            <th className="px-4 py-3 text-right font-medium text-navy">Actions</th>
          </tr>
        </thead>
        <tbody>
          {newsletters.map((nl) => (
            <tr key={nl.id} className="border-b border-border last:border-0 hover:bg-light-gray/50">
              <td className="px-4 py-3">
                <Badge variant="navy">{nl.year}</Badge>
              </td>
              <td className="px-4 py-3 text-medium-gray">
                {MONTH_NAMES[nl.month - 1]}
              </td>
              <td className="px-4 py-3 font-medium text-navy">{nl.title}</td>
              <td className="px-4 py-3 text-medium-gray">
                {nl.newsletter_sections?.length ?? 0}
              </td>
              <td className="px-4 py-3">
                <Badge variant={nl.source_type === "url" ? "blue" : "gray"}>
                  {nl.source_type}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Link href={`/admin/${nl.id}/sections`}>
                    <Button variant="secondary" size="sm">
                      Sections
                    </Button>
                  </Link>
                  <Link href={`/admin/${nl.id}`}>
                    <Button variant="secondary" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(nl.id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
