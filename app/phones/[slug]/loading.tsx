export default function PhoneDetailLoading() {
  return (
    <section className="section">
      <div className="page-shell phone-detail-layout">
        <div className="glass-panel phone-detail-hero">
          <div className="phone-detail-media skeleton-media" />
          <div className="stack">
            <div className="skeleton-line skeleton-pill" />
            <div className="skeleton-line" style={{ height: 56, width: "72%" }} />
            <div className="skeleton-line skeleton-copy" />
            <div className="detail-summary-grid">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="metric">
                  <div className="skeleton-line skeleton-copy short" />
                  <div className="skeleton-line skeleton-title" style={{ marginTop: 10 }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel specs-table-card" style={{ padding: 24 }}>
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="skeleton-line" style={{ height: 20, marginBottom: 16 }} />
          ))}
        </div>
      </div>
    </section>
  );
}
