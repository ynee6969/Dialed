"use client";

import { DeviceCard } from "@/components/phones/device-card";

interface GalleryPhone {
  id: string;
  slug: string;
  brand: string;
  model: string;
  segment: string;
  price: number;
  performanceScore: number;
  cameraScore: number;
  batteryScore: number;
  valueScore: number;
  finalScore: number;
}

interface GalleryGridProps {
  phones: GalleryPhone[];
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
