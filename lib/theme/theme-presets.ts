import generatedThemePresets from "@/monkeytype-theme-presets.generated.json";

export interface ThemePreset {
  id: string;
  name: string;
  accent: string;
  accentStrong: string;
  accentContrast: string;
  secondary: string;
  tertiary: string;
  background: string;
  surface: string;
  foreground: string;
  muted: string;
  danger: string;
}

export type ThemePaletteId = string;

export const themePresets = generatedThemePresets as ThemePreset[];

export const defaultLightThemePaletteId: ThemePaletteId = "serika";
export const defaultDarkThemePaletteId: ThemePaletteId = "serika_dark";

export function getThemePresetById(id: ThemePaletteId) {
  return themePresets.find((preset) => preset.id === id) ?? themePresets[0];
}

export function isThemePaletteId(value: string | null | undefined): value is ThemePaletteId {
  return Boolean(value && themePresets.some((preset) => preset.id === value));
}
