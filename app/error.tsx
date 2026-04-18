/**
 * ===================================
 * GLOBAL ERROR BOUNDARY
 * ===================================
 * 
 * Purpose: Catches and displays errors that occur during page rendering or data fetching.
 * Acts as the app-wide error fallback when any route fails.
 * 
 * "use client" directive: Required because error boundaries must be client components.
 * 
 * Features:
 * - Logs error to console for debugging
 * - Displays user-friendly error message
 * - Provides multiple action buttons:
 *   • Try again: Resets error and retries the route
 *   • Go home: Returns to homepage
 *   • Open dashboard: Navigates to a known working page
 * 
 * User Experience: Instead of showing a blank page or console errors,
 * users see a clear message and recovery options.
 */
"use client"; /* Enable client-side rendering for error boundary */

import Link from "next/link";
import { useEffect } from "react";

/* Error boundary component - catches errors from child routes
   Parameters:
   - error: The error object with optional digest (error ID)
   - reset: Function to retry rendering the route */
export default function GlobalRouteError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  /* Log error to console for debugging
     useEffect runs after component mounts to ensure browser access */
  useEffect(() => {
    console.error("[app.error]", error); /* Tag helps identify errors in logs */
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
          {/* Three-button action row providing different recovery paths */}
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
