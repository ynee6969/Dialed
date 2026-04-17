export function formatPhp(price: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0
  }).format(price);
}

export function formatScore(score: number | null | undefined, digits = 1) {
  if (score === null || score === undefined || Number.isNaN(score)) {
    return "N/A";
  }

  return score.toFixed(digits);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
