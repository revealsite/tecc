import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NewsletterFilters } from "@/components/newsletters/newsletter-filters";
import { NewsletterList } from "@/components/newsletters/newsletter-list";
import type { Newsletter } from "@/lib/types";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string; search?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let newsletters: Newsletter[] = [];

  if (params.search) {
    // Use the RPC function for full-text search across all fields
    const { data: matchingIds } = await supabase.rpc("search_newsletters", {
      search_term: params.search,
    });

    if (matchingIds && matchingIds.length > 0) {
      let query = supabase
        .from("newsletters")
        .select("*, newsletter_sections(*, section_links(*))")
        .in("id", matchingIds)
        .order("year", { ascending: false })
        .order("month", { ascending: false });

      if (params.year) {
        query = query.eq("year", parseInt(params.year));
      }
      if (params.month) {
        query = query.eq("month", parseInt(params.month));
      }

      const { data } = await query;
      newsletters = (data as Newsletter[]) ?? [];
    }
  } else {
    // No search term — simple filter query
    let query = supabase
      .from("newsletters")
      .select("*, newsletter_sections(*, section_links(*))")
      .order("year", { ascending: false })
      .order("month", { ascending: false });

    if (params.year) {
      query = query.eq("year", parseInt(params.year));
    }
    if (params.month) {
      query = query.eq("month", parseInt(params.month));
    }

    const { data } = await query;
    newsletters = (data as Newsletter[]) ?? [];
  }

  // Get distinct years for filter
  const { data: yearRows } = await supabase
    .from("newsletters")
    .select("year")
    .order("year", { ascending: false });

  const availableYears = [...new Set(yearRows?.map((r) => r.year) ?? [])];

  // Sort sections/links by sort_order
  const sorted = newsletters.map((nl) => ({
    ...nl,
    newsletter_sections: nl.newsletter_sections
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((s) => ({
        ...s,
        section_links: s.section_links.sort((a, b) => a.sort_order - b.sort_order),
      })),
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-light-gray/30">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navy">Newsletter Archive</h1>
            <p className="mt-1 text-medium-gray">
              Browse newsletters from the Tobacco Education Clearinghouse of California
            </p>
          </div>

          <div className="mb-6">
            <Suspense fallback={null}>
              <NewsletterFilters availableYears={availableYears} />
            </Suspense>
          </div>

          {sorted.length > 0 && (
            <p className="mb-4 text-sm text-medium-gray">
              {sorted.length} newsletter{sorted.length !== 1 ? "s" : ""} found
            </p>
          )}

          <NewsletterList
            newsletters={sorted}
            searchTerm={params.search}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
