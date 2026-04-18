"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import {
  defaultThemePaletteId,
  getThemePresetById,
  isThemePaletteId,
  type ThemePaletteId,
  themePresets
} from "@/lib/theme/theme-presets";

const THEME_STORAGE_KEY = "ai-phone-matchmaker-theme";
const PALETTE_STORAGE_KEY = "ai-phone-matchmaker-palette";

export type SiteTheme = "light" | "dark";

interface ThemeContextValue {
  theme: SiteTheme;
  paletteId: ThemePaletteId;
  ready: boolean;
  presets: typeof themePresets;
  toggleTheme: () => void;
  setTheme: (theme: SiteTheme) => void;
  setPaletteId: (paletteId: ThemePaletteId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function hexToRgbValue(hex: string) {
  const normalized = hex.replace("#", "");
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((character) => `${character}${character}`)
          .join("")
      : normalized;

  const numeric = Number.parseInt(expanded, 16);
  const red = (numeric >> 16) & 255;
  const green = (numeric >> 8) & 255;
  const blue = numeric & 255;

  return `${red}, ${green}, ${blue}`;
}

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

function resolveInitialPalette(): ThemePaletteId {
  if (typeof window === "undefined") {
    return defaultThemePaletteId;
  }

  const stored = window.localStorage.getItem(PALETTE_STORAGE_KEY);
  return isThemePaletteId(stored) ? stored : defaultThemePaletteId;
}

function applyTheme(theme: SiteTheme, paletteId: ThemePaletteId) {
  const preset = getThemePresetById(paletteId);
  const root = document.documentElement;

  root.dataset.theme = theme;
  root.dataset.palette = preset.id;
  root.style.setProperty("--accent", preset.accent);
  root.style.setProperty("--accent-strong", preset.accentStrong);
  root.style.setProperty("--accent-contrast", preset.accentContrast);
  root.style.setProperty("--accent-secondary", preset.secondary);
  root.style.setProperty("--accent-tertiary", preset.tertiary);
  root.style.setProperty("--accent-rgb", hexToRgbValue(preset.accent));
  root.style.setProperty("--accent-strong-rgb", hexToRgbValue(preset.accentStrong));
  root.style.setProperty("--accent-secondary-rgb", hexToRgbValue(preset.secondary));
  root.style.setProperty("--accent-tertiary-rgb", hexToRgbValue(preset.tertiary));
  root.style.setProperty("--accent-soft", `rgba(${hexToRgbValue(preset.accent)}, 0.14)`);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<SiteTheme>("dark");
  const [paletteId, setPaletteIdState] = useState<ThemePaletteId>(defaultThemePaletteId);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initialTheme = resolveInitialTheme();
    const initialPalette = resolveInitialPalette();

    applyTheme(initialTheme, initialPalette);
    setThemeState(initialTheme);
    setPaletteIdState(initialPalette);
    setReady(true);
  }, []);

  const value = useMemo<ThemeContextValue>(() => {
    function updateTheme(nextTheme: SiteTheme) {
      setThemeState(nextTheme);
      applyTheme(nextTheme, paletteId);
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    }

    function updatePalette(nextPaletteId: ThemePaletteId) {
      setPaletteIdState(nextPaletteId);
      applyTheme(theme, nextPaletteId);
      window.localStorage.setItem(PALETTE_STORAGE_KEY, nextPaletteId);
    }

    return {
      theme,
      paletteId,
      ready,
      presets: themePresets,
      toggleTheme: () => updateTheme(theme === "dark" ? "light" : "dark"),
      setTheme: updateTheme,
      setPaletteId: updatePalette
    };
  }, [paletteId, ready, theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeValue() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeValue must be used within ThemeProvider.");
  }

  return context;
}
