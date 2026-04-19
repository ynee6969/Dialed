"use client";

/**
 * ===================================
 * DEVICE CARD
 * ===================================
 *
 * Purpose:
 * Displays one phone in the dashboard or favorites grid.
 *
 * Responsibilities:
 * - Present the phone name, price, key scores, and quick specs.
 * - Offer compare, favorite, and marketplace actions.
 * - Add subtle motion on pointer devices without breaking touch layouts.
 */
import Link from "next/link";
import { BatteryCharging, Camera, Cpu, Sparkles, Zap } from "lucide-react";
import { useRef } from "react";

import { FavoriteButton } from "@/components/phones/favorite-button";
import type { PhoneCardRecord } from "@/lib/types/phone-card";
import { formatPhp, formatScore } from "@/lib/utils/format";
import { buildPhoneMarketplaceLinks, getPhoneDisplayName } from "@/lib/utils/phone-presentation";
import styles from "./DeviceCard.module.css";

interface DeviceCardProps {
  phone: PhoneCardRecord;
  variant?: "dashboard" | "gallery";
}

interface StatRow {
  label: string;
  icon: typeof Sparkles;
  value: number | null;
}

/* Keeps all progress bars inside a consistent 0-100 range. */
function clampScore(value: number | null) {
  return Math.max(0, Math.min(100, Math.round(value ?? 0)));
}

/* Build up to three compact chips from the preview spec fields that were serialized server-side. */
function buildSpecChips(phone: PhoneCardRecord) {
  return [phone.displaySpec, phone.chipsetSpec, phone.batterySpec]
    .filter((value): value is string => Boolean(value))
    .slice(0, 3);
}

/* Build the deeper fact boxes that sit below the score bars. */
function buildDetailCards(phone: PhoneCardRecord) {
  return [
    {
      label: "Camera",
      value: phone.cameraSpec
    },
    {
      label: "Memory",
      value: phone.memorySpec
    },
    {
      label: "Charging",
      value: phone.chargingSpec
    }
  ].filter((item) => Boolean(item.value));
}

export function DeviceCard({ phone }: DeviceCardProps) {
  /* Ref is used only for hover tilt and glow positioning. */
  const cardRef = useRef<HTMLElement | null>(null);
  const displayName = getPhoneDisplayName(phone.brand, phone.model);
  const marketplaceLinks = buildPhoneMarketplaceLinks(phone);
  const specChips = buildSpecChips(phone);
  const detailCards = buildDetailCards(phone);
  const statRows: StatRow[] = [
    { label: "Performance", icon: Zap, value: phone.performanceScore },
    { label: "Camera", icon: Camera, value: phone.cameraScore },
    { label: "Battery", icon: BatteryCharging, value: phone.batteryScore },
    { label: "Value", icon: Cpu, value: phone.valueScore }
  ];

  /* Desktop pointer movement updates CSS variables that drive the card tilt and internal glow. */
  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    if (!cardRef.current || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const bounds = cardRef.current.getBoundingClientRect();
    const offsetX = event.clientX - bounds.left;
    const offsetY = event.clientY - bounds.top;
    const rotateX = ((offsetY / bounds.height) - 0.5) * -8;
    const rotateY = ((offsetX / bounds.width) - 0.5) * 8;

    cardRef.current.style.setProperty("--card-rotate-x", `${rotateX.toFixed(2)}deg`);
    cardRef.current.style.setProperty("--card-rotate-y", `${rotateY.toFixed(2)}deg`);
    cardRef.current.style.setProperty("--card-glow-x", `${offsetX.toFixed(0)}px`);
    cardRef.current.style.setProperty("--card-glow-y", `${offsetY.toFixed(0)}px`);
  }

  /* Reset card transform variables when the pointer leaves. */
  function resetPointerState() {
    if (!cardRef.current) {
      return;
    }

    cardRef.current.style.setProperty("--card-rotate-x", "0deg");
    cardRef.current.style.setProperty("--card-rotate-y", "0deg");
    cardRef.current.style.setProperty("--card-glow-x", "50%");
    cardRef.current.style.setProperty("--card-glow-y", "50%");
  }

  return (
    <article
      ref={cardRef}
      className={`glass-panel phone-card ${styles.scope}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointerState}
    >
      <div className="phone-card-glow" aria-hidden="true" />

      {/* Top row: segment badge on the left, favorite action on the right. */}
      <div className="phone-card-top">
        <span className="pill phone-card-segment">{phone.segment.replace(/_/g, " ")}</span>
        <FavoriteButton phoneId={phone.id} variant="full" className="phone-card-favorite" />
      </div>

      {/* Quick score + price snapshot before the user reads the rest of the card. */}
      <div className="phone-card-score-strip">
        <div className="phone-card-score-panel">
          <span>Dialed score</span>
          <strong>{formatScore(phone.finalScore)}</strong>
        </div>
        <div className="phone-card-price-panel">
          <span>Starts at</span>
          <strong>{formatPhp(phone.price)}</strong>
        </div>
      </div>

      {/* Product image area falls back to an initial when no local/remote artwork exists. */}
      <div className="phone-media">
        {phone.imageUrl ? (
          <img src={phone.imageUrl} alt={displayName} loading="lazy" decoding="async" />
        ) : (
          <div className="phone-media-placeholder">{phone.brand.slice(0, 1)}</div>
        )}
      </div>

      <div className="phone-card-body">
        {/* Headline block explains what the user can do with this card. */}
        <div className="phone-headline">
          <div>
            <h3>{displayName}</h3>
            <p className="muted phone-card-subcopy">
              Compare it side by side, save it for later, or drill into the full spec sheet.
            </p>
          </div>
        </div>

        {/* Chips expose the fastest scannable specs from the cached preview payload. */}
        <div className="phone-card-chip-row">
          {specChips.length ? (
            specChips.map((spec) => (
              <span key={spec} className="chip phone-card-chip">
                {spec}
              </span>
            ))
          ) : (
            <span className="chip phone-card-chip">Preview specs ready after sync</span>
          )}
        </div>

        {/* Animated stat rows help the card feel more "alive" without changing the data model. */}
        <div className="phone-card-stat-stack">
          {statRows.map((stat) => {
            const Icon = stat.icon;
            const progress = clampScore(stat.value);

            return (
              <div key={stat.label} className="phone-stat-row">
                <div className="phone-stat-label">
                  <span>
                    <Icon size={14} />
                    {stat.label}
                  </span>
                  <strong>{formatScore(stat.value)}</strong>
                </div>
                <div className="phone-stat-track">
                  <span className="phone-stat-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail chips are optional because not every phone has every enriched field. */}
        {detailCards.length ? (
          <div className="phone-card-detail-grid">
            {detailCards.map((detail) => (
              <div key={detail.label} className="phone-detail-chip">
                <span>{detail.label}</span>
                <strong>{detail.value}</strong>
              </div>
            ))}
          </div>
        ) : null}

        {/* Primary actions stay inside the card so the dashboard grid is self-sufficient. */}
        <div className="phone-card-actions">
          <div className="card-primary-actions">
            <Link href={`/phones/${phone.slug}`} className="button-secondary magnetic-button">
              View full specs
            </Link>
            <Link href={`/compare?left=${phone.slug}`} className="button magnetic-button">
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
