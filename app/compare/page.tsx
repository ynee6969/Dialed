/**
 * ===================================
 * COMPARE PAGE (Phone Comparison Lab)
 * ===================================
 * 
 * Purpose: Allows users to select and compare two phones side-by-side.
 * Core feature of the app - the "signature experience".
 * 
 * Data Flow:
 * 1. User selects two phones from dropdown lists
 * 2. Query parameters updated: /compare?left=slug&right=slug
 * 3. Server builds detailed comparison data
 * 4. Page displays side-by-side specs with winner highlights
 * 5. If authenticated, saves comparison to user's history
 * 
 * Key Sections:
 * - Comparison selector (dropdowns + submit button)
 * - Recent comparisons (shortcuts for logged-in users)
 * - Hero section with both phones, scores, images
 * - Highlights section (reasons to choose each phone)
 * - Detailed specs comparison (all technical specifications)
 * 
 * Dynamic: "force-dynamic" ensures data is fresh on every request.
 * Caching: If phones are unchanged, comparison rebuilds quickly.
 */

import Link from "next/link";

import { getOptionalSession } from "@/lib/auth/session"; /* Gets current user session if exists */
import {
  listRecentComparisonSnapshotsByUserId,
  rememberComparisonSnapshot
} from "@/lib/services/comparison-history";
import { buildDetailedComparison } from "@/lib/services/comparison";
import { formatPhp, formatScore } from "@/lib/utils/format";
import styles from "./page.module.css";

/* force-dynamic: Prevents caching of this page
   Ensures users always get the latest comparison data
   Without this, Next.js might serve stale cached data */
export const dynamic = "force-dynamic";

