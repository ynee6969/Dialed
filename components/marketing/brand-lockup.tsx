/**
 * ===================================
 * BRAND LOCKUP
 * ===================================
 *
 * Purpose:
 * Renders the reusable brand unit seen in the header and footer.
 *
 * Why this component exists:
 * - Keeps the logo mark and brand text consistent everywhere.
 * - Makes it easy to change the product name, subtitle, or home link once.
 * - Separates branding markup from larger layout components like the header.
 */
import Link from "next/link";
import type { Route } from "next";

import { site } from "@/lib/site";
import styles from "./BrandLockup.module.css";

export function BrandMark() {
  return (
    <div className="brand-badge" aria-hidden="true">
      <span className="brand-mark-frame brand-mark-back" />
      <span className="brand-mark-frame brand-mark-front" />
      <span className="brand-mark-signal" />
    </div>
  );
}

/* Full brand lockup: icon + product name + supporting subtitle.
   Default subtitle comes from the shared site configuration. */
export function BrandLockup({
  subtitle = site.tagline,
  href = "/"
}: {
  subtitle?: string;
  href?: Route;
}) {
  return (
    <Link href={href} className={`brand-lockup ${styles.scope}`}>
      <BrandMark />
      <div className="brand-text">
        <strong>{site.name}</strong>
        <span>{subtitle}</span>
      </div>
    </Link>
  );
}
