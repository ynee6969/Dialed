import Link from "next/link";

import { site } from "@/lib/site";

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
  href?: "/" | "/about" | "/services" | "/gallery" | "/contact" | "/dashboard";
}) {
  return (
    <Link href={href} className="brand-lockup">
      <BrandMark />
      <div className="brand-text">
        <strong>{site.name}</strong>
        <span>{subtitle}</span>
      </div>
    </Link>
  );
}
