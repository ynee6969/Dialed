"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, GitCompareArrows, ListFilter, Sparkles } from "lucide-react";

interface HeroSectionProps {
  catalogSize: number;
  segmentCount: number;
}

export function HeroSection({ catalogSize, segmentCount }: HeroSectionProps) {
  const highlights = [
    `${catalogSize} phones across ${segmentCount} price bands`,
    "Full product photos and quick spec lines",
    "Dedicated side-by-side compare lab",
    "Light and dark mode"
  ];

  return (
    <section className="section">
      <div className="page-shell hero-grid">
        <motion.div
          className="glass-panel hero-panel"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <span className="section-label">Find Your Next Phone</span>
          <h1 className="section-title">Pick a phone without opening ten tabs.</h1>
          <p className="section-copy">
            Set a budget. Check camera, battery, and performance. Compare a few models side by side and
            save the standouts when you want the details later.
          </p>
          <div className="button-row" style={{ marginTop: 28 }}>
            <Link href="/dashboard" className="button">
              Open dashboard
            </Link>
            <Link href="/gallery" className="button-secondary">
              Browse gallery
            </Link>
          </div>

          <div className="pill-row" style={{ marginTop: 28 }}>
            {highlights.map((highlight) => (
              <span key={highlight} className="pill">
                <Sparkles size={14} />
                {highlight}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="hero-stack"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <div className="glass-panel card">
            <div className="pill">What You Can Do</div>
            <div className="stack" style={{ marginTop: 18 }}>
              <div className="metric">
                <span>
                  <ListFilter size={14} style={{ verticalAlign: "middle", marginRight: 8 }} />
                  Filter the list
                </span>
                Narrow the catalog by brand, price, battery, camera, and performance.
              </div>
              <div className="metric">
                <span>
                  <GitCompareArrows size={14} style={{ verticalAlign: "middle", marginRight: 8 }} />
                  Compare side by side
                </span>
                Open the compare lab and evaluate two phones row by row.
              </div>
              <div className="metric">
                <span>
                  <CheckCircle2 size={14} style={{ verticalAlign: "middle", marginRight: 8 }} />
                  Open full specs
                </span>
                Jump from the quick card view to the full spec sheet for any phone.
              </div>
            </div>
          </div>

          <div className="glass-panel card">
            <div className="metric-grid">
              <div className="metric">
                <span>Catalog</span>
                <strong>{catalogSize} phones</strong>
              </div>
              <div className="metric">
                <span>Segments</span>
                <strong>{segmentCount} price bands</strong>
              </div>
              <div className="metric">
                <span>Sources</span>
                <strong>3 sites</strong>
              </div>
              <div className="metric">
                <span>Compare</span>
                <strong>2-phone deep dive</strong>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
