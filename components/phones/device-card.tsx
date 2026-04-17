"use client";

import Link from "next/link";

import { FavoriteButton } from "@/components/phones/favorite-button";
import { usePhoneReference } from "@/components/phones/use-phone-reference";
import type { PhoneCardRecord } from "@/lib/types/phone-card";
import { buildPhoneMarketplaceLinks, getPhoneDisplayName } from "@/lib/utils/phone-presentation";
import { formatPhp, formatScore } from "@/lib/utils/format";

interface DeviceCardProps {
  phone: PhoneCardRecord;
  variant?: "dashboard" | "gallery";
}

function renderSummaryLines(lines: Array<string | null | undefined>) {
  const filtered = lines.filter((line): line is string => Boolean(line && line.trim().length > 0));
  if (!filtered.length) {
    return (
      <ul className="spec-summary-list">
        <li>Specs are loading from the reference source...</li>
      </ul>
    );
  }

  return (
    <ul className="spec-summary-list">
      {filtered.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  );
}

export function DeviceCard({ phone, variant = "dashboard" }: DeviceCardProps) {
  const { containerRef, reference, loading, error } = usePhoneReference(phone.slug);
  const summary = reference?.summary;
  const imageUrl = reference?.imageUrl;
  const isGallery = variant === "gallery";
  const displayName = getPhoneDisplayName(phone.brand, phone.model);
  const marketplaceLinks = buildPhoneMarketplaceLinks(phone);

  const summaryLines = [
    summary?.displaySize,
    summary?.resolution,
    summary?.cameraMain,
    summary?.memory,
    summary?.chipset,
    summary?.battery,
    summary?.charging
  ];

  return (
    <article ref={containerRef} className={`glass-panel phone-card ${isGallery ? "gallery-card" : "dashboard-card"}`}>
      <div className="phone-card-top">
        <div className="pill-row">
          <span className="pill">{phone.segment.replace(/_/g, " ")}</span>
          <span className="score-badge">{formatScore(phone.finalScore)}</span>
        </div>
        <FavoriteButton phoneId={phone.id} variant="full" />
      </div>

      <div className="phone-media">
        {imageUrl ? (
          <img src={imageUrl} alt={displayName} loading="lazy" />
        ) : (
          <div className="phone-media-placeholder">{phone.brand.slice(0, 1)}</div>
        )}
      </div>

      <div className="phone-card-body">
        <div className="phone-headline">
          <div>
            <h3>{displayName}</h3>
            <p className="muted" style={{ margin: 0 }}>
              {formatPhp(phone.price)}
            </p>
          </div>
        </div>

        {!isGallery ? (
          <div className="metric-grid">
            <div className="metric">
              <span>Performance</span>
              <strong>{formatScore(phone.performanceScore)}</strong>
            </div>
            <div className="metric">
              <span>Camera</span>
              <strong>{formatScore(phone.cameraScore)}</strong>
            </div>
            <div className="metric">
              <span>Battery</span>
              <strong>{formatScore(phone.batteryScore)}</strong>
            </div>
            <div className="metric">
              <span>Value</span>
              <strong>{formatScore(phone.valueScore)}</strong>
            </div>
          </div>
        ) : null}

        <div className="phone-summary-block">
          {renderSummaryLines(summaryLines)}
          {loading ? <p className="muted card-meta-note">Fetching reference specs...</p> : null}
          {error ? <p className="muted card-meta-note">Reference unavailable right now.</p> : null}
        </div>

        <div className="phone-card-actions">
          <div className="card-primary-actions">
            <Link href={`/phones/${phone.slug}`} className="button-secondary">
              View full specs
            </Link>
            <Link href={`/compare?left=${phone.slug}`} className="button">
              Compare
            </Link>
          </div>
          <div className="marketplace-actions">
            <a href={marketplaceLinks.lazada} target="_blank" rel="noreferrer noopener" className="button-ghost">
              Lazada
            </a>
            <a href={marketplaceLinks.shopee} target="_blank" rel="noreferrer noopener" className="button-ghost">
              Shopee
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
