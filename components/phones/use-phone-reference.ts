"use client";

import { useEffect, useRef, useState } from "react";

import type { PhoneReference } from "@/lib/types/phone-reference";

export function usePhoneReference(slug: string) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [reference, setReference] = useState<PhoneReference | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || reference || loading) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((entry) => entry.isIntersecting);
        if (!isVisible) {
          return;
        }

        setLoading(true);
        observer.disconnect();

        void fetch(`/api/phones/${slug}/reference`)
          .then((response) => response.json().then((payload) => ({ ok: response.ok, payload })))
          .then(({ ok, payload }) => {
            if (!ok) {
              throw new Error(payload.error ?? "Reference fetch failed.");
            }

            setReference(payload);
          })
          .catch((fetchError) => {
            setError(fetchError instanceof Error ? fetchError.message : "Reference fetch failed.");
          })
          .finally(() => {
            setLoading(false);
          });
      },
      {
        rootMargin: "320px 0px"
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [slug, reference, loading]);

  return {
    containerRef,
    reference,
    loading,
    error
  };
}