export default async function ComparePage({
  searchParams
}: {
  searchParams: Promise<{ left?: string; right?: string }>;
}) {
  const params = await searchParams;

  /* Get current user session (null if not logged in) */
  const session = await getOptionalSession();
  
  /* Build detailed comparison data from selected phone slugs
     If both phones are valid, returns comprehensive spec comparison
     If one/both are invalid, returns error or partial data */
  const comparison = await buildDetailedComparison(params.left, params.right);
  const leftDevice = comparison.left;
  const rightDevice = comparison.right;
  let recentComparisons: Awaited<ReturnType<typeof listRecentComparisonSnapshotsByUserId>> = [];

  /* If user is logged in, save this comparison and fetch comparison history */
  if (session?.user?.id) {
    try {
      /* Save the current comparison pair to user's history for quick access */
      if (leftDevice && rightDevice) {
        await rememberComparisonSnapshot(session.user.id, leftDevice.phone.id, rightDevice.phone.id);
      }

      /* Fetch user's recent comparison pairs (max 5-10 most recent)
         Displayed as quick-access buttons below the selector */
      recentComparisons = await listRecentComparisonSnapshotsByUserId(session.user.id);
    } catch (error) {
      /* If save/fetch fails, log but don't crash the page
         User can still compare, just won't see history saved */
      console.error("[compare.history]", error);
    }
  }

  return (
    <section className={`section ${styles.page}`}>
      <div className="page-shell compare-page">
        <span className="section-label">Compare Lab</span>
        <h1 className="section-title">Structured phone comparison without the dashboard clutter.</h1>
        <p className="section-copy">
          Pick two phones, line up the important spec sections, and let the page surface the biggest
          differences visually.
        </p>

        <div className="glass-panel card compare-selector-card">
          <div className="compare-selector-copy">
            <h2 className="feature-title">Choose the phones to compare.</h2>
            <p className="muted" style={{ marginBottom: 0 }}>
              This page owns comparison now, so the dashboard stays focused on discovery and favorites.
            </p>
          </div>

          <form className="compare-selector-grid">
            <div className="field">
              <label htmlFor="left">Phone A</label>
              <select id="left" name="left" className="select" defaultValue={comparison.selectedLeftSlug ?? ""}>
                {comparison.catalog.map((phone) => (
                  <option key={phone.id} value={phone.slug}>
                    {phone.brand} {phone.model}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="right">Phone B</label>
              <select id="right" name="right" className="select" defaultValue={comparison.selectedRightSlug ?? ""}>
                {comparison.catalog.map((phone) => (
                  <option key={phone.id} value={phone.slug}>
                    {phone.brand} {phone.model}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="button compare-selector-submit">
              Update comparison
            </button>
          </form>
        </div>

        {recentComparisons.length ? (
          <div className="glass-panel card" style={{ marginTop: 20 }}>
            <span className="section-label">Recent comparisons</span>
            <p className="muted" style={{ marginBottom: 0 }}>
              Your last comparison pairs stay attached to your account for quick jump-backs.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 18 }}>
              {recentComparisons.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/compare?left=${entry.leftPhone.slug}&right=${entry.rightPhone.slug}`}
                  className="button-secondary"
                  style={{ display: "inline-flex" }}
                >
                  {entry.leftPhone.brand} {entry.leftPhone.model} vs {entry.rightPhone.brand}{" "}
                  {entry.rightPhone.model}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {leftDevice && rightDevice ? (
          <>
            <div className="glass-panel compare-hero-card">
              <div className="compare-hero-phones">
                {[leftDevice, rightDevice].map((device, index) => (
                  <article key={device.phone.id} className="compare-phone-hero">
                    <span className="compare-phone-label">Phone {index === 0 ? "A" : "B"}</span>
                    <div className="compare-hero-score">{formatScore(device.phone.finalScore)}</div>
                    <div className="compare-phone-media">
                      {device.reference.imageUrl ? (
                        <img src={device.reference.imageUrl} alt={device.displayName} />
                      ) : (
                        <div className="phone-media-placeholder">{device.phone.brand.slice(0, 1)}</div>
                      )}
                    </div>
                    <h2>{device.displayName}</h2>
                    <p className="muted compare-phone-price">{formatPhp(device.phone.price)}</p>
                    <div className="compare-phone-pills">
                      <span className="chip">Display {device.reference.summary.displaySize ?? "—"}</span>
                      <span className="chip">Chipset {device.reference.summary.chipset ?? "—"}</span>
                      <span className="chip">Battery {device.reference.summary.battery ?? "—"}</span>
                    </div>
                    <Link href={`/phones/${device.phone.slug}`} className="button-secondary compare-phone-link">
                      Open full specs
                    </Link>
                  </article>
                ))}
              </div>

              <div className="compare-versus-badge">VS</div>
            </div>

              <div className="compare-highlights-grid">
                <div className="glass-panel card compare-highlight-card">
                <span className="section-label">{leftDevice.displayName}</span>
                <h3>Reasons to consider it</h3>
                <ul className="insight-list" style={{ marginTop: 18 }}>
                  {comparison.highlights.left.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>

              <div className="glass-panel card compare-highlight-card">
                <span className="section-label">{rightDevice.displayName}</span>
                <h3>Reasons to consider it</h3>
                <ul className="insight-list" style={{ marginTop: 18 }}>
                  {comparison.highlights.right.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="glass-panel card compare-score-card">
              <span className="section-label">Score Snapshot</span>
              <div className="compare-score-rows">
                {comparison.summaryRows.map((row) => (
                  <div key={row.label} className="compare-score-row">
                    <div className={`compare-score-cell ${row.leftWinner ? "is-winner" : ""}`}>{row.leftValue}</div>
                    <div className="compare-score-label">{row.label}</div>
                    <div className={`compare-score-cell ${row.rightWinner ? "is-winner" : ""}`}>{row.rightValue}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="compare-sections">
              {comparison.sections.map((section) => (
                <section key={section.title} className="glass-panel compare-section-card">
                  <div className="compare-section-header">
                    <h2>{section.title}</h2>
                  </div>

                  <div className="compare-table compare-table-header" aria-hidden="true">
                    <div className="compare-label-cell">Spec</div>
                    <div className="compare-value-cell">{leftDevice.displayName}</div>
                    <div className="compare-value-cell">{rightDevice.displayName}</div>
                  </div>

                  <div className="compare-table-body">
                    {section.rows.map((row) => (
                      <div key={`${section.title}-${row.label}`} className="compare-table-row">
                        <div className="compare-label-cell">{row.label}</div>
                        <div className={`compare-value-cell ${row.leftWinner ? "is-winner" : row.isDifferent ? "is-different" : ""}`}>
                          <span className="compare-mobile-name">{leftDevice.displayName}</span>
                          <span>{row.leftValue}</span>
                        </div>
                        <div className={`compare-value-cell ${row.rightWinner ? "is-winner" : row.isDifferent ? "is-different" : ""}`}>
                          <span className="compare-mobile-name">{rightDevice.displayName}</span>
                          <span>{row.rightValue}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        ) : (
          <div className="glass-panel card empty-state" style={{ marginTop: 28 }}>
            <p className="muted" style={{ marginTop: 0 }}>
              We could not build the current comparison pair. Pick two phones from the selector above.
            </p>
            <Link href="/dashboard" className="button-secondary" style={{ display: "inline-flex" }}>
              Back to dashboard
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
