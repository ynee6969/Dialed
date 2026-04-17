import type { SeedPhone } from "@/lib/data/seed-phones";

export type TrustedSourceKind = "gsmarena" | "kimovil" | "nanoreview";

export interface SourceDocument {
  kind: TrustedSourceKind;
  url: string;
  markdown: string;
  fetchedAt: Date;
}

export interface ExtractionContext {
  phone: SeedPhone;
  document: SourceDocument;
  prompt: string;
}

export interface ExtractionResult {
  provider: string;
  payload: unknown;
}

export interface ExtractionProvider {
  name: string;
  isConfigured(): boolean;
  extractPhoneSpecs(context: ExtractionContext): Promise<ExtractionResult>;
}
