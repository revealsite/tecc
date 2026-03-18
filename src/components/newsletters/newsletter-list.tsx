import { NewsletterCard } from "./newsletter-card";
import type { Newsletter } from "@/lib/types";

interface NewsletterListProps {
  newsletters: Newsletter[];
  searchTerm?: string;
}

export function NewsletterList({ newsletters, searchTerm }: NewsletterListProps) {
  if (newsletters.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-white p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-medium-gray/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
          />
        </svg>
        <p className="mt-3 text-medium-gray font-medium">No newsletters found</p>
        <p className="mt-1 text-sm text-medium-gray/70">
          {searchTerm
            ? "Try adjusting your search or filters."
            : "Newsletters will appear here once added."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {newsletters.map((nl) => (
        <NewsletterCard
          key={nl.id}
          newsletter={nl}
          searchTerm={searchTerm}
        />
      ))}
    </div>
  );
}
