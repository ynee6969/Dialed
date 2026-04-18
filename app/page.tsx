import Link from "next/link";
import { ArrowRight, GitCompareArrows, Layers3, SlidersHorizontal, Sparkles } from "lucide-react";

import { HeroSection } from "@/components/marketing/hero-section";
import { catalogStats, curatedGallery } from "@/lib/data/seed-phones";
import { formatPhp } from "@/lib/utils/format";
import { getPhoneDisplayName } from "@/lib/utils/phone-presentation";

const workflowSteps = [
  {
    title: "Problem",
    copy: "Too many phones. Too many spec sheets. Too many tabs."
  },
  {
    title: "Chaos",
    copy: "Every store, review page, and benchmark chart tells part of the story."
  },
  {
    title: "Solution",
    copy: "Dialed turns that mess into one clean catalog with structured compare built in."
  },
  {
    title: "Power",
    copy: "Filter faster, save contenders when you want, and make the final call with confidence."
  }
];

export default function HomePage() {
  return (
    <>
      <HeroSection catalogSize={catalogStats.total} segmentCount={catalogStats.segments} />

      <section className="section">
        <div className="page-shell">
          <span className="section-label">Scroll Story</span>
          <h2 className="feature-title">From phone-shopping overload to a shortlist you trust.</h2>
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
            <h3>One dashboard, no redundant gallery.</h3>
            <p className="muted">
              The catalog now lives in one public dashboard with collapsible filters, faster cards, and a cleaner route
              structure.
            </p>
            <Link href="/dashboard" className="button magnetic-button">
              Open dashboard <ArrowRight size={16} />
            </Link>
          </article>

          <article className="glass-panel home-feature-card accent">
            <div className="home-feature-icon">
              <GitCompareArrows size={18} />
            </div>
            <span className="section-label">Signature Compare</span>
            <h3>Two phones slide in. The most important differences light up instantly.</h3>
            <p className="muted">
              The compare page stays focused on row-by-row specs, winner highlights, and a calmer decision moment.
            </p>
            <Link href="/compare" className="button magnetic-button">
              Open compare lab
            </Link>
          </article>

          <article className="glass-panel home-feature-card">
            <div className="home-feature-icon">
              <Layers3 size={18} />
            </div>
            <span className="section-label">Favorites</span>
            <h3>Browsing stays public. Account features kick in only when you want them.</h3>
            <p className="muted">
              Sign in becomes valuable when you want persistent favorites and comparison history, not before.
            </p>
            <Link href="/favorites" className="button-secondary magnetic-button">
              See favorites flow
            </Link>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="page-shell">
          <span className="section-label">Interactive Cards</span>
          <h2 className="feature-title">Cards that feel alive before you even open the spec sheet.</h2>
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
            <span className="section-label">Ready When You Are</span>
            <h2 className="feature-title">Find your perfect phone in one focused flow.</h2>
            <p className="section-copy">
              Browse openly, filter fast, compare like a pro, and sign in only when you want favorites to stick.
            </p>
            <div className="button-row">
              <Link href="/dashboard" className="button magnetic-button">
                Start browsing
              </Link>
              <Link href="/services" className="button-secondary magnetic-button">
                Explore the tools
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
