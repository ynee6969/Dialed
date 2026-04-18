/**
 * ===================================
 * PHONE DETAIL LOADING STATE (Skeleton Loader)
 * ===================================
 * 
 * Purpose: Displays while phone detail page is loading.
 * Shows skeleton placeholders matching the detail page layout.
 * 
 * User Experience: Instead of blank screen, users see the page structure
 * with shimmer animation indicating content is loading.
 * 
 * Skeleton Elements:
 * - Hero section: Image placeholder, title lines, summary grid
 * - Specs table: Multiple skeleton rows representing full specs
 * 
 * Design: Exactly matches real layout to prevent layout shift
 * when actual content loads. Seamless transition from skeleton to real content.
 */
export default function PhoneDetailLoading() {
  return (
    <section className="section">
      {/* Section with default padding */}
      <div className="page-shell phone-detail-layout">
        <div className="glass-panel phone-detail-hero">
          <div className="phone-detail-media skeleton-media" />
          <div className="stack">
            <div className="skeleton-line skeleton-pill" />
            <div className="skeleton-line" style={{ height: 56, width: "72%" }} />
            <div className="skeleton-line skeleton-copy" />
            {/* Summary specs grid: 4 placeholder cards */}
            <div className="detail-summary-grid">
              {/* Generate 4 skeleton metric cards */}
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="metric">
                  <div className="skeleton-line skeleton-copy short" />
                  <div className="skeleton-line skeleton-title" style={{ marginTop: 10 }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specs table skeleton: 8 placeholder rows */}
        <div className="glass-panel specs-table-card" style={{ padding: 24 }}>
          {/* Generate 8 skeleton lines representing spec rows */}
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="skeleton-line" style={{ height: 20, marginBottom: 16 }} />
          ))}
        </div>
      </div>
    </section>
  );
}
