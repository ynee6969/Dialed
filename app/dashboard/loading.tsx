/**
 * ===================================
 * DASHBOARD LOADING STATE (Skeleton Loader)
 * ===================================
 * 
 * Purpose: Displays while the dashboard page is loading.
 * Shows skeleton placeholders for filter sidebar and phone grid.
 * 
 * User Experience: Creates perceived performance improvement.
 * Instead of blank screen, users see the layout structure loading with shimmer effects.
 * 
 * Skeleton Elements:
 * - Sidebar: Filter panel skeleton with title, copy, and checkbox placeholders
 * - Grid: 6 phone card skeletons showing the expected layout
 * - Each card shows: badge, image, title, description, stats
 * 
 * Design: Matches exact layout of real dashboard so there's no layout shift.
 * aria-hidden: Marks skeleton as non-interactive for screen readers.
 */
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

            {/* Skeleton grid matching phone grid layout
                aria-hidden="true": Tells screen readers to skip skeleton content
                6 placeholder cards show the expected grid structure */}
            <div className="phone-grid dashboard-grid dashboard-skeleton-grid" aria-hidden="true">
              {/* Generate 6 skeleton card placeholders */}
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
