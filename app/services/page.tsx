import Link from "next/link";
import { ArrowRight, BarChart3, Boxes, GitCompareArrows } from "lucide-react";

export default function ServicesPage() {
  return (
    <section className="section">
      <div className="page-shell services-shell">
        <span className="section-label">Inside DeviceIQ</span>
        <h1 className="section-title">Three tools, one clear decision flow.</h1>
        <p className="section-copy">
          The layout now breaks the old equal-box grid. Compare takes the lead, while discovery and full specs support it.
        </p>

        <div className="services-grid">
          <article className="glass-panel service-card service-card-featured">
            <div className="service-card-copy">
              <span className="section-label">Featured Tool</span>
              <h2>Compare phones side by side, instantly.</h2>
              <p className="muted">
                The compare lab is the signature experience: two phones slide in, stat bars fill, and the major wins surface without checkbox clutter.
              </p>
              <div className="button-row">
                <Link href="/compare" className="button magnetic-button">
                  Open compare lab
                </Link>
                <Link href="/dashboard" className="button-secondary magnetic-button">
                  Start from dashboard
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
              One public dashboard replaces the old split between dashboard and gallery. Cards stay consistent on phone, tablet, and laptop.
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
              Cached reference data keeps long-form specs ready faster, while favorites and compare links stay close at hand.
            </p>
            <div className="service-inline-preview text">
              <span />
              <span />
              <span />
              <span />
            </div>
            <Link href="/compare" className="button-secondary magnetic-button">
              See the structured specs
            </Link>
          </article>
        </div>

        <div className="services-hint">
          <GitCompareArrows size={16} />
          <span>Hover each card to explore the interaction previews.</span>
        </div>
      </div>
    </section>
  );
}
