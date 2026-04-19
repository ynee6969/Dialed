"use client";

/**
 * ===================================
 * INSTANT NAV LINK
 * ===================================
 *
 * Purpose:
 * Wraps slow route transitions with prefetching and a visible loading state.
 *
 * This is especially useful for the dashboard route because that page still
 * performs more work than simple marketing pages.
 */
import type { Route } from "next";
import { LoaderCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import styles from "./InstantNavLink.module.css";

interface InstantNavLinkProps {
  href: Route;
  className?: string;
  children: React.ReactNode;
  loadingLabel?: string;
  prefetchOnMount?: boolean;
}

export function InstantNavLink({
  href,
  className,
  children,
  loadingLabel = "Opening dashboard...",
  prefetchOnMount = true
}: InstantNavLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [showOverlay, setShowOverlay] = useState(false);

  /* Prefetch on mount when the caller wants this link to feel instant. */
  useEffect(() => {
    if (prefetchOnMount) {
      router.prefetch(href);
    }
  }, [href, prefetchOnMount, router]);

  function handleNavigate() {
    /* Skip work when the user taps the tab for the route they already occupy. */
    if (pathname === href) {
      return;
    }

    /* Show feedback immediately, then let Next.js perform the route transition. */
    setShowOverlay(true);
    router.prefetch(href);
    startTransition(() => {
      router.push(href);
    });
  }

  return (
    <span className={styles.scope}>
      <button
        type="button"
        className={className}
        onClick={handleNavigate}
        /* Touch prefetch gives phone users an earlier head start before the click completes. */
        onTouchStart={() => router.prefetch(href)}
        aria-busy={showOverlay || isPending}
      >
        {children}
      </button>

      {showOverlay || isPending ? (
        <div className={`route-loading-overlay ${styles.overlay}`} aria-live="polite">
          <div className={`glass-panel route-loading-card ${styles.card}`}>
            <LoaderCircle size={18} className="spin" />
            <strong>{loadingLabel}</strong>
            <p className="muted">Preparing the fastest catalog view for this device.</p>
          </div>
        </div>
      ) : null}
    </span>
  );
}
