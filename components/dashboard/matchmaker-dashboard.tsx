"use client";

import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  LoaderCircle,
  RotateCcw,
  X
} from "lucide-react";
import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";

import { DeviceCard } from "@/components/phones/device-card";
import type { PhoneCardRecord } from "@/lib/types/phone-card";
import {
  batteryCapacityOptions,
  cameraQualityOptions,
  performanceTierOptions,
  priceRangeOptions
} from "@/lib/utils/phone-filters";
import styles from "./MatchmakerDashboard.module.css";

export type DashboardPhone = PhoneCardRecord;

interface DashboardStats {
  catalogSize: number;
}

interface MatchmakerDashboardProps {
  initialPhones: DashboardPhone[];
  initialBrands: string[];
  stats: DashboardStats;
}

interface FiltersState {
  brand: string;
  priceRange: string;
  performanceTier: string;
  cameraQuality: string;
  batteryCapacity: string;
}

const defaultFilters: FiltersState = {
  brand: "",
  priceRange: "",
  performanceTier: "",
  cameraQuality: "",
  batteryCapacity: ""
};

function FilterSelect({
  id,
  label,
  value,
  onChange,
  options
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} className="select" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Any</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function DashboardFilters({
  filters,
  setFilters,
  brands
}: {
  filters: FiltersState;
  setFilters: Dispatch<SetStateAction<FiltersState>>;
  brands: string[];
}) {
  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="stack sidebar-filter-stack">
      <div className="field">
        <label htmlFor="brand">Brand</label>
        <select
          id="brand"
          className="select"
          value={filters.brand}
          onChange={(event) => setFilters((current) => ({ ...current, brand: event.target.value }))}
        >
          <option value="">Any brand</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <FilterSelect
        id="priceRange"
        label="Price range"
        value={filters.priceRange}
        onChange={(value) => setFilters((current) => ({ ...current, priceRange: value }))}
        options={[...priceRangeOptions]}
      />

      <FilterSelect
        id="performanceTier"
        label="Performance tier"
        value={filters.performanceTier}
        onChange={(value) => setFilters((current) => ({ ...current, performanceTier: value }))}
        options={[...performanceTierOptions]}
      />

      <FilterSelect
        id="cameraQuality"
        label="Camera quality"
        value={filters.cameraQuality}
        onChange={(value) => setFilters((current) => ({ ...current, cameraQuality: value }))}
        options={[...cameraQualityOptions]}
      />

      <FilterSelect
        id="batteryCapacity"
        label="Battery capacity"
        value={filters.batteryCapacity}
        onChange={(value) => setFilters((current) => ({ ...current, batteryCapacity: value }))}
        options={[...batteryCapacityOptions]}
      />

      <button
        type="button"
        className="button-secondary magnetic-button"
        disabled={!hasActiveFilters}
        onClick={() => setFilters(defaultFilters)}
      >
        <RotateCcw size={16} />
        <span style={{ marginLeft: 8 }}>Clear filters</span>
      </button>
    </div>
  );
}

