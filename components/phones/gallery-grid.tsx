"use client";

import { DeviceCard } from "@/components/phones/device-card";
import type { PhoneCardRecord } from "@/lib/types/phone-card";

interface GalleryGridProps {
  phones: PhoneCardRecord[];
}

export function GalleryGrid({ phones }: GalleryGridProps) {
  return (
    <div className="gallery-grid">
      {phones.map((phone) => (
        <DeviceCard key={phone.id} phone={phone} variant="gallery" />
      ))}
    </div>
  );
}
