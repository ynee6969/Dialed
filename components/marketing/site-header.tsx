import type { Route } from "next";
import Link from "next/link";

import { BrandLockup } from "@/components/marketing/brand-lockup";
import { HeaderAuthControls } from "@/components/marketing/header-auth-controls";
import { ThemeToggle } from "@/components/marketing/theme-toggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/compare", label: "Compare" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
  { href: "/dashboard", label: "Dashboard" }
] satisfies Array<{ href: Route; label: string }>;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <BrandLockup />

        <nav className="nav-row desktop-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <HeaderAuthControls />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
