import { env } from "@/lib/env";
import { getCachedValue, setCachedValue } from "@/lib/services/cache";
import { enforceRateLimit } from "@/lib/services/rate-limit";

const SCRAPE_TTL_MS = 1000 * 60 * 60 * 6;

export async function fetchCleanMarkdown(url: string) {
  const cacheKey = `firecrawl:${url}`;
  const cached = getCachedValue<string>(cacheKey);

  if (cached) {
    return cached;
  }

  enforceRateLimit("firecrawl", 20, 60_000);

  let markdown: string | null = null;

  if (env.FIRECRAWL_API_KEY) {
    const response = await fetch(`${env.FIRECRAWL_BASE_URL}/scrape`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({
        url,
        formats: ["markdown"],
        onlyMainContent: true,
        maxAge: 86_400_000
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Firecrawl scrape failed: ${response.status} ${text}`);
    }

    const data = (await response.json()) as {
      data?: { markdown?: string };
      markdown?: string;
    };
    markdown = data.data?.markdown ?? data.markdown ?? null;
  } else {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "AI Phone Matchmaker/1.0"
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Direct fetch failed: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    markdown = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  if (!markdown) {
    throw new Error("No markdown returned from source fetch.");
  }

  const trimmed = markdown.slice(0, 22_000);
  setCachedValue(cacheKey, trimmed, SCRAPE_TTL_MS);
  return trimmed;
}
