export default function DashboardLoading() {
  return (
    <section className="section">
      <div className="page-shell">
        <div className="dashboard-layout">
          <aside className="sidebar desktop-sidebar">
            <div className="glass-panel sidebar-card dashboard-filter-panel">
              <div className="skeleton-line skeleton-title" style={{ width: "58%" }} />
              <div className="stack">
                <div className="skeleton-line skeleton-copy" />
                <div className="skeleton-line skeleton-copy" />
                <div className="skeleton-line skeleton-copy" />
                <div className="skeleton-line skeleton-copy short" />
              </div>
            </div>
          </aside>

          <section className="results-stack">
            <div className="glass-panel card">
              <div className="skeleton-line skeleton-title" style={{ width: "44%" }} />
              <div className="skeleton-line skeleton-copy" style={{ marginTop: 16 }} />
              <div className="skeleton-line skeleton-copy short" style={{ marginTop: 12 }} />
            </div>

            <div className="phone-grid dashboard-grid dashboard-skeleton-grid" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="glass-panel phone-card phone-card-skeleton">
                  <div className="skeleton-line skeleton-pill" />
                  <div className="skeleton-media" />
                  <div className="skeleton-line skeleton-title" />
                  <div className="skeleton-line skeleton-copy" />
                  <div className="skeleton-line skeleton-copy short" />
                  <div className="skeleton-stats">
                    <div className="skeleton-line skeleton-stat" />
                    <div className="skeleton-line skeleton-stat" />
                    <div className="skeleton-line skeleton-stat" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
