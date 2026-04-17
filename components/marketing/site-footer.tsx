import { BrandLockup } from "@/components/marketing/brand-lockup";

export function SiteFooter() {
  return (
    <footer>
      <div className="footer-inner">
        <div>
          <BrandLockup subtitle="Search, compare, and get to a short list." />
        </div>
        <p className="footer-note">
          Phone search, full specs, and compare mode in one place.
        </p>
      </div>
    </footer>
  );
}
