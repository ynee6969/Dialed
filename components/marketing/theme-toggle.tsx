"use client";

import { Check, Monitor, MoonStar, Palette, Search, SunMedium } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { useThemeValue, type ThemeAppearance, type ThemeMode } from "@/components/providers/theme-provider";

function PresetSwatches({
  accent,
  secondary,
  tertiary
}: {
  accent: string;
  secondary: string;
  tertiary: string;
}) {
  return (
    <span className="theme-toggle-preview" aria-hidden="true">
      <span style={{ background: accent }} />
      <span style={{ background: secondary }} />
      <span style={{ background: tertiary }} />
    </span>
  );
}

export function ThemeToggle() {
  const {
    activePaletteId,
    darkPaletteId,
    lightPaletteId,
    mode,
    presets,
    ready,
    resolvedTheme,
    setMode,
    setPalette
  } = useThemeValue();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [editingTheme, setEditingTheme] = useState<ThemeAppearance>("dark");
  const shellRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!shellRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setEditingTheme(resolvedTheme);
  }, [open, resolvedTheme]);

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
  const modeOptions: Array<{
    value: ThemeMode;
    label: string;
    icon: typeof SunMedium;
  }> = [
    { value: "light", label: "Light", icon: SunMedium },
    { value: "dark", label: "Dark", icon: MoonStar },
    { value: "system", label: "System", icon: Monitor }
  ];
  const editingPreset = editingTheme === "light" ? lightPreset : darkPreset;

  return (
    <div ref={shellRef} className="theme-toggle-shell">
      <button
        type="button"
        className={`theme-toggle ${open ? "is-open" : ""}`.trim()}
        onClick={() => setOpen((current) => !current)}
        aria-label="Open theme customizer"
        aria-expanded={open}
      >
        <Palette size={16} />
        <span>Theme</span>
        <PresetSwatches
          accent={activePreset.accent}
          secondary={activePreset.secondary}
          tertiary={activePreset.tertiary}
        />
      </button>

      {open ? (
        <div className="glass-panel theme-panel theme-settings-panel" role="dialog" aria-modal="false" aria-label="Theme settings">
          <div className="theme-panel-header">
            <div>
              <strong>Theme</strong>
              <p className="muted">
                Choose light, dark, or system mode, then pick a preset for each side of the interface.
              </p>
            </div>
          </div>

          <div className="theme-mode-row theme-mode-row-three">
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

          <div className="theme-settings-surface-grid">
            {([
              {
                appearance: "light" as const,
                label: "Light theme",
                description: "Used when the app is in light mode.",
                preset: lightPreset
              },
              {
                appearance: "dark" as const,
                label: "Dark theme",
                description: "Used when the app is in dark mode.",
                preset: darkPreset
              }
            ] satisfies Array<{
              appearance: ThemeAppearance;
              label: string;
              description: string;
              preset: typeof activePreset;
            }>).map((entry) => (
              <button
                key={entry.appearance}
                type="button"
                className={`theme-settings-surface ${editingTheme === entry.appearance ? "is-active" : ""}`.trim()}
                onClick={() => setEditingTheme(entry.appearance)}
              >
                <div className="theme-settings-surface-copy">
                  <span>{entry.label}</span>
                  <strong>{entry.preset.name}</strong>
                  <small>{entry.description}</small>
                </div>
                <PresetSwatches
                  accent={entry.preset.accent}
                  secondary={entry.preset.secondary}
                  tertiary={entry.preset.tertiary}
                />
              </button>
            ))}
          </div>

          <label className="theme-search" htmlFor="theme-preset-search">
            <Search size={15} />
            <input
              id="theme-preset-search"
              type="search"
              placeholder="Theme..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <div className="theme-settings-section">
            <div className="theme-settings-section-header">
              <div>
                <strong>{editingTheme === "light" ? "Light theme" : "Dark theme"}</strong>
                <p className="muted" style={{ marginBottom: 0 }}>
                  {editingTheme === "light"
                    ? "Choose the preset you want whenever light mode is active."
                    : "Choose the preset you want whenever dark mode is active."}
                </p>
              </div>
              <span className="theme-settings-badge">
                {mode === "system"
                  ? `System is currently using ${resolvedTheme}`
                  : `${mode[0]?.toUpperCase()}${mode.slice(1)} mode active`}
              </span>
            </div>

            <div className="theme-panel-list theme-settings-list">
              {filteredPresets.map((preset) => {
                const active = preset.id === editingPreset.id;

                return (
                  <button
                    key={`${editingTheme}-${preset.id}`}
                    type="button"
                    className={`theme-option ${active ? "is-active" : ""}`.trim()}
                    onClick={() => setPalette(editingTheme, preset.id)}
                  >
                    <span className="theme-option-name">
                      {active ? <Check size={14} /> : <span className="theme-option-spacer" />}
                      {preset.name}
                    </span>
                    <span className="theme-option-swatches" aria-hidden="true">
                      <span style={{ background: preset.accent }} />
                      <span style={{ background: preset.secondary }} />
                      <span style={{ background: preset.tertiary }} />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="theme-settings-section theme-settings-summary-section">
            <div className="theme-settings-summary-row">
              <div className="theme-settings-summary-copy">
                <span>Light theme</span>
                <strong>{lightPreset.name}</strong>
              </div>
              <PresetSwatches
                accent={lightPreset.accent}
                secondary={lightPreset.secondary}
                tertiary={lightPreset.tertiary}
              />
            </div>
            <div className="theme-settings-summary-row">
              <div className="theme-settings-summary-copy">
                <span>Dark theme</span>
                <strong>{darkPreset.name}</strong>
              </div>
              <PresetSwatches
                accent={darkPreset.accent}
                secondary={darkPreset.secondary}
                tertiary={darkPreset.tertiary}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
