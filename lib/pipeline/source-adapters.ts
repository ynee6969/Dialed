import type { SeedPhone } from "@/lib/data/seed-phones";

import type { TrustedSourceKind } from "@/lib/ai/types";
import { getPhoneDisplayName } from "@/lib/utils/phone-presentation";

export interface SourceCandidate {
  kind: TrustedSourceKind;
  url: string;
}

function buildQuery(phone: SeedPhone) {
  return encodeURIComponent(getPhoneDisplayName(phone.brand, phone.model));
}

export function buildTrustedSourceCandidates(phone: SeedPhone): SourceCandidate[] {
  const query = buildQuery(phone);

  return [
    {
      kind: "gsmarena",
      url: `https://www.gsmarena.com/results.php3?sQuickSearch=yes&sName=${query}`
    },
    {
      kind: "kimovil",
      url: `https://www.kimovil.com/en/search?q=${query}`
    },
    {
      kind: "nanoreview",
      url: `https://nanoreview.net/en/search?q=${query}`
    }
  ];
}
