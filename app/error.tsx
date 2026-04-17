"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalRouteError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app.error]", error);
  }, [error]);

  return (
    <section className="section">
      <div className="page-shell">
        <div className="glass-panel card">
          <span className="section-label">Something Went Wrong</span>
          <h1 className="section-title">This page hit a server problem.</h1>
          <p className="section-copy">
            The app is still up, but this route could not finish loading. You can retry or go back
            to a stable page.
          </p>
          <div className="button-row" style={{ marginTop: 20 }}>
            <button type="button" className="button" onClick={reset}>
              Try again
            </button>
            <Link href="/" className="button-secondary">
              Go home
            </Link>
            <Link href="/dashboard" className="button-ghost">
              Open dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
