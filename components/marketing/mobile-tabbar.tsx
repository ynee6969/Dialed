"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GitCompareArrows, Heart, House, LayoutDashboard, Sparkles } from "lucide-react";

import { InstantNavLink } from "@/components/navigation/instant-nav-link";

const tabs = [
  { href: "/", label: "Home", icon: House },
  { href: "/services", label: "Tools", icon: Sparkles },
  { href: "/compare", label: "Compare", icon: GitCompareArrows },
  { href: "/dashboard", label: "Browse", icon: LayoutDashboard },
  { href: "/favorites", label: "Saved", icon: Heart }
] satisfies Array<{ href: Route; label: string; icon: typeof House }>;

function isActivePath(pathname: string, href: Route) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="mobile-tabbar" aria-label="Mobile navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = isActivePath(pathname, tab.href);

        if (tab.href === "/dashboard") {
          return (
            <InstantNavLink
              key={tab.href}
              href={tab.href}
              className={`mobile-tablink ${active ? "is-active" : ""}`.trim()}
              loadingLabel="Opening dashboard..."
              prefetchOnMount
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </InstantNavLink>
          );
        }

        return (
          <Link key={tab.href} href={tab.href} className={`mobile-tablink ${active ? "is-active" : ""}`.trim()}>
            <Icon size={16} />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
