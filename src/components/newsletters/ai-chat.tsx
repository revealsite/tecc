"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Newsletter } from "@/lib/types";
import { MONTH_NAMES } from "@/lib/types";

interface AiChatProps {
  newsletter: Newsletter;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AiChat({ newsletter }: AiChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load previous messages on mount
  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat?newsletter_id=${newsletter.id}`);
      const data = await res.json();
      if (data.messages?.length > 0) {
        setMessages(data.messages.map((m: Message) => ({ role: m.role, content: m.content })));
      }
    } catch {
      // Silently fail — fresh chat is fine
    } finally {
      setLoadingHistory(false);
    }
  }, [newsletter.id]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          newsletterId: newsletter.id,
          newsletterContext: {
            title: newsletter.title,
            year: newsletter.year,
            month: MONTH_NAMES[newsletter.month - 1],
            overall_summary: newsletter.overall_summary,
            key_topics: newsletter.key_topics,
            sections: newsletter.newsletter_sections.map((s) => ({
              section_title: s.section_title,
              summary: s.summary,
              links: s.section_links.map((l) => ({
                label: l.label,
                url: l.url,
              })),
            })),
          },
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer || data.error },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col" style={{ height: "50vh" }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {loadingHistory ? (
          <div className="text-center py-8">
            <p className="text-sm text-medium-gray">Loading conversation...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-medium-gray">
              Ask anything about this newsletter
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {[
                "Summarize the key points",
                "What resources are mentioned?",
                "What are the health risks discussed?",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="rounded-full border border-border px-3 py-1 text-xs text-medium-gray hover:border-sky-blue hover:text-sky-blue transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-navy text-white"
                  : "bg-light-gray text-foreground"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-light-gray rounded-lg px-3 py-2 text-sm text-medium-gray">
              <span className="inline-flex gap-1">
                <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this newsletter..."
          className="flex-1 rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-blue focus:border-sky-blue"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
}
