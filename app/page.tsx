/**
 * ===================================
 * HOME PAGE (Landing Page)
 * ===================================
 * 
 * Purpose: The main landing page of the DeviceIQ application.
 * Introduces the app's core value proposition: a clean phone shopping experience.
 * 
 * Key Features:
 * - Hero section with app statistics (total phones, segments)
 * - Short workflow: problem → solution → decision
 * - Feature cards highlighting three main tools: Discovery, Compare, Favorites
 * - Interactive cards preview showing phone browsing experience
 * - Calls-to-action directing users to main app sections
 * 
 * User Journey: First-time visitors land here to understand what DeviceIQ offers,
 * then navigate to dashboard, compare, or favorites sections.
 * 
 * Design Pattern: Clear panels, restrained accents, responsive grid layouts.
 * Mobile-first: All sections adapt gracefully from mobile to desktop viewports.
 */

import Link from "next/link";
import { ArrowRight, GitCompareArrows, Layers3, SlidersHorizontal, Sparkles } from "lucide-react";

import { HeroSection } from "@/components/marketing/hero-section";
import { catalogStats, curatedGallery } from "@/lib/data/seed-phones";
import { formatPhp } from "@/lib/utils/format";
import { getPhoneDisplayName } from "@/lib/utils/phone-presentation";
import styles from "./page.module.css";

/* Array of narrative steps that tell the story of the app's value proposition
   Each step represents a stage in the user's phone shopping journey.
   This creates a short narrative arc from problem to solution to decision. */
const workflowSteps = [
  {
    title: "Problem",
    copy: "Phone information is spread across many pages." /* Establishes the problem the app addresses */
  },
  {
    title: "Fragmented information",
    copy: "Every store, review page, and benchmark chart tells part of the story." /* Emphasizes fragmentation across multiple sources */
  },
  {
    title: "Solution",
    copy: "DeviceIQ brings the catalog and structured comparison into one place." /* Introduces the app's core solution */
  },
  {
    title: "Decision",
    copy: "Filter by what matters, save contenders, and compare the final options." /* Highlights the decision flow */
  }
];

/* Main home page component
   Accepts catalogStats from seed data to display current app metrics.
   Returns a multi-section page with hero, narrative, features, and cards.
   All sections use responsive grid layouts that adapt to screen size. */
export default function HomePage() {
  return (
    <div className={styles.page}>  {/* Fragment wrapper allows multiple top-level elements */}
      <HeroSection catalogSize={catalogStats.total} segmentCount={catalogStats.segments} />

      <section className="section">
        <div className="page-shell">
          <span className="section-label">How it works</span>
          <h2 className="feature-title">Compare phones and narrow your choices.</h2>
          <div className="story-strip">
            {workflowSteps.map((step, index) => (
              <article key={step.title} className="glass-panel story-card">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-shell home-feature-layout">
          <article className="glass-panel home-feature-card">
            <div className="home-feature-icon">
              <SlidersHorizontal size={18} />
            </div>
            <span className="section-label">Discovery</span>
            <h3>Browse phones in one place.</h3>
            <p className="muted">
              Use filters to browse the catalog, open specifications, and keep your options together.
            </p>
            <Link href="/dashboard" className="button magnetic-button">
              Browse phones <ArrowRight size={16} />
            </Link>
          </article>

          <article className="glass-panel home-feature-card accent">
            <div className="home-feature-icon">
              <GitCompareArrows size={18} />
            </div>
            <span className="section-label">Comparison</span>
            <h3>Compare important differences side by side.</h3>
            <p className="muted">
              Review specifications and scores for two phones in one view.
            </p>
            <Link href="/compare" className="button magnetic-button">
              Compare phones
            </Link>
          </article>

          <article className="glass-panel home-feature-card">
            <div className="home-feature-icon">
              <Layers3 size={18} />
            </div>
            <span className="section-label">Favorites</span>
            <h3>Save phones for later.</h3>
            <p className="muted">
              Sign in to save phones and keep your comparison history.
            </p>
            <Link href="/favorites" className="button-secondary magnetic-button">
              View saved phones
            </Link>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="page-shell">
          <span className="section-label">Catalog preview</span>
          <h2 className="feature-title">Sample phones from the catalog.</h2>
          <div className="home-preview-grid">
            {curatedGallery.slice(0, 3).map((phone, index) => (
              <article key={`${phone.brand}-${phone.model}`} className={`glass-panel home-preview-card ${index === 1 ? "is-featured" : ""}`.trim()}>
                <span className="pill">
                  <Sparkles size={14} />
                  {phone.segment.replace(/_/g, " ")}
                </span>
                <h3>{getPhoneDisplayName(phone.brand, phone.model)}</h3>
                <p className="muted">{formatPhp(phone.price)}</p>
                <div className="home-preview-stats">
                  <div>
                    <span>Performance</span>
                    <strong>{phone.performance_score}</strong>
                  </div>
                  <div>
                    <span>Camera</span>
                    <strong>{phone.camera_score}</strong>
                  </div>
                  <div>
                    <span>Battery</span>
                    <strong>{phone.battery}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-shell">
          <div className="glass-panel final-cta-card">
            <span className="section-label">Get started</span>
            <h2 className="feature-title">Choose phones based on your priorities.</h2>
            <p className="section-copy">
              Browse, filter, compare, and save phones that fit your needs.
            </p>
            <div className="button-row">
              <Link href="/dashboard" className="button magnetic-button">
                Browse phones
              </Link>
              <Link href="/services" className="button-secondary magnetic-button">
                View features
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
