"use client";

import type { Route } from "next";
import Link from "next/link";
import { GitCompareArrows, Heart, House, Images, LayoutDashboard } from "lucide-react";

const tabs = [
  { href: "/", label: "Home", icon: House },
  { href: "/gallery", label: "Gallery", icon: Images },
  { href: "/compare", label: "Compare", icon: GitCompareArrows },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/favorites", label: "Favorites", icon: Heart }
] satisfies Array<{ href: Route; label: string; icon: typeof House }>;

export function MobileTabBar() {
  return (
    <nav className="mobile-tabbar" aria-label="Mobile navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <Link key={tab.href} href={tab.href} className="mobile-tablink">
            <Icon size={16} />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
