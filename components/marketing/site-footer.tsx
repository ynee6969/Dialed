/**
 * ===================================
 * SITE FOOTER
 * ===================================
 *
 * Purpose:
 * Ends every page with a compact brand reminder and a short product summary.
 *
 * Design choice:
 * The footer stays intentionally small so the app still feels product-focused,
 * especially on catalog-heavy routes like dashboard and compare.
 */
import { BrandLockup } from "@/components/marketing/brand-lockup";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <BrandLockup subtitle="Search, compare, and get to a short list." />
        </div>
        <p className={styles.note}>
          Phone search, full specs, and compare mode in one place.
        </p>
      </div>
    </footer>
  );
}
