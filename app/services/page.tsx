/**
 * ===================================
 * SERVICES PAGE (Features Showcase)
 * ===================================
 * 
 * Purpose: Highlights the three main tools DeviceIQ provides.
 * Marketing-focused page explaining app capabilities to new users.
 * 
 * Three Main Tools:
 * 1. Compare Lab (featured): Side-by-side phone comparison with stat bars
 * 2. Catalog Browser: Dashboard with filters and phone cards
 * 3. Full Spec Pages: Detailed specifications for individual phones
 * 
 * Design:
 * - Asymmetric grid: Featured card takes more space
 * - Visual previews: Each card shows interaction examples
 * - Stat bars: Visual representation of scores/performance
 * - Call-to-action buttons: Direct links to each tool
 * 
 * User Journey: Users learn what each feature does before diving in.
 * From here, they can jump directly to specific tools or back to dashboard.
 */

import Link from "next/link";
import { ArrowRight, BarChart3, Boxes, GitCompareArrows, SlidersHorizontal } from "lucide-react"; /* Icon components */
import styles from "./page.module.css";

export default function ServicesPage() {
  return (
    <section className={`section ${styles.page}`}>
      <div className="page-shell services-shell">
        <span className="section-label">DeviceIQ tools</span>
        <h1 className="section-title">Browse, get recommendations, and compare phone specifications.</h1>
        <p className="section-copy">
          Set requirements and priorities to receive a ranked shortlist, then compare the phones in detail.
        </p>

        {/* Asymmetric 3-column grid: featured card + 2 smaller cards
            Featured card spans more vertical space */}
        <div className="services-grid">
          <article className="glass-panel service-card">
            <div className="service-card-icon"><SlidersHorizontal size={18} /></div>
            <h3>Recommendation</h3>
            <p className="muted">Set your requirements and priorities to get a ranked shortlist with an explainable score breakdown.</p>
            <Link href="/recommend" className="button magnetic-button">Get recommendations <ArrowRight size={16} /></Link>
          </article>
          {/* FEATURED CARD: Compare Lab - The signature experience */}
          <article className="glass-panel service-card service-card-featured">
            <div className="service-card-copy">
              <span className="section-label">Comparison</span>
              <h2>Compare phones side by side.</h2>
              <p className="muted">
                Review the key specifications and scores for two phones in one view.
              </p>
              <div className="button-row">
                <Link href="/compare" className="button magnetic-button">
                  Compare phones
                </Link>
                <Link href="/dashboard" className="button-secondary magnetic-button">
                  Browse phones
                </Link>
              </div>
            </div>

            <div className="service-preview service-preview-compare">
              <div className="service-phone-preview">
                <span className="chip">Phone A</span>
                <strong>Xiaomi 14 Ultra</strong>
                <div className="service-mini-bars">
                  <span style={{ width: "94%" }} />
                  <span style={{ width: "90%" }} />
                  <span style={{ width: "88%" }} />
                </div>
              </div>
              <div className="service-preview-versus">VS</div>
              <div className="service-phone-preview accent">
                <span className="chip">Phone B</span>
                <strong>Galaxy S24 Ultra</strong>
                <div className="service-mini-bars">
                  <span style={{ width: "90%" }} />
                  <span style={{ width: "92%" }} />
                  <span style={{ width: "86%" }} />
                </div>
              </div>
            </div>
          </article>

          <article className="glass-panel service-card">
            <div className="service-card-icon">
              <Boxes size={18} />
            </div>
            <h3>Catalog browser</h3>
            <p className="muted">
              Browse the catalog with filters and consistent phone cards on any screen.
            </p>
            <div className="service-inline-preview">
              <span />
              <span />
              <span />
            </div>
            <Link href="/dashboard" className="button-secondary magnetic-button">
              Browse the catalog <ArrowRight size={16} />
            </Link>
          </article>

          <article className="glass-panel service-card">
            <div className="service-card-icon">
              <BarChart3 size={18} />
            </div>
            <h3>Full spec pages</h3>
            <p className="muted">
              Open detailed specifications, then save or compare the phone.
            </p>
            <div className="service-inline-preview text">
              <span />
              <span />
              <span />
              <span />
            </div>
            <Link href="/compare" className="button-secondary magnetic-button">
              View phone details
            </Link>
          </article>
        </div>

        <div className="services-hint">
          <GitCompareArrows size={16} />
          <span>Use the tools to browse, compare, and choose a phone.</span>
        </div>
      </div>
    </section>
  );
}
