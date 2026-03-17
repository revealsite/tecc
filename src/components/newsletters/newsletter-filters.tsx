"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { MONTH_NAMES } from "@/lib/types";

interface NewsletterFiltersProps {
  availableYears: number[];
}

export function NewsletterFilters({ availableYears }: NewsletterFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentYear = searchParams.get("year") ?? "";
  const currentMonth = searchParams.get("month") ?? "";
  const currentSearch = searchParams.get("search") ?? "";

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-navy">Year</label>
        <select
          value={currentYear}
          onChange={(e) => updateParams("year", e.target.value)}
          className="rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-blue"
        >
          <option value="">All Years</option>
          {availableYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label className="block text-sm font-medium text-navy">Month</label>
        <select
          value={currentMonth}
          onChange={(e) => updateParams("month", e.target.value)}
          className="rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-blue"
        >
          <option value="">All Months</option>
          {MONTH_NAMES.map((name, i) => (
            <option key={i} value={i + 1}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-[200px] space-y-1">
        <label className="block text-sm font-medium text-navy">Search</label>
        <input
          type="text"
          value={currentSearch}
          onChange={(e) => updateParams("search", e.target.value)}
          placeholder="Search newsletters..."
          className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-blue"
        />
      </div>
    </div>
  );
}
