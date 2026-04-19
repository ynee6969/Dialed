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
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, BatteryCharging, Camera, Layers3, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";

import { InstantNavLink } from "@/components/navigation/instant-nav-link";
import styles from "./HeroSection.module.css";

interface HeroSectionProps {
  catalogSize: number;
  segmentCount: number;
}

/* Animated statistic card used in the hero's quick-metrics grid.
   The count-up makes catalog data feel alive without changing the content itself. */
function CountMetric({
  label,
  value,
  suffix = ""
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    /* Lightweight easing function built with requestAnimationFrame so the number
       climbs smoothly rather than jumping instantly. */
    let animationFrame = 0;
    const start = performance.now();
    const duration = 1100;

    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    };

    animationFrame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [value]);

  return (
    <div className="hero-stat-card">
      <span>{label}</span>
      <strong>
        {displayValue}
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
    router.prefetch("/compare");
  }, [router]);

  /* Story cards explain the problem-solution arc in a compact visual format. */
  const storyPoints = [
    {
      icon: Layers3,
      title: "Too many tabs",
      copy: "Phone shopping turns into chaos when every shortlist lives in a different spec page."
    },
    {
      icon: BarChart3,
      title: "One clean flow",
      copy: "Dialed keeps discovery, saved phones, and deep comparison inside one consistent surface."
    },
    {
      icon: Sparkles,
      title: "A better decision",
      copy: "Filter fast, compare like a pro, and stop guessing which phone is actually right for you."
    }
  ];

  /* These rows fake the "signature comparison reveal" with simple animated bars. */
  const revealRows = [
    { label: "Camera", left: 99, right: 91 },
    { label: "Battery", left: 93, right: 88 },
    { label: "Performance", left: 98, right: 90 }
  ];

  return (
    <section className={`section home-hero-section ${styles.scope}`}>
      <div className="page-shell hero-grid premium-hero-grid">
        {/* Left column: core message, CTA buttons, and problem-solution cards. */}
        <motion.div
          className="glass-panel hero-panel premium-hero-panel"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="hero-noise" aria-hidden="true" />
          <div className="hero-copy-stack">
            <span className="section-label">AI Phone Matchmaker</span>
            <h1 className="section-title">Stop guessing. Start comparing.</h1>
            <p className="section-copy">
              Search the catalog, watch standout phones rise to the top, and open a structured compare lab
              the moment the shortlist gets serious. Signing in is optional until you want favorites.
            </p>

            <div className="button-row hero-action-row">
              <InstantNavLink href="/dashboard" className="button magnetic-button" loadingLabel="Opening phone browser...">
                Browse phones <ArrowRight size={16} />
              </InstantNavLink>
              <Link href="/compare" className="button-secondary magnetic-button">
                Watch the compare reveal
              </Link>
            </div>

            <div className="hero-badge-row">
              <span className="pill">
                <Sparkles size={14} />
                Premium browsing flow
              </span>
              <span className="pill">
                <Camera size={14} />
                Rich spec snapshots
              </span>
              <span className="pill">
                <Zap size={14} />
                Built for fast decisions
              </span>
            </div>
          </div>

          <div className="hero-story-grid">
            {storyPoints.map((point, index) => {
              const Icon = point.icon;

              return (
                <motion.article
                  key={point.title}
                  className="hero-story-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.12 + index * 0.1 }}
                >
                  <span className="hero-story-icon">
                    <Icon size={18} />
                  </span>
                  <h3>{point.title}</h3>
                  <p>{point.copy}</p>
                </motion.article>
              );
            })}
          </div>
        </motion.div>

        {/* Right column: product-theater cards that show what the tool feels like. */}
        <motion.div
          className="hero-stack premium-hero-stack"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          <div className="glass-panel hero-signature-card">
            <div className="signature-eyebrow">
              <span className="section-label">Signature Moment</span>
              <span className="chip hero-chip">Two phones. One winner.</span>
            </div>

            <div className="signature-phone-row">
              <article className="signature-phone-card">
                <span className="chip">Phone A</span>
                <h3>Xiaomi 14 Ultra</h3>
                <p>Flagship camera + ultra-premium build</p>
              </article>

              <div className="signature-versus">VS</div>

              <article className="signature-phone-card signature-phone-card-accent">
                <span className="chip">Phone B</span>
                <h3>Galaxy S24 Ultra</h3>
                <p>Balanced performance, camera, and battery</p>
              </article>
            </div>

            <div className="signature-compare-grid">
              {revealRows.map((row, index) => (
                <motion.div
                  key={row.label}
                  className="signature-compare-row"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.22 + index * 0.12 }}
                >
                  <div className="signature-compare-header">
                    <span>{row.label}</span>
                    <strong>{row.left > row.right ? "Winner: Phone A" : "Winner: Phone B"}</strong>
                  </div>
                  <div className="signature-compare-bars">
                    <span className="signature-compare-bar left" style={{ width: `${row.left}%` }} />
                    <span className="signature-compare-bar right" style={{ width: `${row.right}%` }} />
                  </div>
                </motion.div>
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
              <span className="section-label">What scroll reveals</span>
              <p className="muted">
                As you move through the site, the decision flow keeps tightening instead of throwing more clutter at you.
              </p>
            </div>
            <div className="hero-feature-reveal">
              <div>
                <Camera size={16} />
                <span>Spec cards expand with animated scores and quick facts.</span>
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
        </motion.div>
      </div>
    </section>
  );
}
