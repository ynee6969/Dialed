export interface PhoneReferenceItem {
  label: string;
  value: string;
}

export interface PhoneReferenceSection {
  title: string;
  items: PhoneReferenceItem[];
}

export interface PhoneReferenceSummary {
  displaySize: string | null;
  resolution: string | null;
  cameraMain: string | null;
  video: string | null;
  memory: string | null;
  chipset: string | null;
  battery: string | null;
  charging: string | null;
}

export interface PhoneReference {
  title: string;
  imageUrl: string | null;
  sourceUrl: string;
  alternativeNames: string[];
  summary: PhoneReferenceSummary;
  sections: PhoneReferenceSection[];
  lastFetchedAt: string;
}
