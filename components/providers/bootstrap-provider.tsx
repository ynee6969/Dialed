"use client";

import { useEffect } from "react";

export function BootstrapProvider() {
  useEffect(() => {
    void fetch("/api/bootstrap", {
      method: "POST"
    }).catch(() => undefined);
  }, []);

  return null;
}
