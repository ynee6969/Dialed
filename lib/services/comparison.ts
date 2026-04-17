import { getPhonesByIds } from "@/lib/services/phones";
import { getPhoneDisplayName } from "@/lib/utils/phone-presentation";

const metrics = [
  { key: "performanceScore", label: "Performance" },
  { key: "cameraScore", label: "Camera" },
  { key: "batteryScore", label: "Battery" },
  { key: "valueScore", label: "Value" },
  { key: "finalScore", label: "Overall" }
] as const;

export async function comparePhones(ids: string[]) {
  const phones = await getPhonesByIds(ids);
  const leaders = metrics.map((metric) => {
    const sorted = [...phones].sort(
      (a, b) => Number(b[metric.key] ?? 0) - Number(a[metric.key] ?? 0)
    );

    return {
      metric: metric.label,
      phoneId: sorted[0]?.id ?? null,
      model: sorted[0] ? getPhoneDisplayName(sorted[0].brand, sorted[0].model) : null,
      score: sorted[0]?.[metric.key] ?? null
    };
  });

  return {
    phones,
    leaders
  };
}
