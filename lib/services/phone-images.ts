import phoneImageManifest from "@/lib/data/phone-image-manifest.json";

const manifest = phoneImageManifest as Record<string, string>;

export function getLocalPhoneImageUrl(slug: string) {
  return manifest[slug] ?? null;
}

export function resolvePhoneImageUrl(slug: string, fallbackUrl: string | null | undefined) {
  return getLocalPhoneImageUrl(slug) ?? fallbackUrl ?? null;
}
