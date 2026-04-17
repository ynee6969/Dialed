import Link from "next/link";
import { GitCompareArrows, ListChecks, Scale, Smartphone } from "lucide-react";

const comparisonBenefits = [
  {
    title: "Pick up to four phones",
    copy: "Shortlist the models you are still deciding between and keep the list focused."
  },
  {
    title: "See the leaders quickly",
    copy: "The compare view calls out which phone leads in performance, camera, battery, and overall score."
  },
  {
    title: "Jump back to full specs",
    copy: "When the scores are close, open the full spec page for the details that matter to you."
  }
];

const compareSteps = [
  "Open the dashboard and filter the catalog down to the phones you actually want to compare.",
  "Tap the Compare checkbox on each card to build a shortlist of up to four phones.",
  "Use Compare selected to open the side-by-side summary and see the score leaders instantly."
];

export default function ComparePage() {
  return (
    <>
      <section className="section">
        <div className="page-shell marketing-grid">
          <div className="glass-panel card">
            <span className="section-label">Compare Tool</span>
            <h1 className="section-title">Shortlist a few phones and line them up properly.</h1>
            <p className="section-copy">
              DeviceIQ comparison is built for the last part of the search: when you already have a few strong
              options and want to see which one wins on the scores that matter most.
            </p>
            <div className="button-row" style={{ marginTop: 18 }}>
              <Link href="/dashboard" className="button">
                Open dashboard
              </Link>
              <Link href="/gallery" className="button-secondary">
                Browse phones first
              </Link>
            </div>
          </div>

          <div className="glass-panel card">
            <span className="section-label">How It Works</span>
            <ul className="insight-list" style={{ marginTop: 20 }}>
              {compareSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-shell">
          <span className="section-label">Why Compare</span>
          <h2 className="feature-title">Use the compare view when the short list gets serious.</h2>
          <div className="card-grid" style={{ marginTop: 28 }}>
            {comparisonBenefits.map((item, index) => {
              const icons = [GitCompareArrows, Scale, Smartphone];
              const Icon = icons[index] ?? ListChecks;

              return (
                <article key={item.title} className="glass-panel card">
                  <div className="pill">
                    <Icon size={15} />
                    Compare
                  </div>
                  <h3 style={{ marginTop: 18 }}>{item.title}</h3>
                  <p className="muted">{item.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
