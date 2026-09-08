/* Core principles/pillars that define the app's philosophy and approach
   These values guide design decisions and feature prioritization */
const pillars = [
  "The catalog remains usable while some specifications are being updated.",
  "Each phone includes links to check prices on Lazada or Shopee.",
  "Scores use four criteria: performance, camera, battery, and value.",
  "The interface works on phones, tablets, and desktop computers."
];

/**
 * ===================================
 * ABOUT PAGE
 * ===================================
 * 
 * Purpose: Explains DeviceIQ's mission, values, and core principles to users.
 * Two-card layout: Mission statement and core pillars/features.
 * 
 * User Journey: Users visit to understand the app's philosophy before diving in.
 * No data fetching needed - purely static content.
 * 
 * Design: Minimal, focused layout using glass panels and clean typography.
 */
export default function AboutPage() {
  return (
    <section className="section">
      {/* Section with default padding from globals.css */}
      <div className="page-shell marketing-grid">
        <div className="glass-panel card">
          <span className="section-label">About</span>
          {/* Large responsive title using clamp() for font scaling */}
          <h1 className="section-title">A practical way to compare phones.</h1>
          <p className="section-copy">
            Browse a phone catalog, filter it by your requirements, compare models, and open full specifications
            when you need more detail.
          </p>
        </div>

        <div className="glass-panel card">
          <span className="section-label">What DeviceIQ focuses on</span>
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
