import { Prisma, type Phone } from "@prisma/client";

export interface PhoneCardRecord {
  id: string;
  slug: string;
  brand: string;
  model: string;
  segment: string;
  price: number;
  performanceScore: number | null;
  cameraScore: number | null;
  batteryScore: number | null;
  valueScore: number | null;
  finalScore: number | null;
  imageUrl: string | null;
  sourceUrl: string | null;
  displaySpec: string | null;
  cameraSpec: string | null;
  chipsetSpec: string | null;
  batterySpec: string | null;
  memorySpec: string | null;
  chargingSpec: string | null;
}

interface PhoneCardReferencePreview {
  imageUrl: string | null;
  sourceUrl: string | null;
  displaySpec: string | null;
  cameraSpec: string | null;
  chipsetSpec: string | null;
  batterySpec: string | null;
  memorySpec: string | null;
  chargingSpec: string | null;
}

type PhoneCardSerializablePhone = Pick<
  Phone,
  | "id"
  | "slug"
  | "brand"
  | "model"
  | "segment"
  | "price"
  | "performanceScore"
  | "cameraScore"
  | "batteryScore"
  | "valueScore"
  | "finalScore"
  | "display"
  | "chipset"
  | "ram"
  | "storage"
  | "cameraMain"
  | "battery"
  | "charging"
> & {
  sources?: Array<{
    sourceUrl: string;
    rawExtraction: Prisma.JsonValue | null;
  }>;
};

function getStringValue(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function readSummaryValue(summary: Record<string, unknown> | undefined, key: string) {
  if (!summary) {
    return null;
  }

  return getStringValue(summary[key]);
}

function getFallbackMemory(phone: PhoneCardSerializablePhone) {
  if (phone.ram && phone.storage) {
    return `${phone.ram}/${phone.storage}GB`;
  }

  if (phone.ram) {
    return `${phone.ram}GB RAM`;
  }

  if (phone.storage) {
    return `${phone.storage}GB storage`;
  }

  return null;
}

function getReferencePreview(phone: PhoneCardSerializablePhone): PhoneCardReferencePreview {
  const source = phone.sources?.[0];
  const rawReference =
    source?.rawExtraction &&
    typeof source.rawExtraction === "object" &&
    !Array.isArray(source.rawExtraction)
      ? (source.rawExtraction as Record<string, unknown>)
      : null;
  const summary =
    rawReference?.summary &&
    typeof rawReference.summary === "object" &&
    !Array.isArray(rawReference.summary)
      ? (rawReference.summary as Record<string, unknown>)
      : undefined;

  return {
    imageUrl: getStringValue(rawReference?.imageUrl),
    sourceUrl: getStringValue(rawReference?.sourceUrl) ?? source?.sourceUrl ?? null,
    displaySpec: readSummaryValue(summary, "displaySize") ?? getStringValue(phone.display),
    cameraSpec:
      readSummaryValue(summary, "cameraMain") ??
      (phone.cameraMain ? `${phone.cameraMain}MP main camera` : null),
    chipsetSpec: readSummaryValue(summary, "chipset") ?? getStringValue(phone.chipset),
    batterySpec:
      readSummaryValue(summary, "battery") ??
      (phone.battery ? `${phone.battery}mAh battery` : null),
    memorySpec: readSummaryValue(summary, "memory") ?? getFallbackMemory(phone),
    chargingSpec:
      readSummaryValue(summary, "charging") ??
      (phone.charging ? `${phone.charging}W charging` : null)
  };
}

export function serializePhoneCard(phone: PhoneCardSerializablePhone): PhoneCardRecord {
  const preview = getReferencePreview(phone);

  return {
    id: phone.id,
    slug: phone.slug,
    brand: phone.brand,
    model: phone.model,
    segment: phone.segment,
    price: phone.price,
    performanceScore: phone.performanceScore,
    cameraScore: phone.cameraScore,
    batteryScore: phone.batteryScore,
    valueScore: phone.valueScore,
    finalScore: phone.finalScore,
    imageUrl: preview.imageUrl,
    sourceUrl: preview.sourceUrl,
    displaySpec: preview.displaySpec,
    cameraSpec: preview.cameraSpec,
    chipsetSpec: preview.chipsetSpec,
    batterySpec: preview.batterySpec,
    memorySpec: preview.memorySpec,
    chargingSpec: preview.chargingSpec
  };
}
