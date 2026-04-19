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
