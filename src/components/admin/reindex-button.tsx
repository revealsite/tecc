"use client";

import { useState } from "react";
import { reindexNewsletter, reindexAllNewsletters } from "@/app/(protected)/admin/actions";

export function ReindexButton({ newsletterId }: { newsletterId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleReindex = async () => {
    setLoading(true);
    setMessage(null);
    const result = await reindexNewsletter(newsletterId);
    setLoading(false);
    if (result.error) {
      setMessage(`Error: ${result.error}`);
    } else {
      setMessage("Indexed successfully!");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleReindex}
        disabled={loading}
        className="rounded-md bg-sky-blue px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-blue-light transition-colors disabled:opacity-50"
      >
        {loading ? "Indexing..." : "Index for Search"}
      </button>
      {message && (
        <span className={`text-xs ${message.startsWith("Error") ? "text-red-500" : "text-green-600"}`}>
          {message}
        </span>
      )}
    </div>
  );
}

export function ReindexAllButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleReindexAll = async () => {
    setLoading(true);
    setMessage(null);
    const result = await reindexAllNewsletters();
    setLoading(false);
    if (result.error) {
      setMessage(`Error: ${result.error}`);
    } else {
      setMessage(`Indexed ${result.indexed} newsletter(s)`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleReindexAll}
        disabled={loading}
        className="rounded-md border border-sky-blue px-3 py-1.5 text-xs font-medium text-sky-blue hover:bg-sky-blue hover:text-white transition-colors disabled:opacity-50"
      >
        {loading ? "Indexing all..." : "Reindex All for Search"}
      </button>
      {message && (
        <span className={`text-xs ${message.startsWith("Error") ? "text-red-500" : "text-green-600"}`}>
          {message}
        </span>
      )}
    </div>
  );
}
