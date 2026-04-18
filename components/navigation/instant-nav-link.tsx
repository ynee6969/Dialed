"use client";

import type { Route } from "next";
import { LoaderCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

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

  useEffect(() => {
    if (prefetchOnMount) {
      router.prefetch(href);
    }
  }, [href, prefetchOnMount, router]);

  function handleNavigate() {
    if (pathname === href) {
      return;
    }

    setShowOverlay(true);
    router.prefetch(href);
    startTransition(() => {
      router.push(href);
    });
  }

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={handleNavigate}
        onTouchStart={() => router.prefetch(href)}
        aria-busy={showOverlay || isPending}
      >
        {children}
      </button>

      {showOverlay || isPending ? (
        <div className="route-loading-overlay" aria-live="polite">
          <div className="glass-panel route-loading-card">
            <LoaderCircle size={18} className="spin" />
            <strong>{loadingLabel}</strong>
            <p className="muted">Preparing the fastest catalog view for this device.</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
