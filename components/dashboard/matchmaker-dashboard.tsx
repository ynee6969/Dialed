"use client";

import {
  startTransition,
  useDeferredValue,
  useEffect,
  useState,
  useTransition,
  type Dispatch,
  type SetStateAction
} from "react";
import { Filter, GitCompareArrows, LoaderCircle, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";

import { DeviceCard } from "@/components/phones/device-card";
import { getPhoneDisplayName } from "@/lib/utils/phone-presentation";
import { formatPhp, formatScore } from "@/lib/utils/format";

export interface DashboardPhone {
  id: string;
  slug: string;
  brand: string;
  model: string;
  segment: string;
  price: number;
  performanceScore: number | null;
  cameraScore: number | null;
  batteryScore: number | null;
  valueScore: number | null;
  finalScore: number | null;
}

interface RecommendationMatch {
  phone: DashboardPhone;
  personalizedScore: number;
  reasons: string[];
}

interface ComparisonResult {
  phones: DashboardPhone[];
  leaders: Array<{
    metric: string;
    phoneId: string | null;
    model: string | null;
    score: number | null;
  }>;
}

interface DashboardStats {
  catalogSize: number;
}

interface MatchmakerDashboardProps {
  initialPhones: DashboardPhone[];
  initialBrands: string[];
  stats: DashboardStats;
}

interface FiltersState {
  search: string;
  brand: string;
  segment: string;
  maxPrice: string;
  sort: string;
  minBattery: string;
  minRam: string;
}

interface RecommendFormState {
  budget: number;
  minBudget: number;
  minBattery: number;
  minRam: number;
  osPreference: string;
  useCase: string;
}

function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(handle);
  }, [value, delay]);

  return debounced;
}

const defaultFilters: FiltersState = {
  search: "",
  brand: "",
  segment: "",
  maxPrice: "",
  sort: "top",
  minBattery: "",
  minRam: ""
};

const defaultRecommendForm: RecommendFormState = {
  budget: 45000,
  minBudget: 0,
  minBattery: 0,
  minRam: 0,
  osPreference: "any",
  useCase: "balanced"
};

function DashboardFilters({
  filters,
  setFilters,
  brands
}: {
  filters: FiltersState;
  setFilters: Dispatch<SetStateAction<FiltersState>>;
  brands: string[];
}) {
  return (
    <div className="stack" style={{ marginTop: 18 }}>
      <div className="field">
        <label htmlFor="search">Search phones</label>
        <div style={{ position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 14, top: 15, color: "var(--muted)" }} />
          <input
            id="search"
            className="input"
            style={{ paddingLeft: 38 }}
            value={filters.search}
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            placeholder="Galaxy, Pixel, Poco..."
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="segment">Segment</label>
        <select
          id="segment"
          className="select"
          value={filters.segment}
          onChange={(event) => setFilters((current) => ({ ...current, segment: event.target.value }))}
        >
          <option value="">All segments</option>
          <option value="entry">Entry</option>
          <option value="budget">Budget</option>
          <option value="entry_mid">Entry Mid</option>
          <option value="midrange">Midrange</option>
          <option value="upper_mid">Upper Mid</option>
          <option value="flagship">Flagship</option>
          <option value="ultra_flagship">Ultra Flagship</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="brand">Brand</label>
        <select
          id="brand"
          className="select"
          value={filters.brand}
          onChange={(event) => setFilters((current) => ({ ...current, brand: event.target.value }))}
        >
          <option value="">All brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="maxPrice">Max budget (PHP)</label>
        <input
          id="maxPrice"
          className="input"
          type="number"
          value={filters.maxPrice}
          onChange={(event) => setFilters((current) => ({ ...current, maxPrice: event.target.value }))}
          placeholder="45000"
        />
      </div>

      <div className="field">
        <label htmlFor="minBattery">Min battery (mAh)</label>
        <input
          id="minBattery"
          className="input"
          type="number"
          value={filters.minBattery}
          onChange={(event) => setFilters((current) => ({ ...current, minBattery: event.target.value }))}
          placeholder="5000"
        />
      </div>

      <div className="field">
        <label htmlFor="minRam">Min RAM (GB)</label>
        <input
          id="minRam"
          className="input"
          type="number"
          value={filters.minRam}
          onChange={(event) => setFilters((current) => ({ ...current, minRam: event.target.value }))}
          placeholder="8"
        />
      </div>

      <div className="field">
        <label htmlFor="sort">Sort by</label>
        <select
          id="sort"
          className="select"
          value={filters.sort}
          onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}
        >
          <option value="top">Top score</option>
          <option value="price_asc">Lowest price</option>
          <option value="price_desc">Highest price</option>
          <option value="performance">Performance</option>
          <option value="camera">Camera</option>
          <option value="battery">Battery</option>
        </select>
      </div>
    </div>
  );
}

