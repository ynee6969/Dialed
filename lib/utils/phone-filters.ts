interface RangeOption<Value extends string> {
  value: Value;
  label: string;
  min?: number;
  max?: number;
}

export const priceRangeOptions = [
  { value: "under_15000", label: "Under PHP 15,000", max: 14_999 },
  { value: "15000_30000", label: "PHP 15,000 - 30,000", min: 15_000, max: 30_000 },
  { value: "30001_50000", label: "PHP 30,001 - 50,000", min: 30_001, max: 50_000 },
  { value: "50001_plus", label: "PHP 50,001+", min: 50_001 }
] as const satisfies readonly RangeOption<string>[];

export const performanceTierOptions = [
  { value: "everyday", label: "Everyday", max: 64.99 },
  { value: "power", label: "Power", min: 65, max: 79.99 },
  { value: "gaming", label: "Gaming", min: 80, max: 89.99 },
  { value: "elite", label: "Elite", min: 90 }
] as const satisfies readonly RangeOption<string>[];

export const cameraQualityOptions = [
  { value: "social", label: "Social-ready", max: 64.99 },
  { value: "creator", label: "Creator", min: 65, max: 79.99 },
  { value: "pro", label: "Pro", min: 80, max: 89.99 },
  { value: "flagship", label: "Flagship", min: 90 }
] as const satisfies readonly RangeOption<string>[];

export const batteryCapacityOptions = [
  { value: "4500", label: "4,500+ mAh", min: 4_500 },
  { value: "5000", label: "5,000+ mAh", min: 5_000 },
  { value: "6000", label: "6,000+ mAh", min: 6_000 }
] as const satisfies readonly RangeOption<string>[];

export type PriceRangeFilter = (typeof priceRangeOptions)[number]["value"];
export type PerformanceTierFilter = (typeof performanceTierOptions)[number]["value"];
export type CameraQualityFilter = (typeof cameraQualityOptions)[number]["value"];
export type BatteryCapacityFilter = (typeof batteryCapacityOptions)[number]["value"];

type FilterRange = {
  min?: number;
  max?: number;
};

function resolveOption<Value extends string>(
  options: readonly RangeOption<Value>[],
  value?: Value
) {
  return value ? options.find((option) => option.value === value) : undefined;
}

export function resolvePriceRange(value?: PriceRangeFilter): FilterRange | undefined {
  return resolveOption(priceRangeOptions, value);
}

export function resolvePerformanceTier(value?: PerformanceTierFilter): FilterRange | undefined {
  return resolveOption(performanceTierOptions, value);
}

export function resolveCameraQuality(value?: CameraQualityFilter): FilterRange | undefined {
  return resolveOption(cameraQualityOptions, value);
}

export function resolveBatteryCapacity(value?: BatteryCapacityFilter): FilterRange | undefined {
  return resolveOption(batteryCapacityOptions, value);
}

export function matchesRange(value: number | null | undefined, range?: FilterRange) {
  if (!range) {
    return true;
  }

  if (value === null || value === undefined) {
    return false;
  }

  if (range.min !== undefined && value < range.min) {
    return false;
  }

  if (range.max !== undefined && value > range.max) {
    return false;
  }

  return true;
}
