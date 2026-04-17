import type { Phone } from "@prisma/client";

import type { PhoneReference, PhoneReferenceSection } from "@/lib/types/phone-reference";
import {
  createPhoneCatalogKey,
  getPhoneDisplayName,
  stripBrandFromModel
} from "@/lib/utils/phone-presentation";

const GSM_ARENA_BD_BASE = "https://www.gsmarena.com.bd";
const FALLBACK_SLUG_ALIASES: Record<string, string[]> = {
  [createPhoneCatalogKey("Realme", "Realme 12")]: ["realme-12-5g", "realme-12-4g"],
  [createPhoneCatalogKey("Infinix", "Note 40")]: ["infinix-note-40-4g", "infinix-note-40-5g"],
  [createPhoneCatalogKey("Vivo", "X100 Pro+")]: ["vivo-x100-ultra", "vivo-x100-pro"]
};

function slugifySegment(value: string) {
  return value
    .toLowerCase()
    .replace(/\+/g, " plus ")
    .replace(/&/g, " and ")
    .replace(/[()]/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function buildSlugCandidates(phone: Phone) {
  const dedupedModel = stripBrandFromModel(phone.brand, phone.model);
  const aliasKey = createPhoneCatalogKey(phone.brand, phone.model);
  const combined = slugifySegment(getPhoneDisplayName(phone.brand, phone.model));
  const modelOnly = slugifySegment(dedupedModel);
  const withoutNetwork = slugifySegment(`${phone.brand} ${dedupedModel.replace(/\b[245]g\b/gi, "").trim()}`);
  const withoutEdition = slugifySegment(
    `${phone.brand} ${dedupedModel.replace(/\b(global|special edition|se)\b/gi, "").trim()}`
  );

  return [
    ...new Set([
      ...(FALLBACK_SLUG_ALIASES[aliasKey] ?? []),
      combined,
      modelOnly,
      withoutNetwork,
      withoutEdition
    ].filter(Boolean))
  ];
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&apos;/gi, "'")
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function cleanHtmlText(value: string) {
  return decodeHtmlEntities(
    value
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+\n/g, "\n")
      .replace(/\n\s+/g, "\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim()
  );
}

function extractTitle(html: string) {
  const match = html.match(/<h1 class="ptitle">([\s\S]*?)<\/h1>/i);
  if (!match) {
    return null;
  }

  return cleanHtmlText(match[1]).replace(/\s+Full Specifications(?: and Price)?$/i, "").trim();
}

function extractImageUrl(html: string) {
  const match = html.match(/<img[^>]+src="([^"]*\/images\/products\/[^"]+)"[^>]*>/i);
  return match?.[1] ?? null;
}

function extractRowValue(sections: PhoneReferenceSection[], sectionTitle: string, labels: string[]) {
  const section = sections.find((entry) => entry.title.toLowerCase() === sectionTitle.toLowerCase());
  if (!section) {
    return null;
  }

  for (const label of labels) {
    const item = section.items.find((entry) => entry.label.toLowerCase() === label.toLowerCase());
    if (item?.value) {
      return item.value;
    }
  }

  return null;
}

function extractDisplaySize(value: string | null) {
  if (!value) {
    return null;
  }

  const match = value.match(/([\d.]+)\s*inches/i);
  return match ? `${match[1]}"` : value.split(",")[0].trim();
}

function extractResolution(value: string | null) {
  if (!value) {
    return null;
  }

  const match = value.match(/(\d+\s*x\s*\d+\s*pixels)/i);
  return match ? match[1].replace(/\s+/g, "") : value.split(",")[0].trim();
}

function extractCamera(value: string | null) {
  if (!value) {
    return null;
  }

  const match = value.match(/(\d+\s*MP)/i);
  return match ? match[1].replace(/\s+/g, "") : value.split(",")[0].trim();
}

function extractVideo(value: string | null) {
  if (!value) {
    return null;
  }

  if (/\b2160p\b/i.test(value) || /\b4k\b/i.test(value)) {
    return "2160p";
  }

  const match = value.match(/(\d{3,4}p)/i);
  return match ? match[1].toLowerCase() : value.split(",")[0].trim();
}

function normalizeRam(value: string | null) {
  if (!value) {
    return null;
  }

  const matches = [...value.matchAll(/(\d+)\s*GB/gi)].map((match) => Number(match[1]));
  if (!matches.length) {
    return value;
  }

  const unique = [...new Set(matches)].sort((left, right) => left - right);
  return `${unique.join("/")}GB RAM`;
}

function normalizeBattery(value: string | null) {
  if (!value) {
    return null;
  }

  const match = value.match(/(\d+)\s*mAh/i);
  return match ? `${match[1]}mAh` : value;
}

function normalizeCharging(value: string | null) {
  if (!value) {
    return null;
  }

  const match = value.match(/(\d+)\s*W/i);
  return match ? `${match[1]}W` : value.split(",")[0].trim();
}

function parseSections(html: string) {
  const sectionPattern =
    /<div class="specs_heading">([\s\S]*?)<\/div>\s*<table[^>]*class="table_specs"[^>]*>([\s\S]*?)<\/table>/gi;
  const rowPattern =
    /<tr[^>]*>\s*<td[^>]*?(?:class="specs_name")?[^>]*>\s*(?:<div class="specs_name">)?([\s\S]*?)(?:<\/div>)?\s*<\/td>\s*<td[^>]*class="specs_name2"[^>]*>([\s\S]*?)<\/td>\s*<\/tr>/gi;

  const sections: PhoneReferenceSection[] = [];

  for (const match of html.matchAll(sectionPattern)) {
    const title = cleanHtmlText(match[1]);
    const tableHtml = match[2];
    const items = Array.from(tableHtml.matchAll(rowPattern))
      .map((rowMatch) => ({
        label: cleanHtmlText(rowMatch[1]),
        value: cleanHtmlText(rowMatch[2])
      }))
      .filter((item) => item.label && item.value);

    if (title && items.length) {
      sections.push({ title, items });
    }
  }

  return sections;
}

function buildSummary(sections: PhoneReferenceSection[]) {
  return {
    displaySize: extractDisplaySize(extractRowValue(sections, "Display", ["Display Size"])),
    resolution: extractResolution(extractRowValue(sections, "Display", ["Display Resolution"])),
    cameraMain: extractCamera(extractRowValue(sections, "Camera", ["Primary Camera"])),
    video: extractVideo(extractRowValue(sections, "Camera", ["Video"])),
    memory: normalizeRam(extractRowValue(sections, "Memory", ["Ram", "Storage"])),
    chipset: extractRowValue(sections, "Platform", ["Chipset"]),
    battery: normalizeBattery(extractRowValue(sections, "Battery", ["Battery Capacity"])),
    charging: normalizeCharging(extractRowValue(sections, "Battery", ["Charging"]))
  };
}

function buildAlternativeNames(html: string) {
  const bodyText = cleanHtmlText(html);
  const match = bodyText.match(/Also known as\s+([^\n]+)/i);
  if (!match) {
    return [];
  }

  return match[1]
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

async function fetchCandidate(url: string) {
  const response = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    return null;
  }

  const html = await response.text();
  if (!/Full Specifications/i.test(html) || !/<div class="specs_heading">/i.test(html)) {
    return null;
  }

  return html;
}

export async function getGsmArenaBdReference(phone: Phone): Promise<PhoneReference | null> {
  const slugCandidates = buildSlugCandidates(phone);

  for (const slug of slugCandidates) {
    const sourceUrl = `${GSM_ARENA_BD_BASE}/specs/${slug}/`;
    const html = await fetchCandidate(sourceUrl).catch(() => null);

    if (!html) {
      continue;
    }

    const title = getPhoneDisplayName(phone.brand, extractTitle(html) ?? phone.model);
    const sections = parseSections(html);

    if (!sections.length) {
      continue;
    }

    return {
      title,
      imageUrl: extractImageUrl(html),
      sourceUrl,
      alternativeNames: buildAlternativeNames(html),
      summary: buildSummary(sections),
      sections,
      lastFetchedAt: new Date().toISOString()
    };
  }

  return null;
}
