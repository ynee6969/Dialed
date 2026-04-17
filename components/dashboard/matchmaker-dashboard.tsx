"use client";

import Link from "next/link";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Filter, LoaderCircle, RotateCcw, X } from "lucide-react";

import { DeviceCard } from "@/components/phones/device-card";
import type { PhoneCardRecord } from "@/lib/types/phone-card";
import {
  batteryCapacityOptions,
  cameraQualityOptions,
  performanceTierOptions,
  priceRangeOptions
} from "@/lib/utils/phone-filters";

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
    <div className="stack sidebar-filter-stack" style={{ marginTop: 18 }}>
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
        className="button-secondary"
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
    <div className="sheet-overlay" role="presentation" onClick={onClose}>
      <div className="sheet-panel" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
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

export function MatchmakerDashboard({
  initialPhones,
  initialBrands,
  stats
}: MatchmakerDashboardProps) {
  const [phones, setPhones] = useState(initialPhones);
  const [brands, setBrands] = useState(initialBrands);
  const [total, setTotal] = useState(initialPhones.length);
  const [filters, setFilters] = useState(defaultFilters);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeMobileSheet, setActiveMobileSheet] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.brand) params.set("brand", filters.brand);
    if (filters.priceRange) params.set("priceRange", filters.priceRange);
    if (filters.performanceTier) params.set("performanceTier", filters.performanceTier);
    if (filters.cameraQuality) params.set("cameraQuality", filters.cameraQuality);
    if (filters.batteryCapacity) params.set("batteryCapacity", filters.batteryCapacity);
    params.set("take", "100");

    let ignore = false;
    const controller = new AbortController();

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

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [filters.brand, filters.priceRange, filters.performanceTier, filters.cameraQuality, filters.batteryCapacity]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="dashboard-layout">
      <aside className="sidebar desktop-sidebar">
        <div className="glass-panel sidebar-card sidebar-scroll">
          <span className="section-label">Filters</span>
          <DashboardFilters filters={filters} setFilters={setFilters} brands={brands} />
        </div>
      </aside>

      <section className="results-stack">
        <div className="dashboard-topbar dashboard-topbar-split">
          <div className="stack" style={{ gap: 10 }}>
            <span className="section-label">Dashboard</span>
            <h1 className="dashboard-title">Filter smarter, save what matters, and compare in a dedicated lab.</h1>
            <p className="muted dashboard-copy">
              Use the sidebar to narrow the catalog, save contenders as favorites, and open the compare page
              only when you are ready to evaluate two phones side by side.
            </p>
          </div>

          <div className="button-row dashboard-cta-row">
            <Link href="/compare" className="button">
              Open compare lab
            </Link>
            <Link href="/favorites" className="button-secondary">
              View saved phones
            </Link>
          </div>
        </div>

        <div className="dashboard-mobile-actions">
          <button type="button" className="button-secondary" onClick={() => setActiveMobileSheet(true)}>
            <Filter size={16} />
            <span style={{ marginLeft: 8 }}>Filters</span>
          </button>
          <Link href="/compare" className="button">
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

        <div className="glass-panel card dashboard-summary-card">
          <div className="metric-grid">
            <div className="metric">
              <span>Showing now</span>
              <strong>{total}</strong>
            </div>
            <div className="metric">
              <span>Filters active</span>
              <strong>{activeFilterCount}</strong>
            </div>
            <div className="metric">
              <span>Total catalog</span>
              <strong>{stats.catalogSize}</strong>
            </div>
            <div className="metric">
              <span>Compare flow</span>
              <strong>Dedicated page</strong>
            </div>
          </div>
        </div>

        <div className="phone-grid dashboard-grid">
          {phones.length ? (
            phones.map((phone) => <DeviceCard key={phone.id} phone={phone} />)
          ) : (
            <div className="glass-panel empty-state">No phones match the current filters.</div>
          )}
        </div>

        {loading ? (
          <div className="glass-panel card">
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
