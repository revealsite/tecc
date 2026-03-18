import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TECC Newsletter Bot/1.0)",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Fetch failed: ${response.status}` }, { status: 502 });
    }

    const html = await response.text();
    return NextResponse.json({ html });
  } catch {
    return NextResponse.json({ error: "Failed to fetch newsletter" }, { status: 502 });
  }
}
