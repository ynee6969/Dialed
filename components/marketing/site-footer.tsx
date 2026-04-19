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
