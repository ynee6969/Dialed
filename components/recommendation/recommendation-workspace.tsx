"use client";

import Link from "next/link";
import { LoaderCircle, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { FavoriteButton } from "@/components/phones/favorite-button";
import { DEFAULT_WEIGHTS, USE_CASE_PRESETS } from "@/lib/recommendation/criteria";
import type { Criterion, CriterionWeight, RecommendationResult } from "@/lib/recommendation/types";
import { formatPhp } from "@/lib/utils/format";
import { getPhoneDisplayName } from "@/lib/utils/phone-presentation";
import styles from "./RecommendationWorkspace.module.css";

type Result = RecommendationResult<{
  id: string; slug: string; brand: string; model: string; price: number; ram: number | null; battery: number | null;
}>;

const criteria: Array<{ key: Criterion; label: string }> = [
  { key: "performance", label: "Performance" },
  { key: "camera", label: "Camera" },
  { key: "battery", label: "Battery" },
  { key: "value", label: "Price / value" }
];

const initialWeights = Object.fromEntries(
  Object.entries(DEFAULT_WEIGHTS).map(([key, value]) => [key, String(value * 100)])
) as Record<Criterion, string>;

export function RecommendationWorkspace({ brands }: { brands: string[] }) {
  const [budget, setBudget] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [brand, setBrand] = useState("");
  const [osPreference, setOsPreference] = useState<"any" | "android" | "ios">("any");
  const [minRam, setMinRam] = useState("");
  const [minBattery, setMinBattery] = useState("");
  const [preset, setPreset] = useState("balanced");
  const [weightInputs, setWeightInputs] = useState(initialWeights);
  const [sensitivity, setSensitivity] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const total = criteria.reduce((sum, item) => sum + (Number(weightInputs[item.key]) || 0), 0);
  const totalValid = Math.abs(total - 100) < 0.000001;

  function selectPreset(nextPreset: string) {
    setPreset(nextPreset);
    const weights = USE_CASE_PRESETS[nextPreset];
    setWeightInputs(Object.fromEntries(Object.entries(weights).map(([key, value]) => [key, String(value * 100)])) as Record<Criterion, string>);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!totalValid || criteria.some((item) => !Number.isFinite(Number(weightInputs[item.key])) || Number(weightInputs[item.key]) < 0)) {
      setError("Set non-negative priorities that total exactly 100%.");
      return;
    }
    const numberOrUndefined = (value: string) => value.trim() ? Number(value) : undefined;
    const min = numberOrUndefined(minBudget);
    const max = numberOrUndefined(budget);
    if ([min, max, numberOrUndefined(minRam), numberOrUndefined(minBattery)].some((value) => value !== undefined && (!Number.isFinite(value) || value <= 0)) || (min && max && min > max)) {
      setError("Enter valid positive requirements. Minimum budget cannot exceed maximum budget.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          budget: max, minBudget: min, brands: brand ? [brand] : [], osPreference,
          minRam: numberOrUndefined(minRam), minBattery: numberOrUndefined(minBattery),
          weights: Object.fromEntries(criteria.map((item) => [item.key, Number(weightInputs[item.key]) / 100])),
          limit: 5, includeSensitivity: sensitivity
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not create recommendations.");
      setResult(data as Result);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not create recommendations.");
    } finally { setLoading(false); }
  }

  return <div className={styles.scope}>
    <header className="stack">
      <span className="section-label">Recommendation</span>
      <h1 className="section-title">Choose phones based on your requirements and priorities.</h1>
      <p className="section-copy">Requirements determine which phones are eligible. Your priorities then weight the normalized criterion scores used to rank that shortlist.</p>
    </header>

    <form className="glass-panel" onSubmit={submit}>
      <div className={styles.formHeader}><div><h2>1. Set requirements</h2><p className="muted">These filters determine eligibility before scoring.</p></div><span className="chip">Constraints</span></div>
      <div className={styles.fields}>
        <label className="field">Maximum budget (PHP)<input className="input" type="number" min="1" value={budget} onChange={(e) => setBudget(e.target.value)} /></label>
        <label className="field">Minimum budget (optional)<input className="input" type="number" min="1" value={minBudget} onChange={(e) => setMinBudget(e.target.value)} /></label>
        <label className="field">Brand<select className="select" value={brand} onChange={(e) => setBrand(e.target.value)}><option value="">Any brand</option>{brands.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="field">Operating system<select className="select" value={osPreference} onChange={(e) => setOsPreference(e.target.value as typeof osPreference)}><option value="any">Any OS</option><option value="android">Android</option><option value="ios">iOS</option></select></label>
        <label className="field">Minimum RAM (GB)<input className="input" type="number" min="1" value={minRam} onChange={(e) => setMinRam(e.target.value)} /></label>
        <label className="field">Minimum battery (mAh)<input className="input" type="number" min="1" value={minBattery} onChange={(e) => setMinBattery(e.target.value)} /></label>
      </div>
      <div className={styles.formHeader}><div><h2>2. Set priorities</h2><p className="muted">A preset fills the controls; you can adjust the submitted weights.</p></div><span className={`chip ${totalValid ? styles.valid : styles.invalid}`}>Total: {total.toFixed(0)}%</span></div>
      <div className={styles.presetRow}>{Object.keys(USE_CASE_PRESETS).map((item) => <button key={item} type="button" className={preset === item ? "button" : "button-secondary"} onClick={() => selectPreset(item)}>{item}</button>)}</div>
      <div className={styles.weights}>{criteria.map((item) => <label className="field" key={item.key}>{item.label}<div className={styles.weightInput}><input className="input" type="number" min="0" max="100" step="1" value={weightInputs[item.key]} onChange={(e) => { setPreset("custom"); setWeightInputs((current) => ({ ...current, [item.key]: e.target.value })); }} /><span>%</span></div></label>)}</div>
      <label className={styles.check}><input type="checkbox" checked={sensitivity} onChange={(e) => setSensitivity(e.target.checked)} /> Include sensitivity analysis <span className="muted">— checks whether the ranking changes when weights vary reasonably.</span></label>
      {error ? <p className={styles.error} role="alert">{error}</p> : null}
      <button className="button magnetic-button" disabled={loading || !totalValid}>{loading ? <><LoaderCircle className="spin" size={16} /> Ranking phones…</> : <><SlidersHorizontal size={16} /> Get recommendations</>}</button>
    </form>

    {result ? <section className={styles.results} aria-live="polite">
      <div className={styles.resultHeader}><div><span className="section-label">Ranked shortlist</span><h2>{result.eligibleCount} phone{result.eligibleCount === 1 ? "" : "s"} meet your requirements.</h2><p className="muted">{result.formula}. Scores and contributions below come directly from the recommendation service.</p></div><span className="chip">{result.preferences.source === "user" ? "Your weights" : "Preset weights"}</span></div>
      <div className={styles.constraints}>Applied constraints: {result.constraints.maxPrice ? `up to ${formatPhp(result.constraints.maxPrice)}` : "any budget"}{result.constraints.minPrice ? ` · from ${formatPhp(result.constraints.minPrice)}` : ""}{result.constraints.brands.length ? ` · ${result.constraints.brands.join(", ")}` : ""}{result.constraints.os !== "any" ? ` · ${result.constraints.os}` : ""}{result.constraints.minRam ? ` · ${result.constraints.minRam}GB RAM+` : ""}{result.constraints.minBattery ? ` · ${result.constraints.minBattery}mAh+` : ""}</div>
      {result.matches.length ? result.matches.map((match) => <article className={`glass-panel ${styles.match}`} key={match.phone.id}><div className={styles.matchTop}><div><span className="chip">Rank #{match.rank}</span><h3>{getPhoneDisplayName(match.phone.brand, match.phone.model)}</h3><p className="muted">{formatPhp(match.phone.price)}{match.phone.ram ? ` · ${match.phone.ram}GB RAM` : ""}{match.phone.battery ? ` · ${match.phone.battery}mAh` : ""}</p></div><div className={styles.overall}><span>Overall score</span><strong>{match.score.overall.toFixed(3)}</strong><small>{match.score.overallPercentage.toFixed(2)}%</small></div></div><p className="muted">Highest score under your selected preferences. {match.reasons[0]}</p><div className={styles.breakdown}>{criteria.map(({ key }) => { const item = match.score.criteria[key]; return <div key={key}><strong>{item.label}</strong><span>Normalized: {item.normalizedScore.toFixed(2)}</span><span>Weight: {(item.weight * 100).toFixed(0)}%</span><span>Contribution: {item.weightedContribution.toFixed(3)}</span></div>; })}</div><div className="button-row"><Link className="button-secondary" href={`/phones/${match.phone.slug}`}>View details</Link><Link className="button" href={`/compare?left=${match.phone.slug}`}>Compare</Link><FavoriteButton phoneId={match.phone.id} variant="full" /></div></article>) : <div className="glass-panel empty-state">No phones meet all of those requirements. Try relaxing one of the constraints.</div>}
      {result.sensitivity ? <article className={`glass-panel ${styles.sensitivity}`}><h3>Sensitivity analysis</h3><p className="muted">Each scenario changes one criterion by {(result.sensitivity.step * 100).toFixed(0)} percentage points and redistributes the remaining weight proportionally.</p><div>{result.sensitivity.scenarios.map((scenario) => <span className="chip" key={scenario.label}>{scenario.label}: {scenario.topRankChanged ? "top result changes" : "top result stable"}</span>)}</div></article> : null}
    </section> : null}
  </div>;
}
