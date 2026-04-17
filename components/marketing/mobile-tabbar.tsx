"use client";

import type { Route } from "next";
import Link from "next/link";
import { Grid2x2, House, Images, LayoutDashboard, Mail } from "lucide-react";

const tabs = [
  { href: "/", label: "Home", icon: House },
  { href: "/gallery", label: "Gallery", icon: Images },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/services", label: "Services", icon: Grid2x2 },
  { href: "/contact", label: "Contact", icon: Mail }
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
