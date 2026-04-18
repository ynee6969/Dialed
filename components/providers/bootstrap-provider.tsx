"use client";

import { useEffect } from "react";

const BOOTSTRAP_SESSION_KEY = "dialed-bootstrap-ran";

export function BootstrapProvider() {
  useEffect(() => {
    if (typeof window === "undefined" || sessionStorage.getItem(BOOTSTRAP_SESSION_KEY) === "1") {
      return;
    }

    sessionStorage.setItem(BOOTSTRAP_SESSION_KEY, "1");

    const win = window as typeof window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    const runBootstrap = () => {
      void fetch("/api/bootstrap", {
        method: "POST",
        keepalive: true
      }).catch(() => undefined);
    };

    if (win.requestIdleCallback) {
      const handle = win.requestIdleCallback(runBootstrap, { timeout: 2000 });
      return () => win.cancelIdleCallback?.(handle);
    }

    const timeoutId = win.setTimeout(runBootstrap, 1200);
    return () => win.clearTimeout(timeoutId);
  }, []);

  return null;
}
