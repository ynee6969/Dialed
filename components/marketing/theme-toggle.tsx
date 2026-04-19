"use client";

/**
 * ===================================
 * THEME SETTINGS LAUNCHER
 * ===================================
 *
 * Purpose:
 * Opens the centered appearance modal from the floating button in the bottom-right corner.
 *
 * Key features:
 * - Light / dark / system mode switching
 * - Separate presets for the light side and dark side of the UI
 * - Search through the imported Monkeytype palette catalog
 */
import { Check, Monitor, MoonStar, Palette, Search, SunMedium, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useThemeValue, type ThemeAppearance, type ThemeMode } from "@/components/providers/theme-provider";
import styles from "./ThemeToggle.module.css";

function PresetSwatches({
  accent,
  secondary,
  tertiary
}: {
  accent: string;
  secondary: string;
  tertiary: string;
}) {
  /* Tiny three-dot preview used in both the launcher and the preset list. */
  return (
    <span className="theme-toggle-preview" aria-hidden="true">
      <span style={{ background: accent }} />
      <span style={{ background: secondary }} />
      <span style={{ background: tertiary }} />
    </span>
  );
}

export function ThemeToggle() {
  const pathname = usePathname();
  const {
    activePaletteId,
    darkPaletteId,
    lightPaletteId,
    mode,
    presets,
    resolvedTheme,
    setMode,
    setPalette
  } = useThemeValue();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  /* Controls whether the modal is editing the light palette or dark palette. */
  const [editingTheme, setEditingTheme] = useState<ThemeAppearance>("dark");

  /* Close the modal on route changes so it never persists across page navigation. */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }

    /* When the modal opens, match the editing tab to the currently visible theme
       and lock body scrolling behind the backdrop. */
    setEditingTheme(resolvedTheme);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, resolvedTheme]);

  /* Search narrows the preset list without mutating the source catalog. */
  const filteredPresets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return presets;
    }

    return presets.filter((preset) => preset.name.toLowerCase().includes(normalizedQuery));
  }, [presets, query]);

  const lightPreset = presets.find((preset) => preset.id === lightPaletteId) ?? presets[0];
  const darkPreset = presets.find((preset) => preset.id === darkPaletteId) ?? presets[0];
  const activePreset = presets.find((preset) => preset.id === activePaletteId) ?? presets[0];
  const editingPreset = editingTheme === "light" ? lightPreset : darkPreset;
  const modeOptions: Array<{
    value: ThemeMode;
    label: string;
    icon: typeof SunMedium;
  }> = [
    { value: "light", label: "Light", icon: SunMedium },
    { value: "dark", label: "Dark", icon: MoonStar },
    { value: "system", label: "System", icon: Monitor }
  ];

  const statusCopy =
    mode === "system"
      ? `System is currently showing ${resolvedTheme} mode`
      : `${mode.charAt(0).toUpperCase()}${mode.slice(1)} mode is active`;

  return (
    <div className={styles.scope}>
      {/* Floating launcher stays visible on every route and opens the modal. */}
      <button
        type="button"
        className={`theme-launcher ${open ? "is-open" : ""}`.trim()}
        onClick={() => setOpen(true)}
        aria-label="Open theme settings"
        aria-expanded={open}
      >
        <Palette size={16} />
        <span className="theme-launcher-label">Theme</span>
        <PresetSwatches
          accent={activePreset.accent}
          secondary={activePreset.secondary}
          tertiary={activePreset.tertiary}
        />
      </button>

      {open ? (
        /* Full-screen backdrop centers the modal and dismisses on outside click. */
        <div className="theme-modal-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <div
            className="glass-panel theme-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Theme settings"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="theme-modal-header">
              <div className="theme-modal-copy">
                <span className="section-label theme-modal-label">Appearance</span>
                <h2>Theme settings</h2>
                <p className="muted">
                  Match the layout to your taste with the full Monkeytype theme catalog, then choose what
                  light, dark, and system mode should use.
                </p>
              </div>

              <button
                type="button"
                className="button-ghost theme-modal-close"
                onClick={() => setOpen(false)}
                aria-label="Close theme settings"
              >
                <X size={16} />
              </button>
            </div>

            <div className="theme-mode-row theme-modal-mode-row">
              {modeOptions.map((option) => {
                const Icon = option.icon;

                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`theme-mode-button ${mode === option.value ? "is-active" : ""}`.trim()}
                    onClick={() => setMode(option.value)}
                  >
                    <Icon size={15} />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="theme-preview-grid">
              {([
                {
                  appearance: "light" as const,
                  title: "Light preset",
                  description: "Used whenever light mode is active.",
                  preset: lightPreset
                },
                {
                  appearance: "dark" as const,
                  title: "Dark preset",
                  description: "Used whenever dark mode is active.",
                  preset: darkPreset
                }
              ] satisfies Array<{
                appearance: ThemeAppearance;
                title: string;
                description: string;
                preset: typeof activePreset;
              }>).map((entry) => (
                <button
                  key={entry.appearance}
                  type="button"
                  className={`theme-preview-card ${editingTheme === entry.appearance ? "is-active" : ""}`.trim()}
                  onClick={() => setEditingTheme(entry.appearance)}
                >
                  <div className="theme-preview-copy">
                    <span>{entry.title}</span>
                    <strong>{entry.preset.name}</strong>
                    <p>{entry.description}</p>
                  </div>
                  <PresetSwatches
                    accent={entry.preset.accent}
                    secondary={entry.preset.secondary}
                    tertiary={entry.preset.tertiary}
                  />
                </button>
              ))}
            </div>

            <div className="theme-modal-toolbar">
              <label className="theme-search theme-modal-search" htmlFor="theme-preset-search">
                <Search size={15} />
                <input
                  id="theme-preset-search"
                  type="search"
                  placeholder="Search Monkeytype themes..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>

              <div className="theme-edit-toggle" role="tablist" aria-label="Theme preset target">
                {(["light", "dark"] as const).map((appearance) => (
                  <button
                    key={appearance}
                    type="button"
                    className={`theme-edit-button ${editingTheme === appearance ? "is-active" : ""}`.trim()}
                    onClick={() => setEditingTheme(appearance)}
                    role="tab"
                    aria-selected={editingTheme === appearance}
                  >
                    {appearance === "light" ? "Editing light" : "Editing dark"}
                  </button>
                ))}
              </div>
            </div>

            <div className="theme-modal-section-header">
              <div>
                <strong>{editingTheme === "light" ? "Light theme presets" : "Dark theme presets"}</strong>
                <p className="muted">
                  Pick the preset that should power the {editingTheme} side of the interface.
                </p>
              </div>
              <span className="theme-status-chip">{statusCopy}</span>
            </div>

            <div className="theme-preset-list">
              {filteredPresets.map((preset) => {
                const active = preset.id === editingPreset.id;

                return (
                  <button
                    key={`${editingTheme}-${preset.id}`}
                    type="button"
                    className={`theme-preset-row ${active ? "is-active" : ""}`.trim()}
                    onClick={() => setPalette(editingTheme, preset.id)}
                  >
                    <span className="theme-preset-name">
                      {active ? <Check size={14} /> : <span className="theme-preset-spacer" />}
                      <span className="theme-preset-name-text">{preset.name}</span>
                    </span>
                    <PresetSwatches
                      accent={preset.accent}
                      secondary={preset.secondary}
                      tertiary={preset.tertiary}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
