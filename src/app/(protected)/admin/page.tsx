import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NewsletterTable } from "@/components/admin/newsletter-table";
import { Button } from "@/components/ui/button";
import type { Newsletter } from "@/lib/types";

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: newsletters } = await supabase
    .from("newsletters")
    .select("*, newsletter_sections(id)")
    .order("year", { ascending: false })
    .order("month", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Newsletters</h1>
          <p className="text-sm text-medium-gray">
            Manage your newsletter archive
          </p>
        </div>
        <Link href="/admin/new">
          <Button>Add Newsletter</Button>
        </Link>
      </div>

      <NewsletterTable newsletters={(newsletters as Newsletter[]) ?? []} />
    </div>
  );
}
