import Link from "next/link";
import { ArrowRight, GitCompareArrows, Images, SlidersHorizontal } from "lucide-react";

import { HeroSection } from "@/components/marketing/hero-section";
import { catalogStats, curatedGallery } from "@/lib/data/seed-phones";
import { getPhoneDisplayName } from "@/lib/utils/phone-presentation";
import { formatPhp } from "@/lib/utils/format";

const featureCards = [
  {
    title: "Phone cards that stay useful",
    copy: "Price, scores, photos, and the quick spec lines you actually care about.",
    icon: Images
  },
  {
    title: "Filters that do the real work",
    copy: "Cut by budget, brand, battery, and performance instead of scrolling forever.",
    icon: SlidersHorizontal
  },
  {
    title: "Shortlist and compare",
    copy: "Keep a few phones in play and check them side by side before you decide.",
    icon: GitCompareArrows
  }
];

export default function HomePage() {
  return (
    <>
      <HeroSection catalogSize={catalogStats.total} segmentCount={catalogStats.segments} />

      <section className="section">
        <div className="page-shell">
          <span className="section-label">What You Can Do Here</span>
          <h2 className="section-title">Search, compare, and narrow it down fast.</h2>
          <p className="section-copy">
            The site is built for one job: help you get to a short list without the usual mess.
            Use the dashboard to filter the catalog, compare phones, and open the full spec page for any model.
          </p>

          <div className="card-grid" style={{ marginTop: 28 }}>
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="glass-panel card">
                  <div className="pill">
                    <Icon size={15} />
                    Feature
                  </div>
                  <h3 style={{ marginTop: 18 }}>{feature.title}</h3>
                  <p className="muted">{feature.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-shell marketing-grid">
          <div className="glass-panel card">
            <span className="section-label">How Scoring Works</span>
            <h2 className="feature-title">Scores help you sort fast.</h2>
            <p className="section-copy">
              The overall score blends performance, camera, battery, and value. It is there to help you
              sort the list, not replace the full specs.
            </p>
            <Link href="/dashboard" className="button" style={{ marginTop: 16, display: "inline-flex" }}>
              Open dashboard
            </Link>
          </div>

          <div className="glass-panel card">
            <span className="section-label">How Specs Get Filled In</span>
            <ul className="insight-list" style={{ marginTop: 20 }}>
              <li>Start with the base phone list.</li>
              <li>Pull details from device pages.</li>
              <li>Clean and store the specs.</li>
              <li>Show the latest saved version in the app.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-shell marketing-grid">
          <div className="glass-panel card">
            <span className="section-label">Compare Tool</span>
            <h2 className="feature-title">Shortlist a few phones and compare them side by side.</h2>
            <p className="section-copy">
              When you are down to the final few options, use the compare flow to see which phone leads in
              performance, camera, battery, and overall score without bouncing between pages.
            </p>
            <div className="button-row" style={{ marginTop: 18 }}>
              <Link href="/compare" className="button">
                Open compare guide
              </Link>
              <Link href="/dashboard" className="button-secondary">
                Start in dashboard
              </Link>
            </div>
          </div>

          <div className="glass-panel card">
            <span className="section-label">Compare Flow</span>
            <ul className="insight-list" style={{ marginTop: 20 }}>
              <li>Pick up to four phones from the dashboard.</li>
              <li>Use Compare selected to open the score leaders instantly.</li>
              <li>Open full specs only for the phones that stay close after the score check.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-shell">
          <span className="section-label">Gallery Preview</span>
          <h2 className="section-title">Browse the full catalog.</h2>
          <div className="phone-grid" style={{ marginTop: 28 }}>
            {curatedGallery.map((phone) => (
              <article key={`${phone.brand}-${phone.model}`} className="glass-panel phone-card">
                <div className="pill-row">
                  <span className="pill">{phone.segment.replace("_", " ")}</span>
                  <span className="score-badge">{phone.performance_score}/100</span>
                </div>
                <h3 style={{ marginTop: 18 }}>
                  {getPhoneDisplayName(phone.brand, phone.model)}
                </h3>
                <p className="muted">Battery {phone.battery} mAh | Camera {phone.camera_score} | Performance {phone.performance_score}</p>
                <div className="button-row" style={{ marginTop: 18 }}>
                  <span className="button-secondary">{formatPhp(phone.price)}</span>
                </div>
              </article>
            ))}
          </div>
          <Link href="/gallery" className="button-secondary" style={{ marginTop: 22, display: "inline-flex" }}>
            View full gallery <ArrowRight size={16} style={{ marginLeft: 8 }} />
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="page-shell">
          <div className="glass-panel card">
            <span className="section-label">One Place For The Whole Search</span>
            <h2 className="feature-title">Browse first. Decide later.</h2>
            <p className="section-copy">
              Use the public pages to look around, then jump into the dashboard when you want filters,
              scores, and compare mode.
            </p>
            <div className="button-row" style={{ marginTop: 18 }}>
              <Link href="/about" className="button-secondary">
                See how it works
              </Link>
              <Link href="/contact" className="button-ghost">
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
