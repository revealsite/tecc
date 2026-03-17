import { NewsletterCard } from "./newsletter-card";
import type { Newsletter } from "@/lib/types";

interface NewsletterListProps {
  newsletters: Newsletter[];
}

export function NewsletterList({ newsletters }: NewsletterListProps) {
  if (newsletters.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-white p-12 text-center">
        <p className="text-medium-gray">No newsletters found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {newsletters.map((nl) => (
        <NewsletterCard key={nl.id} newsletter={nl} />
      ))}
    </div>
  );
}
