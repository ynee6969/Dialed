"use client";

/**
 * ===================================
 * HOME HERO SECTION
 * ===================================
 *
 * Purpose:
 * Delivers the first-screen story for the website and funnels people toward
 * the two main actions: browsing the catalog and opening the compare flow.
 *
 * This component mixes:
 * - motion-driven presentation
 * - prefetching for snappier navigation
 * - animated count-up metrics
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BarChart3, BatteryCharging, Camera, Layers3, Sparkles, Zap } from "lucide-react";
import { useEffect } from "react";

import { InstantNavLink } from "@/components/navigation/instant-nav-link";
import styles from "./HeroSection.module.css";

interface HeroSectionProps {
  catalogSize: number;
  segmentCount: number;
}

/* Compact statistic card used in the hero's quick-metrics grid. */
function CountMetric({
  label,
  value,
  suffix = ""
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="hero-stat-card">
      <span>{label}</span>
      <strong>
        {value}
        {suffix}
      </strong>
    </div>
  );
}

export function HeroSection({ catalogSize, segmentCount }: HeroSectionProps) {
  const router = useRouter();

  /* Prefetch the two most likely next pages so the main CTA feels immediate. */
  useEffect(() => {
    router.prefetch("/dashboard");
    router.prefetch("/recommend");
  }, [router]);

  /* Story cards explain the problem-solution arc in a compact visual format. */
  const storyPoints = [
    {
      icon: Layers3,
      title: "Many sources",
      copy: "Phone details are often spread across store pages, reviews, and spec sheets."
    },
    {
      icon: BarChart3,
      title: "One place to compare",
      copy: "DeviceIQ brings phone browsing, saved phones, and comparison together."
    },
    {
      icon: Sparkles,
      title: "Make an informed choice",
      copy: "Use filters, compare specifications, and review the scores."
    }
  ];

  /* These rows preview the comparison view with static score bars. */
  const revealRows = [
    { label: "Camera", left: 99, right: 91 },
    { label: "Battery", left: 93, right: 88 },
    { label: "Performance", left: 98, right: 90 }
  ];

  return (
    <section className={`section home-hero-section ${styles.scope}`}>
      <div className="page-shell hero-grid premium-hero-grid">
        {/* Left column: core message, CTA buttons, and problem-solution cards. */}
        <div
          className="glass-panel hero-panel premium-hero-panel"
        >
          <div className="hero-noise" aria-hidden="true" />
          <div className="hero-copy-stack">
            <span className="section-label">DeviceIQ</span>
            <h1 className="section-title">Set priorities, get recommendations, and choose a phone.</h1>
            <p className="section-copy">
              Set your requirements, choose what matters most, and receive a ranked shortlist. Compare specifications and save phones for later.
            </p>

            <div className="button-row hero-action-row">
              <InstantNavLink href="/recommend" className="button magnetic-button" loadingLabel="Opening recommendations...">
                Get recommendations <ArrowRight size={16} />
              </InstantNavLink>
              <Link href="/compare" className="button-secondary magnetic-button">
                Compare phones
              </Link>
            </div>

            <div className="hero-badge-row">
              <span className="pill">
                <Sparkles size={14} />
                Phone specifications
              </span>
              <span className="pill">
                <Camera size={14} />
                Adjustable priorities
              </span>
              <span className="pill">
                <Zap size={14} />
                Quick comparisons
              </span>
            </div>
          </div>

          <div className="hero-story-grid">
            {storyPoints.map((point) => {
              const Icon = point.icon;

              return (
                <article
                  key={point.title}
                  className="hero-story-card"
                >
                  <span className="hero-story-icon">
                    <Icon size={18} />
                  </span>
                  <h3>{point.title}</h3>
                  <p>{point.copy}</p>
                </article>
              );
            })}
          </div>
        </div>

        {/* Right column: product-theater cards that show what the tool feels like. */}
        <div
          className="hero-stack premium-hero-stack"
        >
          <div className="glass-panel hero-signature-card">
            <div className="signature-eyebrow">
              <span className="section-label">Comparison preview</span>
              <span className="chip hero-chip">Compare two phones.</span>
            </div>

            <div className="signature-phone-row">
              <article className="signature-phone-card">
                <span className="chip">Phone A</span>
                <h3>Xiaomi 14 Ultra</h3>
                <p>High-end camera and build</p>
              </article>

              <div className="signature-versus">VS</div>

              <article className="signature-phone-card signature-phone-card-accent">
                <span className="chip">Phone B</span>
                <h3>Galaxy S24 Ultra</h3>
                <p>Balanced performance, camera, and battery</p>
              </article>
            </div>

            <div className="signature-compare-grid">
              {revealRows.map((row) => (
                <div
                  key={row.label}
                  className="signature-compare-row"
                >
                  <div className="signature-compare-header">
                    <span>{row.label}</span>
                    <strong>{row.left > row.right ? "Winner: Phone A" : "Winner: Phone B"}</strong>
                  </div>
                  <div className="signature-compare-bars">
                    <span className="signature-compare-bar left" style={{ width: `${row.left}%` }} />
                    <span className="signature-compare-bar right" style={{ width: `${row.right}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-stats-grid">
            <CountMetric label="Phones" value={catalogSize} />
            <CountMetric label="Price bands" value={segmentCount} />
            <CountMetric label="Saved picks" value={24} suffix="+" />
            <CountMetric label="Compare depth" value={9} suffix=" sections" />
          </div>

          <div className="glass-panel hero-feature-list">
            <div className="hero-feature-list-header">
              <span className="section-label">How DeviceIQ works</span>
              <p className="muted">
                The main parts of the site support browsing, comparing, and saving phones.
              </p>
            </div>
            <div className="hero-feature-reveal">
              <div>
                <Camera size={16} />
                <span>Spec cards keep scores and quick facts together.</span>
              </div>
              <div>
                <BatteryCharging size={16} />
                <span>Filters collapse out of the way until you need them again.</span>
              </div>
              <div>
                <BarChart3 size={16} />
                <span>Compare rows surface the important differences immediately.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
