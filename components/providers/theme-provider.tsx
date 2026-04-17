"use client";

import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "ai-phone-matchmaker-theme";

export type SiteTheme = "light" | "dark";

function resolveInitialTheme(): SiteTheme {
  if (typeof window === "undefined") {
    return "dark";
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useThemeValue() {
  const [theme, setTheme] = useState<SiteTheme>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initialTheme = resolveInitialTheme();
    document.documentElement.dataset.theme = initialTheme;
    setTheme(initialTheme);
    setReady(true);
  }, []);

  function updateTheme(nextTheme: SiteTheme) {
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  }

  return {
    theme,
    ready,
    toggleTheme: () => updateTheme(theme === "dark" ? "light" : "dark")
  };
}

export function ThemeProvider() {
  useThemeValue();
  return null;
}
