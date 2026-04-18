"use client";

import { Check, MoonStar, Palette, Search, SunMedium } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { useThemeValue } from "@/components/providers/theme-provider";

export function ThemeToggle() {
  const { theme, paletteId, presets, ready, setPaletteId, setTheme } = useThemeValue();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
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

  const filteredPresets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return presets;
    }

    return presets.filter((preset) => preset.name.toLowerCase().includes(normalizedQuery));
  }, [presets, query]);

  const activePreset = presets.find((preset) => preset.id === paletteId) ?? presets[0];

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
        <span>{ready ? activePreset.name : "Theme"}</span>
        <span className="theme-toggle-preview" aria-hidden="true">
          <span style={{ background: activePreset.accent }} />
          <span style={{ background: activePreset.secondary }} />
          <span style={{ background: activePreset.tertiary }} />
        </span>
      </button>

      {open ? (
        <div className="glass-panel theme-panel" role="dialog" aria-modal="false" aria-label="Theme customizer">
          <div className="theme-panel-header">
            <div>
              <strong>Theme studio</strong>
              <p className="muted">Choose a color preset and switch between light or dark mode.</p>
            </div>
          </div>

          <div className="theme-mode-row">
            <button
              type="button"
              className={`theme-mode-button ${theme === "dark" ? "is-active" : ""}`.trim()}
              onClick={() => setTheme("dark")}
            >
              <MoonStar size={15} />
              <span>Dark</span>
            </button>
            <button
              type="button"
              className={`theme-mode-button ${theme === "light" ? "is-active" : ""}`.trim()}
              onClick={() => setTheme("light")}
            >
              <SunMedium size={15} />
              <span>Light</span>
            </button>
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

          <div className="theme-panel-list">
            {filteredPresets.map((preset) => {
              const active = preset.id === paletteId;

              return (
                <button
                  key={preset.id}
                  type="button"
                  className={`theme-option ${active ? "is-active" : ""}`.trim()}
                  onClick={() => setPaletteId(preset.id)}
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
      ) : null}
    </div>
  );
}
