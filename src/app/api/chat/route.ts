import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export async function GET(request: NextRequest) {
  const newsletterId = request.nextUrl.searchParams.get("newsletter_id");

  if (!newsletterId) {
    return NextResponse.json({ error: "Missing newsletter_id" }, { status: 400 });
  }

  const { data: messages } = await supabase
    .from("newsletter_chat_messages")
    .select("role, content, created_at")
    .eq("newsletter_id", newsletterId)
    .order("created_at", { ascending: true });

  return NextResponse.json({ messages: messages ?? [] });
}

export async function POST(request: NextRequest) {
  const { question, newsletterId, newsletterContext } = await request.json();

  if (!question || !newsletterContext || !newsletterId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Load previous messages for conversational context
  const { data: history } = await supabase
    .from("newsletter_chat_messages")
    .select("role, content")
    .eq("newsletter_id", newsletterId)
    .order("created_at", { ascending: true })
    .limit(20);

  const chatHistory = (history ?? []).map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  // Save user message
  await supabase.from("newsletter_chat_messages").insert({
    newsletter_id: newsletterId,
    role: "user",
    content: question,
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant for the Tobacco Education Clearinghouse of California (TECC). You answer questions strictly based on the newsletter content provided below. If the answer is not in the newsletter, say so clearly. Keep answers concise and helpful.

Newsletter: "${newsletterContext.title}" (${newsletterContext.month}/${newsletterContext.year})

Summary: ${newsletterContext.overall_summary || "N/A"}

Sections:
${newsletterContext.sections
  .map(
    (s: { section_title: string; summary: string; links: { label: string; url: string }[] }) =>
      `## ${s.section_title}\n${s.summary}\nLinks: ${s.links.map((l: { label: string; url: string }) => `${l.label} (${l.url})`).join(", ") || "None"}`
  )
  .join("\n\n")}

Key Topics: ${newsletterContext.key_topics?.join(", ") || "N/A"}`,
      },
      ...chatHistory,
      {
        role: "user",
        content: question,
      },
    ],
    temperature: 0.3,
    max_tokens: 1000,
  });

  const answer = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

  // Save assistant response
  await supabase.from("newsletter_chat_messages").insert({
    newsletter_id: newsletterId,
    role: "assistant",
    content: answer,
  });

  return NextResponse.json({ answer });
}
