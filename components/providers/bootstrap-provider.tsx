"use client";

/**
 * ===================================
 * BOOTSTRAP PROVIDER
 * ===================================
 *
 * Purpose:
 * Triggers the lightweight `/api/bootstrap` warm-up once per browser session.
 *
 * Why it exists:
 * The app can prepare cache/data in the background without blocking the first paint.
 */
import { useEffect } from "react";

const BOOTSTRAP_SESSION_KEY = "dialed-bootstrap-ran";

export function BootstrapProvider() {
  useEffect(() => {
    /* Skip duplicate bootstrap runs inside the same browser session. */
    if (typeof window === "undefined" || sessionStorage.getItem(BOOTSTRAP_SESSION_KEY) === "1") {
      return;
    }

    sessionStorage.setItem(BOOTSTRAP_SESSION_KEY, "1");

    const win = window as typeof window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    /* Keep the request fire-and-forget; the UI never waits for it. */
    const runBootstrap = () => {
      void fetch("/api/bootstrap", {
        method: "POST",
        keepalive: true
      }).catch(() => undefined);
    };

    /* Prefer idle time so the bootstrap request does not compete with critical route work. */
    if (win.requestIdleCallback) {
      const handle = win.requestIdleCallback(runBootstrap, { timeout: 2000 });
      return () => win.cancelIdleCallback?.(handle);
    }

    const timeoutId = win.setTimeout(runBootstrap, 1200);
    return () => win.clearTimeout(timeoutId);
  }, []);

  return null;
}
