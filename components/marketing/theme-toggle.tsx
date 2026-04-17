"use client";

import { MoonStar, SunMedium } from "lucide-react";

import { useThemeValue } from "@/components/providers/theme-provider";

export function ThemeToggle() {
  const { theme, ready, toggleTheme } = useThemeValue();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={ready ? `Switch to ${theme === "dark" ? "light" : "dark"} mode` : "Toggle theme"}
    >
      {theme === "dark" ? <SunMedium size={16} /> : <MoonStar size={16} />}
      <span>{ready ? (theme === "dark" ? "Light" : "Dark") : "Theme"}</span>
    </button>
  );
}
