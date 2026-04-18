"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandLockup } from "@/components/marketing/brand-lockup";
import { HeaderAuthControls } from "@/components/marketing/header-auth-controls";
import { ThemeToggle } from "@/components/marketing/theme-toggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/compare", label: "Compare" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
  { href: "/dashboard", label: "Dashboard" }
] satisfies Array<{ href: Route; label: string }>;

function isActivePath(pathname: string, href: Route) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="header-inner">
        <BrandLockup />

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

        <div className="header-actions">
          <HeaderAuthControls />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
