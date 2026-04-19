"use client";

/**
 * ===================================
 * SITE HEADER
 * ===================================
 *
 * Purpose:
 * Renders the persistent top navigation bar shared by the entire application.
 *
 * Responsibilities:
 * - Keep the brand visible on every route.
 * - Show primary route links on desktop.
 * - Highlight the current route.
 * - Host the auth controls on the right.
 */
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandLockup } from "@/components/marketing/brand-lockup";
import { HeaderAuthControls } from "@/components/marketing/header-auth-controls";
import styles from "./SiteHeader.module.css";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/compare", label: "Compare" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
  { href: "/dashboard", label: "Dashboard" }
] satisfies Array<{ href: Route; label: string }>;

/* Shared helper for desktop nav highlighting. */
function isActivePath(pathname: string, href: Route) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    /* Sticky outer shell keeps navigation close while people scroll long pages. */
    <header className={`site-header ${styles.header}`}>
      <div className="header-inner">
        <BrandLockup />

        {/* Desktop-only primary navigation. Mobile relies on the bottom tab bar instead. */}
        <nav className="nav-row desktop-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${isActivePath(pathname, link.href) ? "is-active" : ""}`.trim()}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right rail contains login/signup or account actions depending on session state. */}
        <div className="header-actions">
          <HeaderAuthControls />
        </div>
      </div>
    </header>
  );
}