function MobileSheet({
  title,
  onClose,
  children
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`sheet-overlay ${styles.sheetOverlay}`} role="presentation" onClick={onClose}>
      <div
        className={`sheet-panel ${styles.sheetPanel}`}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sheet-header">
          <strong>{title}</strong>
          <button type="button" className="theme-toggle" onClick={onClose}>
            <X size={16} />
            <span>Close</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function DashboardSkeletonGrid() {
  return (
    <div className="phone-grid dashboard-grid dashboard-skeleton-grid" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="glass-panel phone-card phone-card-skeleton">
          <div className="skeleton-line skeleton-pill" />
          <div className="skeleton-media" />
          <div className="skeleton-line skeleton-title" />
          <div className="skeleton-line skeleton-copy" />
          <div className="skeleton-line skeleton-copy short" />
          <div className="skeleton-stats">
            <div className="skeleton-line skeleton-stat" />
            <div className="skeleton-line skeleton-stat" />
            <div className="skeleton-line skeleton-stat" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MatchmakerDashboard({
  initialPhones,
  initialBrands,
  stats
}: MatchmakerDashboardProps) {
  const [phones, setPhones] = useState(initialPhones);
  const [brands, setBrands] = useState(initialBrands);
  const [total, setTotal] = useState(stats.catalogSize);
  const [filters, setFilters] = useState(defaultFilters);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeMobileSheet, setActiveMobileSheet] = useState(false);
  const [desktopFiltersExpanded, setDesktopFiltersExpanded] = useState(true);
  const pageSize = 10;

  const buildParams = useCallback(
    (skip = 0) => {
      const params = new URLSearchParams();
      if (filters.brand) params.set("brand", filters.brand);
      if (filters.priceRange) params.set("priceRange", filters.priceRange);
      if (filters.performanceTier) params.set("performanceTier", filters.performanceTier);
      if (filters.cameraQuality) params.set("cameraQuality", filters.cameraQuality);
      if (filters.batteryCapacity) params.set("batteryCapacity", filters.batteryCapacity);
      params.set("take", String(pageSize));
      params.set("skip", String(skip));

      return params;
    },
    [filters.batteryCapacity, filters.brand, filters.cameraQuality, filters.performanceTier, filters.priceRange]
  );

  useEffect(() => {
    const params = buildParams(0);

    let ignore = false;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      setLoading(true);
      setStatus(null);

      void fetch(`/api/phones?${params.toString()}`, {
        signal: controller.signal
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error("Could not load the dashboard.");
          }

          return response.json();
        })
        .then((data) => {
          if (ignore) {
            return;
          }

          setPhones(data.phones ?? []);
          setBrands(data.brands ?? []);
          setTotal(data.total ?? 0);
        })
        .catch((error) => {
          if (!ignore && error.name !== "AbortError") {
            setStatus("Could not reload the phone list right now.");
          }
        })
        .finally(() => {
          if (!ignore) {
            setLoading(false);
          }
        });
    }, 140);

    return () => {
      ignore = true;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [buildParams]);

  async function handleShowMore() {
    setLoadingMore(true);
    setStatus(null);

    try {
      const response = await fetch(`/api/phones?${buildParams(phones.length).toString()}`);
      if (!response.ok) {
        throw new Error("Could not load more phones.");
      }

      const data = await response.json();
      const nextPhones = (data.phones ?? []) as DashboardPhone[];

      setPhones((current) => {
        const ids = new Set(current.map((phone) => phone.id));
        return [...current, ...nextPhones.filter((phone) => !ids.has(phone.id))];
      });
      setBrands((current) => (data.brands?.length ? data.brands : current));
      setTotal((current) => data.total ?? current);
    } catch {
      setStatus("Could not load more phones right now.");
    } finally {
      setLoadingMore(false);
    }
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const hasMore = phones.length < total;

  return (
    <div className={`dashboard-layout ${styles.scope}`}>
      <aside className="sidebar desktop-sidebar">
        <div className="glass-panel sidebar-card dashboard-filter-panel">
          <button
            type="button"
            className="dashboard-filter-toggle"
            onClick={() => setDesktopFiltersExpanded((current) => !current)}
            aria-expanded={desktopFiltersExpanded}
          >
            <div>
              <span className="section-label">Filters</span>
              <p className="muted dashboard-filter-copy">
                Brand, budget, performance, camera, and battery in one compact stack.
              </p>
            </div>
            {desktopFiltersExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {desktopFiltersExpanded ? (
            <div className="sidebar-scroll">
              <DashboardFilters filters={filters} setFilters={setFilters} brands={brands} />
            </div>
          ) : (
            <p className="muted dashboard-filter-collapsed">
              {activeFilterCount ? `${activeFilterCount} filters active.` : "Filters are tucked away."}
            </p>
          )}
        </div>
      </aside>

      <section className="results-stack">
        <div className="dashboard-topbar dashboard-topbar-split">
          <div className="stack dashboard-copy-stack">
            <span className="section-label">Dashboard</span>
            <div className="dashboard-hero-meta">
              <span className="chip">{stats.catalogSize} phones in the live catalog</span>
              <span className="chip">{activeFilterCount} filters active</span>
              <span className="chip">Sign-in is optional</span>
            </div>
            <h1 className="dashboard-title">Browse the full catalog first. Sign in only when you want favorites.</h1>
            <p className="muted dashboard-copy">
              This page is now the main discovery surface. Filter the catalog, open specs fast, and jump into
              compare only when you already have contenders worth testing.
            </p>
          </div>

          <div className="button-row dashboard-cta-row">
            <Link href="/compare" className="button magnetic-button">
              Open compare lab
            </Link>
            <Link href="/favorites" className="button-secondary magnetic-button">
              View saved phones
            </Link>
          </div>
        </div>

        <div className="dashboard-mobile-actions">
          <button type="button" className="button-secondary magnetic-button" onClick={() => setActiveMobileSheet(true)}>
            <Filter size={16} />
            <span style={{ marginLeft: 8 }}>
              Filters{activeFilterCount ? ` (${activeFilterCount})` : ""}
            </span>
          </button>
          <Link href="/compare" className="button magnetic-button">
            Compare phones
          </Link>
        </div>

        {status ? (
          <div className="glass-panel card status-card">
            <strong>Status</strong>
            <p className="muted" style={{ marginBottom: 0 }}>
              {status}
            </p>
          </div>
        ) : null}

        {loading ? <DashboardSkeletonGrid /> : null}

        <div className={`phone-grid dashboard-grid ${loading ? "is-dimmed" : ""}`}>
          {phones.length ? (
            phones.map((phone) => <DeviceCard key={phone.id} phone={phone} />)
          ) : (
            <div className="glass-panel empty-state">No phones match the current filters.</div>
          )}
        </div>

        {hasMore ? (
          <div className="dashboard-more-row">
            <button
              type="button"
              className="button-secondary magnetic-button"
              onClick={() => void handleShowMore()}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <>
                  <LoaderCircle size={16} className="spin" />
                  <span style={{ marginLeft: 8 }}>Loading more</span>
                </>
              ) : (
                "Show 10 more phones"
              )}
            </button>
            <span className="muted">
              Showing {phones.length} of {total}
            </span>
          </div>
        ) : null}

        {loading ? (
          <div className="glass-panel card dashboard-loading-card">
            <p className="muted" style={{ margin: 0 }}>
              <LoaderCircle size={16} className="spin" style={{ marginRight: 8, verticalAlign: "middle" }} />
              Updating the catalog view...
            </p>
          </div>
        ) : null}
      </section>

      {activeMobileSheet ? (
        <MobileSheet title="Filters" onClose={() => setActiveMobileSheet(false)}>
          <DashboardFilters filters={filters} setFilters={setFilters} brands={brands} />
        </MobileSheet>
      ) : null}
    </div>
  );
}
