import type { Phone } from "@prisma/client";

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
}

export function serializePhoneCard(phone: Pick<
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
>): PhoneCardRecord {
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
    finalScore: phone.finalScore
  };
}
