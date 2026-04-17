const pillars = [
  "The catalog stays usable even when some specs are still being refreshed.",
  "Each phone gives you quick shopping links so you can price-check on Lazada or Shopee fast.",
  "Scores stay simple on purpose: performance, camera, battery, and value.",
  "The layout is made to work on phone, tablet, and desktop."
];

export default function AboutPage() {
  return (
    <section className="section">
      <div className="page-shell marketing-grid">
        <div className="glass-panel card">
          <span className="section-label">About</span>
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