function DashboardMatchmaker({
  recommendForm,
  setRecommendForm,
  busy,
  onRecommend,
  onEnrich,
  onCompare
}: {
  recommendForm: RecommendFormState;
  setRecommendForm: Dispatch<SetStateAction<RecommendFormState>>;
  busy: "recommend" | "compare" | "enrich" | null;
  onRecommend: () => Promise<void>;
  onEnrich: () => Promise<void>;
  onCompare: () => Promise<void>;
}) {
  return (
    <div className="stack" style={{ marginTop: 18 }}>
      <div className="field">
        <label htmlFor="recBudget">Budget</label>
        <input
          id="recBudget"
          className="input"
          type="number"
          value={recommendForm.budget}
          onChange={(event) =>
            setRecommendForm((current) => ({ ...current, budget: Number(event.target.value) || 0 }))
          }
        />
      </div>

      <div className="field">
        <label htmlFor="useCase">Use case</label>
        <select
          id="useCase"
          className="select"
          value={recommendForm.useCase}
          onChange={(event) =>
            setRecommendForm((current) => ({ ...current, useCase: event.target.value }))
          }
        >
          <option value="balanced">Balanced</option>
          <option value="gaming">Gaming</option>
          <option value="camera">Camera</option>
          <option value="battery">Battery</option>
          <option value="value">Value</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="osPreference">OS preference</label>
        <select
          id="osPreference"
          className="select"
          value={recommendForm.osPreference}
          onChange={(event) =>
            setRecommendForm((current) => ({ ...current, osPreference: event.target.value }))
          }
        >
          <option value="any">Any</option>
          <option value="android">Android</option>
          <option value="ios">iOS</option>
        </select>
      </div>

      <div className="button-row button-row-stack">
        <button className="button" type="button" onClick={() => void onRecommend()} disabled={busy !== null}>
          {busy === "recommend" ? <LoaderCircle size={16} className="spin" /> : <SlidersHorizontal size={16} />}
          <span style={{ marginLeft: 8 }}>Find matches</span>
        </button>
        <button className="button-secondary" type="button" onClick={() => void onEnrich()} disabled={busy !== null}>
          {busy === "enrich" ? <LoaderCircle size={16} className="spin" /> : <Sparkles size={16} />}
          <span style={{ marginLeft: 8 }}>Reload specs</span>
        </button>
        <button className="button-ghost" type="button" onClick={() => void onCompare()} disabled={busy !== null}>
          <GitCompareArrows size={16} />
          <span style={{ marginLeft: 8 }}>Compare selected</span>
        </button>
      </div>
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [recommendForm, setRecommendForm] = useState(defaultRecommendForm);
  const [recommendations, setRecommendations] = useState<RecommendationMatch[]>([]);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState<"recommend" | "compare" | "enrich" | null>(null);
  const [activeMobileSheet, setActiveMobileSheet] = useState<"filters" | "matchmaker" | null>(null);
  const [isPending, startViewTransition] = useTransition();

  const deferredSearch = useDeferredValue(filters.search);
  const debouncedSearch = useDebouncedValue(deferredSearch, 260);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (filters.brand) params.set("brand", filters.brand);
    if (filters.segment) params.set("segment", filters.segment);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.minBattery) params.set("minBattery", filters.minBattery);
    if (filters.minRam) params.set("minRam", filters.minRam);
    params.set("take", "100");

    let ignore = false;

    void fetch(`/api/phones?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        if (ignore) {
          return;
        }

        startViewTransition(() => {
          setPhones(data.phones);
          setBrands(data.brands);
          setSelectedIds((current) =>
            current.filter((id) => data.phones.some((phone: DashboardPhone) => phone.id === id))
          );
        });
      })
      .catch(() => {
        if (!ignore) {
          setStatus("Could not reload the phone list right now.");
        }
      });

    return () => {
      ignore = true;
    };
  }, [debouncedSearch, filters.brand, filters.segment, filters.maxPrice, filters.sort, filters.minBattery, filters.minRam]);

  async function handleRecommend() {
    setBusy("recommend");
    setStatus(null);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...recommendForm,
          brands: filters.brand ? [filters.brand] : [],
          budget: recommendForm.budget || undefined,
          minBudget: recommendForm.minBudget || undefined,
          minBattery: recommendForm.minBattery || undefined,
          minRam: recommendForm.minRam || undefined
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Recommendation request failed.");
      }

      startTransition(() => {
        setRecommendations(data.matches);
        setStatus(`Found ${data.matches.length} matches.`);
      });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not find matches right now.");
    } finally {
      setBusy(null);
    }
  }

  async function handleCompare() {
    if (selectedIds.length < 2) {
      setStatus("Pick at least two phones to compare.");
      return;
    }

    setBusy("compare");
    setStatus(null);

    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ids: selectedIds })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Comparison failed.");
      }

      startTransition(() => {
        setComparison(data);
        setStatus(`Comparing ${data.phones.length} phones.`);
      });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not open compare view right now.");
    } finally {
      setBusy(null);
    }
  }

  async function handleEnrich() {
    setBusy("enrich");
    setStatus(null);

    try {
      const response = await fetch("/api/enrich", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phoneIds: selectedIds.length ? selectedIds : undefined,
          runNow: true,
          limit: selectedIds.length || 4
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Enrichment request failed.");
      }

      setStatus(`Updated ${data.processed.length} phones.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not refresh saved specs right now.");
    } finally {
      setBusy(null);
    }
  }

  function toggleSelection(id: string) {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter((value) => value !== id);
      }

      if (current.length >= 4) {
        return [...current.slice(1), id];
      }

      return [...current, id];
    });
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar desktop-sidebar">
        <div className="glass-panel sidebar-card sidebar-scroll">
          <span className="section-label">Filters</span>
          <DashboardFilters filters={filters} setFilters={setFilters} brands={brands} />
        </div>

        <div className="glass-panel sidebar-card sidebar-scroll">
          <span className="section-label">Quick Match</span>
          <DashboardMatchmaker
            recommendForm={recommendForm}
            setRecommendForm={setRecommendForm}
            busy={busy}
            onRecommend={handleRecommend}
            onEnrich={handleEnrich}
            onCompare={handleCompare}
          />
        </div>
      </aside>

      <section className="results-stack">
        <div className="dashboard-topbar">
          <div className="stack" style={{ gap: 10 }}>
            <span className="section-label">Dashboard</span>
            <h1 className="dashboard-title">Filter {stats.catalogSize} phones, compare a few, and open full specs.</h1>
            <p className="muted dashboard-copy">
              Use the left side to narrow the list. Save a few phones for compare when something looks close.
            </p>
          </div>
        </div>

        <div className="dashboard-mobile-actions">
          <button type="button" className="button-secondary" onClick={() => setActiveMobileSheet("filters")}>
            <Filter size={16} />
            <span style={{ marginLeft: 8 }}>Filters</span>
          </button>
          <button type="button" className="button" onClick={() => setActiveMobileSheet("matchmaker")}>
            <SlidersHorizontal size={16} />
            <span style={{ marginLeft: 8 }}>Matchmaker</span>
          </button>
        </div>

        {status ? (
          <div className="glass-panel card status-card">
            <strong>Status</strong>
            <p className="muted" style={{ marginBottom: 0 }}>{status}</p>
          </div>
        ) : null}

        {recommendations.length ? (
          <div className="glass-panel card">
            <span className="section-label">Top Matches</span>
            <div className="recommendation-grid" style={{ marginTop: 20 }}>
              {recommendations.map((match) => (
                <div key={match.phone.id} className="metric recommendation-card">
                  <span>{getPhoneDisplayName(match.phone.brand, match.phone.model)}</span>
                  <strong>{formatScore(match.personalizedScore)}</strong>
                  <p className="muted" style={{ marginBottom: 8 }}>
                    {formatPhp(match.phone.price)}
                  </p>
                  <p className="muted" style={{ marginBottom: 0 }}>
                    {match.reasons.join(" ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {comparison ? (
          <div className="glass-panel card">
            <span className="section-label">Compare View</span>
            <div className="comparison-grid" style={{ marginTop: 20 }}>
              <div className="stack">
                {comparison.leaders.map((leader) => (
                  <div key={leader.metric} className="metric">
                    <span>{leader.metric}</span>
                    <strong>{leader.model ?? "N/A"}</strong>
                    <p className="muted" style={{ marginBottom: 0 }}>
                      {leader.score !== null ? formatScore(Number(leader.score)) : "N/A"}
                    </p>
                  </div>
                ))}
              </div>
              <div className="stack">
                {comparison.phones.map((phone) => (
                  <div key={phone.id} className="metric">
                    <span>{getPhoneDisplayName(phone.brand, phone.model)}</span>
                    <strong>{formatPhp(phone.price)}</strong>
                    <p className="muted" style={{ marginBottom: 0 }}>
                      Final {formatScore(phone.finalScore)} | Camera {formatScore(phone.cameraScore)} | Battery {formatScore(phone.batteryScore)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <div className="phone-grid dashboard-grid">
          {phones.length ? (
            phones.map((phone) => (
              <DeviceCard
                key={phone.id}
                phone={phone}
                selected={selectedIds.includes(phone.id)}
                onToggleSelect={toggleSelection}
              />
            ))
          ) : (
            <div className="glass-panel empty-state">No phones match the current filters.</div>
          )}
        </div>

        {(isPending || busy) && (
          <div className="glass-panel card">
            <p className="muted" style={{ margin: 0 }}>
              Updating the list...
            </p>
          </div>
        )}
      </section>

      {activeMobileSheet === "filters" ? (
        <MobileSheet title="Filters" onClose={() => setActiveMobileSheet(null)}>
          <DashboardFilters filters={filters} setFilters={setFilters} brands={brands} />
        </MobileSheet>
      ) : null}

      {activeMobileSheet === "matchmaker" ? (
        <MobileSheet title="Quick Match" onClose={() => setActiveMobileSheet(null)}>
          <DashboardMatchmaker
            recommendForm={recommendForm}
            setRecommendForm={setRecommendForm}
            busy={busy}
            onRecommend={handleRecommend}
            onEnrich={handleEnrich}
            onCompare={handleCompare}
          />
        </MobileSheet>
      ) : null}
    </div>
  );
}
