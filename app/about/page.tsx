import styles from "./page.module.css";

/* Core principles/pillars that define the app's philosophy and approach
   These values guide design decisions and feature prioritization */
const pillars = [
  "The catalog stays usable even when some specs are still being refreshed.",  /* Robustness: Partial data is acceptable */
  "Each phone gives you quick shopping links so you can price-check on Lazada or Shopee fast.", /* Integration: Direct links to markets */
  "Scores stay simple on purpose: performance, camera, battery, and value.",    /* Simplicity: Four core metrics only */
  "The layout is made to work on phone, tablet, and desktop."                   /* Responsiveness: True mobile-first design */
];

/**
 * ===================================
 * ABOUT PAGE
 * ===================================
 * 
 * Purpose: Explains Dialed's mission, values, and core principles to users.
 * Two-card layout: Mission statement and core pillars/features.
 * 
 * User Journey: Users visit to understand the app's philosophy before diving in.
 * No data fetching needed - purely static content.
 * 
 * Design: Minimal, focused layout using glass panels and clean typography.
 */
export default function AboutPage() {
  return (
    <section className={`section ${styles.page}`}>
      {/* Section with default padding from globals.css */}
      <div className="page-shell marketing-grid">
        <div className="glass-panel card">
          <span className="section-label">About</span>
          {/* Large responsive title using clamp() for font scaling */}
          <h1 className="section-title">Built for a cleaner phone search.</h1>
          <p className="section-copy">
            Instead of bouncing between store pages, spec sites, and random comparison tabs, you can do the
            basic work here: filter the list, compare models, and open the full spec sheet when you need more detail.
          </p>
        </div>

        <div className="glass-panel card">
          <span className="section-label">What Matters Here</span>
          <ul className="insight-list" style={{ marginTop: 20 }}>
            {pillars.map((pillar) => (
              <li key={pillar}>{pillar}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
