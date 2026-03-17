import { Card } from "@/components/ui/card";
import { NewsletterForm } from "@/components/admin/newsletter-form";
import { createNewsletter } from "../actions";

export default function NewNewsletterPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Add Newsletter</h1>
        <p className="text-sm text-medium-gray">
          Create a new newsletter entry
        </p>
      </div>

      <Card className="p-6">
        <NewsletterForm action={createNewsletter} />
      </Card>
    </div>
  );
}
