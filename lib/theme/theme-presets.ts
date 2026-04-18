export type ThemePaletteId =
  | "deviceiq"
  | "olive"
  | "olivia"
  | "paper"
  | "pastel"
  | "peaches"
  | "pink-lemonade"
  | "pulse"
  | "purpleish"
  | "red-dragon"
  | "retrocast"
  | "rgb"
  | "rose-pine"
  | "rose-pine-dawn";

export interface ThemePreset {
  id: ThemePaletteId;
  name: string;
  accent: string;
  accentStrong: string;
  accentContrast: string;
  secondary: string;
  tertiary: string;
}

export const themePresets: ThemePreset[] = [
  {
    id: "deviceiq",
    name: "our theme",
    accent: "#46b37b",
    accentStrong: "#2d8d5c",
    accentContrast: "#08110c",
    secondary: "#5f96ff",
    tertiary: "#b8d9ca"
  },
  {
    id: "olive",
    name: "olive",
    accent: "#c6c995",
    accentStrong: "#969b68",
    accentContrast: "#141408",
    secondary: "#b6b297",
    tertiary: "#f1edd2"
  },
  {
    id: "olivia",
    name: "olivia",
    accent: "#d7af9a",
    accentStrong: "#a87968",
    accentContrast: "#1a0d09",
    secondary: "#5f4b56",
    tertiary: "#d9e1bf"
  },
  {
    id: "paper",
    name: "paper",
    accent: "#f4f4f0",
    accentStrong: "#d7d7cd",
    accentContrast: "#151515",
    secondary: "#8d8d8d",
    tertiary: "#c4c4c4"
  },
  {
    id: "pastel",
    name: "pastel",
    accent: "#ffe89a",
    accentStrong: "#d9bd66",
    accentContrast: "#2a1804",
    secondary: "#90d6ff",
    tertiary: "#e3b8cc"
  },
  {
    id: "peaches",
    name: "peaches",
    accent: "#f0a274",
    accentStrong: "#c47c52",
    accentContrast: "#291208",
    secondary: "#f1ccb0",
    tertiary: "#f6efe1"
  },
  {
    id: "pink-lemonade",
    name: "pink lemonade",
    accent: "#ffb87b",
    accentStrong: "#e08e56",
    accentContrast: "#251006",
    secondary: "#f6a0ca",
    tertiary: "#fff2a7"
  },
  {
    id: "pulse",
    name: "pulse",
    accent: "#18c3d8",
    accentStrong: "#1194a4",
    accentContrast: "#041416",
    secondary: "#5e5e58",
    tertiary: "#eef4ee"
  },
  {
    id: "purpleish",
    name: "purpleish",
    accent: "#8c6bff",
    accentStrong: "#6b52cf",
    accentContrast: "#f3efff",
    secondary: "#7f7ad5",
    tertiary: "#d4d7f9"
  },
  {
    id: "red-dragon",
    name: "red dragon",
    accent: "#ff4a3d",
    accentStrong: "#d23328",
    accentContrast: "#fff3ef",
    secondary: "#f0a418",
    tertiary: "#3b2421"
  },
  {
    id: "retrocast",
    name: "retrocast",
    accent: "#42c1cb",
    accentStrong: "#2f95a0",
    accentContrast: "#051517",
    secondary: "#f6d93f",
    tertiary: "#75d9d1"
  },
  {
    id: "rgb",
    name: "rgb",
    accent: "#f2f3f6",
    accentStrong: "#d5d7df",
    accentContrast: "#0c0d14",
    secondary: "#5b5e66",
    tertiary: "#23242a"
  },
  {
    id: "rose-pine",
    name: "rose pine",
    accent: "#9ccfd8",
    accentStrong: "#6ea5b2",
    accentContrast: "#071417",
    secondary: "#c4a7e7",
    tertiary: "#e0def4"
  },
  {
    id: "rose-pine-dawn",
    name: "rose pine dawn",
    accent: "#7aa2b5",
    accentStrong: "#55798c",
    accentContrast: "#f2fbff",
    secondary: "#b59ee9",
    tertiary: "#6b8a97"
  }
];

export const defaultThemePaletteId: ThemePaletteId = "deviceiq";

export function getThemePresetById(id: ThemePaletteId) {
  return themePresets.find((preset) => preset.id === id) ?? themePresets[0];
}

export function isThemePaletteId(value: string | null | undefined): value is ThemePaletteId {
  return Boolean(value && themePresets.some((preset) => preset.id === value));
}
