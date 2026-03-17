import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ExtractedLink {
  label: string;
  url: string;
}

interface ExtractedSection {
  section_title: string;
  summary: string;
  links: ExtractedLink[];
}

interface NewsletterAnalysis {
  suggested_title: string;
  overall_summary: string;
  key_topics: string[];
  sections: ExtractedSection[];
  content_text: string;
}

export async function analyzeNewsletterUrl(
  url: string,
  providedTitle?: string
): Promise<NewsletterAnalysis> {
  // Fetch the page content
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; TECC Newsletter Bot/1.0)",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status}`);
  }

  const html = await response.text();

  // Strip HTML to get text content (basic extraction)
  const textContent = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 15000); // Limit to ~15k chars to stay within token limits

  // Extract all links from the HTML
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const foundLinks: { url: string; text: string }[] = [];
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const linkUrl = match[1];
    const linkText = match[2].replace(/<[^>]+>/g, "").trim();
    if (
      linkText &&
      linkUrl &&
      !linkUrl.startsWith("#") &&
      !linkUrl.startsWith("mailto:") &&
      !linkUrl.startsWith("javascript:")
    ) {
      foundLinks.push({ url: linkUrl, text: linkText });
    }
  }

  const linksContext =
    foundLinks.length > 0
      ? `\n\nLinks found on the page:\n${foundLinks
          .slice(0, 100)
          .map((l) => `- "${l.text}" -> ${l.url}`)
          .join("\n")}`
      : "";

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an expert at analyzing tobacco education newsletters for the Tobacco Education Clearinghouse of California (TECC).

Your job is to analyze newsletter content and extract structured data. You must return valid JSON matching this exact schema:

{
  "suggested_title": "A concise title for this newsletter",
  "overall_summary": "A 2-3 sentence summary of the entire newsletter's content and themes",
  "key_topics": ["topic1", "topic2", "topic3"],
  "sections": [
    {
      "section_title": "Name of this section/topic area",
      "summary": "A 1-2 sentence summary of what this section covers",
      "links": [
        {
          "label": "Descriptive label for this link",
          "url": "https://..."
        }
      ]
    }
  ]
}

Guidelines:
- Create logical sections that group related content together
- Each section should have a clear, descriptive title
- Summaries should be informative but concise
- Only include links that are relevant and functional (full URLs, not relative paths)
- If a link URL is relative, try to make it absolute using the base URL
- key_topics should capture the main themes (3-8 topics)
- Typically newsletters have 3-8 sections
- Focus on tobacco education, public health, policy, and related topics`,
      },
      {
        role: "user",
        content: `Analyze this newsletter content from ${url}.${
          providedTitle ? ` The newsletter is titled "${providedTitle}".` : ""
        }

Content:
${textContent}
${linksContext}

Extract the structured sections, summaries, and relevant links.`,
      },
    ],
    temperature: 0.3,
    max_tokens: 4000,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  const analysis = JSON.parse(content) as NewsletterAnalysis;
  analysis.content_text = textContent;
  return analysis;
}
