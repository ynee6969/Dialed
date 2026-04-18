"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

import {
  defaultThemePaletteId,
  getThemePresetById,
  isThemePaletteId,
  themePresets,
  type ThemePaletteId,
  type ThemePreset
} from "@/lib/theme/theme-presets";

type ThemeMode = "light" | "dark" | "system";
type ThemeAppearance = "light" | "dark";

interface ThemeContextValue {
  ready: boolean;
  mode: ThemeMode;
  resolvedTheme: ThemeAppearance;
  presets: ThemePreset[];
  lightPaletteId: ThemePaletteId;
  darkPaletteId: ThemePaletteId;
  activePaletteId: ThemePaletteId;
  setMode: (mode: ThemeMode) => void;
  setPalette: (appearance: ThemeAppearance, paletteId: ThemePaletteId) => void;
}

const THEME_MODE_KEY = "dialed-theme-mode";
const LIGHT_PALETTE_KEY = "dialed-theme-light-palette";
const DARK_PALETTE_KEY = "dialed-theme-dark-palette";
const LEGACY_THEME_KEY = "dialed-theme";
const LEGACY_PALETTE_KEY = "dialed-theme-palette";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function parseHexToRgb(value: string) {
  const normalized = value.replace("#", "");
  const compact = normalized.length === 3
    ? normalized
        .split("")
        .map((entry) => `${entry}${entry}`)
        .join("")
    : normalized;

  const red = Number.parseInt(compact.slice(0, 2), 16);
  const green = Number.parseInt(compact.slice(2, 4), 16);
  const blue = Number.parseInt(compact.slice(4, 6), 16);

  return `${red}, ${green}, ${blue}`;
}

function resolveStoredMode(value: string | null): ThemeMode {
  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }

  return "dark";
}

function resolveStoredPalette(value: string | null): ThemePaletteId {
  return isThemePaletteId(value) ? value : defaultThemePaletteId;
}

function getSystemTheme(): ThemeAppearance {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyPalette(appearance: ThemeAppearance, paletteId: ThemePaletteId) {
  if (typeof document === "undefined") {
    return;
  }

  const preset = getThemePresetById(paletteId);
  const root = document.documentElement;

  root.dataset.theme = appearance;
  root.style.setProperty("--accent", preset.accent);
  root.style.setProperty("--accent-rgb", parseHexToRgb(preset.accent));
  root.style.setProperty("--accent-strong", preset.accentStrong);
  root.style.setProperty("--accent-strong-rgb", parseHexToRgb(preset.accentStrong));
  root.style.setProperty("--accent-secondary", preset.secondary);
  root.style.setProperty("--accent-secondary-rgb", parseHexToRgb(preset.secondary));
  root.style.setProperty("--accent-tertiary", preset.tertiary);
  root.style.setProperty("--accent-tertiary-rgb", parseHexToRgb(preset.tertiary));
  root.style.setProperty("--accent-contrast", preset.accentContrast);
  root.style.setProperty("--accent-soft", `rgba(${parseHexToRgb(preset.accent)}, 0.14)`);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<ThemeMode>("dark");
  const [lightPaletteId, setLightPaletteId] = useState<ThemePaletteId>(defaultThemePaletteId);
  const [darkPaletteId, setDarkPaletteId] = useState<ThemePaletteId>(defaultThemePaletteId);
  const [systemTheme, setSystemTheme] = useState<ThemeAppearance>("dark");

  useEffect(() => {
    const storedMode = resolveStoredMode(
      window.localStorage.getItem(THEME_MODE_KEY) ?? window.localStorage.getItem(LEGACY_THEME_KEY)
    );
    const legacyPalette = resolveStoredPalette(window.localStorage.getItem(LEGACY_PALETTE_KEY));
    const storedLightPalette = resolveStoredPalette(
      window.localStorage.getItem(LIGHT_PALETTE_KEY) ?? legacyPalette
    );
    const storedDarkPalette = resolveStoredPalette(
      window.localStorage.getItem(DARK_PALETTE_KEY) ?? legacyPalette
    );

    setMode(storedMode);
    setLightPaletteId(storedLightPalette);
    setDarkPaletteId(storedDarkPalette);
    setSystemTheme(getSystemTheme());
    setReady(true);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const syncSystemTheme = () => setSystemTheme(mediaQuery.matches ? "light" : "dark");
    mediaQuery.addEventListener("change", syncSystemTheme);

    return () => {
      mediaQuery.removeEventListener("change", syncSystemTheme);
    };
  }, []);

  const resolvedTheme = mode === "system" ? systemTheme : mode;
  const activePaletteId = resolvedTheme === "light" ? lightPaletteId : darkPaletteId;

  useEffect(() => {
    applyPalette(resolvedTheme, activePaletteId);
  }, [activePaletteId, resolvedTheme]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    window.localStorage.setItem(THEME_MODE_KEY, mode);
    window.localStorage.setItem(LIGHT_PALETTE_KEY, lightPaletteId);
    window.localStorage.setItem(DARK_PALETTE_KEY, darkPaletteId);
  }, [darkPaletteId, lightPaletteId, mode, ready]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      ready,
      mode,
      resolvedTheme,
      presets: themePresets,
      lightPaletteId,
      darkPaletteId,
      activePaletteId,
      setMode,
      setPalette: (appearance, paletteId) => {
        if (appearance === "light") {
          setLightPaletteId(paletteId);
          return;
        }

        setDarkPaletteId(paletteId);
      }
    }),
    [activePaletteId, darkPaletteId, lightPaletteId, mode, ready, resolvedTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeValue() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeValue must be used within ThemeProvider.");
  }

  return context;
}

export type { ThemeAppearance, ThemeMode };
