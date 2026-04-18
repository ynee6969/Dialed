import { unstable_cache } from "next/cache";
import { type Phone } from "@prisma/client";

import { getCachedPhoneReferenceForPhone } from "@/lib/services/gsmarena-reference";
import { getPhoneBySlugWithPreviewSource, getPhonesByIds, listPhones } from "@/lib/services/phones";
import { serializePhoneCard, type PhoneCardRecord } from "@/lib/types/phone-card";
import type { PhoneReference } from "@/lib/types/phone-reference";
import { formatPhp, formatScore } from "@/lib/utils/format";
import { getPhoneDisplayName } from "@/lib/utils/phone-presentation";

const metrics = [
  { key: "performanceScore", label: "Performance" },
  { key: "cameraScore", label: "Camera" },
  { key: "batteryScore", label: "Battery" },
  { key: "valueScore", label: "Value" },
  { key: "finalScore", label: "Overall" }
] as const;

type ComparisonWinner = "left" | "right" | null;

interface ComparisonRowOptions {
  parser?: (value: string) => number | null;
  preference?: "higher" | "lower";
}

export interface ComparisonSummaryRow {
  label: string;
  leftValue: string;
  rightValue: string;
  leftWinner: boolean;
  rightWinner: boolean;
}

export interface ComparisonSectionRow extends ComparisonSummaryRow {
  isDifferent: boolean;
}

export interface ComparisonSection {
  title: string;
  rows: ComparisonSectionRow[];
}

export interface ComparisonDevice {
  phone: Phone;
  reference: PhoneReference;
  displayName: string;
}

export interface DetailedComparisonView {
  catalog: PhoneCardRecord[];
  selectedLeftSlug: string | null;
  selectedRightSlug: string | null;
  left: ComparisonDevice | null;
  right: ComparisonDevice | null;
  summaryRows: ComparisonSummaryRow[];
  sections: ComparisonSection[];
  highlights: {
    left: string[];
    right: string[];
  };
}

function readValue(reference: PhoneReference, sectionTitle: string, label: string) {
  const section = reference.sections.find(
    (entry) => entry.title.toLowerCase() === sectionTitle.toLowerCase()
  );
  const item = section?.items.find((entry) => entry.label.toLowerCase() === label.toLowerCase());
  return item?.value ?? null;
}

function firstValue(...values: Array<string | number | null | undefined>) {
  for (const value of values) {
    if (value !== null && value !== undefined) {
      const normalized = String(value).trim();
      if (normalized.length) {
        return normalized;
      }
    }
  }

  return null;
}

function normalizeComparisonValue(value: string | null | undefined) {
  return value?.trim() || "-";
}

function parseNumber(value: string) {
  const match = value.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

function parseResolution(value: string) {
  const match = value.match(/(\d+)\s*x\s*(\d+)/i);
  if (!match) {
    return parseNumber(value);
  }

  return Number(match[1]) * Number(match[2]);
}

function compareValues(
  leftValue: string,
  rightValue: string,
  parser: (value: string) => number | null,
  preference: "higher" | "lower"
): ComparisonWinner {
  const left = parser(leftValue);
  const right = parser(rightValue);

  if (left === null || right === null || left === right) {
    return null;
  }

  if (preference === "higher") {
    return left > right ? "left" : "right";
  }

  return left < right ? "left" : "right";
}

function createRow(
  label: string,
  leftValue: string | null | undefined,
  rightValue: string | null | undefined,
  options: ComparisonRowOptions = {}
): ComparisonSectionRow {
  const normalizedLeft = normalizeComparisonValue(leftValue);
  const normalizedRight = normalizeComparisonValue(rightValue);
  const winner =
    options.parser && options.preference
      ? compareValues(normalizedLeft, normalizedRight, options.parser, options.preference)
      : null;

  return {
    label,
    leftValue: normalizedLeft,
    rightValue: normalizedRight,
    leftWinner: winner === "left",
    rightWinner: winner === "right",
    isDifferent: normalizedLeft !== normalizedRight
  };
}

function buildDevice(phone: Phone, reference: PhoneReference): ComparisonDevice {
  return {
    phone,
    reference,
    displayName: getPhoneDisplayName(phone.brand, phone.model)
  };
}

function getMainCameraValue(device: ComparisonDevice) {
  return firstValue(
    device.reference.summary.cameraMain,
    readValue(device.reference, "Main Camera", "Single"),
    readValue(device.reference, "Main Camera", "Dual"),
    readValue(device.reference, "Main Camera", "Triple"),
    readValue(device.reference, "Main Camera", "Quad"),
    device.phone.cameraMain ? `${device.phone.cameraMain} MP` : null
  );
}

function getReleaseValue(device: ComparisonDevice) {
  return firstValue(
    device.phone.releaseDate?.toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }),
    device.phone.releaseYear ? String(device.phone.releaseYear) : null,
    readValue(device.reference, "Launch", "Announced"),
    readValue(device.reference, "Launch", "Status")
  );
}

function buildSummaryRows(left: ComparisonDevice, right: ComparisonDevice): ComparisonSummaryRow[] {
  return [
    createRow("Overall score", formatScore(left.phone.finalScore), formatScore(right.phone.finalScore), {
      parser: parseNumber,
      preference: "higher"
    }),
    createRow("Performance", formatScore(left.phone.performanceScore), formatScore(right.phone.performanceScore), {
      parser: parseNumber,
      preference: "higher"
    }),
    createRow("Camera", formatScore(left.phone.cameraScore), formatScore(right.phone.cameraScore), {
      parser: parseNumber,
      preference: "higher"
    }),
    createRow("Battery", formatScore(left.phone.batteryScore), formatScore(right.phone.batteryScore), {
      parser: parseNumber,
      preference: "higher"
    }),
    createRow("Price", formatPhp(left.phone.price), formatPhp(right.phone.price), {
      parser: parseNumber,
      preference: "lower"
    })
  ];
}

function buildSections(left: ComparisonDevice, right: ComparisonDevice): ComparisonSection[] {
  return [
    {
      title: "Display",
      rows: [
        createRow("Size", left.reference.summary.displaySize, right.reference.summary.displaySize, {
          parser: parseNumber,
          preference: "higher"
        }),
        createRow("Resolution", left.reference.summary.resolution, right.reference.summary.resolution, {
          parser: parseResolution,
          preference: "higher"
        }),
        createRow(
          "Type",
          readValue(left.reference, "Display", "Type"),
          readValue(right.reference, "Display", "Type")
        )
      ]
    },
    {
      title: "Chipset",
      rows: [
        createRow(
          "Chipset",
          firstValue(left.reference.summary.chipset, left.phone.chipset),
          firstValue(right.reference.summary.chipset, right.phone.chipset)
        ),
        createRow(
          "Process",
          readValue(left.reference, "Platform", "Chipset"),
          readValue(right.reference, "Platform", "Chipset"),
          {
            parser: (value) => {
              const match = value.match(/(\d+)\s*nm/i);
              return match ? Number(match[1]) : null;
            },
            preference: "lower"
          }
        )
      ]
    },
    {
      title: "CPU / GPU",
      rows: [
        createRow(
          "CPU",
          readValue(left.reference, "Platform", "CPU"),
          readValue(right.reference, "Platform", "CPU")
        ),
        createRow(
          "GPU",
          firstValue(readValue(left.reference, "Platform", "GPU"), left.phone.gpu),
          firstValue(readValue(right.reference, "Platform", "GPU"), right.phone.gpu)
        ),
        createRow(
          "Performance score",
          formatScore(left.phone.performanceScore),
          formatScore(right.phone.performanceScore),
          {
            parser: parseNumber,
            preference: "higher"
          }
        )
      ]
    },
    {
      title: "Camera",
      rows: [
        createRow("Main camera", getMainCameraValue(left), getMainCameraValue(right), {
          parser: parseNumber,
          preference: "higher"
        }),
        createRow(
          "Selfie camera",
          readValue(left.reference, "Selfie camera", "Single"),
          readValue(right.reference, "Selfie camera", "Single"),
          {
            parser: parseNumber,
            preference: "higher"
          }
        ),
        createRow(
          "Video",
          readValue(left.reference, "Main Camera", "Video"),
          readValue(right.reference, "Main Camera", "Video")
        ),
        createRow("Camera score", formatScore(left.phone.cameraScore), formatScore(right.phone.cameraScore), {
          parser: parseNumber,
          preference: "higher"
        })
      ]
    },
    {
      title: "Battery",
      rows: [
        createRow(
          "Capacity",
          firstValue(
            left.reference.summary.battery,
            left.phone.battery ? `${left.phone.battery} mAh` : null
          ),
          firstValue(
            right.reference.summary.battery,
            right.phone.battery ? `${right.phone.battery} mAh` : null
          ),
          {
            parser: parseNumber,
            preference: "higher"
          }
        ),
        createRow("Endurance score", formatScore(left.phone.batteryScore), formatScore(right.phone.batteryScore), {
          parser: parseNumber,
          preference: "higher"
        }),
        createRow(
          "Type",
          readValue(left.reference, "Battery", "Type"),
          readValue(right.reference, "Battery", "Type")
        )
      ]
    },
    {
      title: "Charging",
      rows: [
        createRow(
          "Charging",
          firstValue(
            left.reference.summary.charging,
            left.phone.charging ? `${left.phone.charging} W` : null
          ),
          firstValue(
            right.reference.summary.charging,
            right.phone.charging ? `${right.phone.charging} W` : null
          ),
          {
            parser: parseNumber,
            preference: "higher"
          }
        ),
        createRow(
          "USB",
          readValue(left.reference, "Comms", "USB"),
          readValue(right.reference, "Comms", "USB")
        )
      ]
    },
    {
      title: "Build",
      rows: [
        createRow(
          "Dimensions",
          readValue(left.reference, "Body", "Dimensions"),
          readValue(right.reference, "Body", "Dimensions")
        ),
        createRow("Weight", readValue(left.reference, "Body", "Weight"), readValue(right.reference, "Body", "Weight"), {
          parser: parseNumber,
          preference: "lower"
        }),
        createRow(
          "Materials",
          readValue(left.reference, "Body", "Build"),
          readValue(right.reference, "Body", "Build")
        ),
        createRow(
          "Protection",
          readValue(left.reference, "Display", "Protection"),
          readValue(right.reference, "Display", "Protection")
        )
      ]
    },
    {
      title: "Network",
      rows: [
        createRow(
          "Technology",
          readValue(left.reference, "Network", "Technology"),
          readValue(right.reference, "Network", "Technology")
        ),
        createRow(
          "SIM",
          readValue(left.reference, "Body", "SIM"),
          readValue(right.reference, "Body", "SIM")
        ),
        createRow(
          "WLAN",
          readValue(left.reference, "Comms", "WLAN"),
          readValue(right.reference, "Comms", "WLAN")
        ),
        createRow(
          "Bluetooth",
          readValue(left.reference, "Comms", "Bluetooth"),
          readValue(right.reference, "Comms", "Bluetooth")
        )
      ]
    },
    {
      title: "Price",
      rows: [
        createRow("Price", formatPhp(left.phone.price), formatPhp(right.phone.price), {
          parser: parseNumber,
          preference: "lower"
        }),
        createRow("Release", getReleaseValue(left), getReleaseValue(right)),
        createRow("Memory", left.reference.summary.memory, right.reference.summary.memory)
      ]
    }
  ].map((section) => ({
    ...section,
    rows: section.rows.filter((row) => row.leftValue !== "-" || row.rightValue !== "-")
  }));
}

function buildHighlights(
  left: ComparisonDevice,
  right: ComparisonDevice,
  summaryRows: ComparisonSummaryRow[]
) {
  const highlights = {
    left: [] as string[],
    right: [] as string[]
  };

  const labelText: Record<string, { left: string; right: string }> = {
    "Overall score": {
      left: `${left.displayName} carries the stronger overall score.`,
      right: `${right.displayName} carries the stronger overall score.`
    },
    Performance: {
      left: `${left.displayName} leads on raw performance.`,
      right: `${right.displayName} leads on raw performance.`
    },
    Camera: {
      left: `${left.displayName} offers the stronger camera score.`,
      right: `${right.displayName} offers the stronger camera score.`
    },
    Battery: {
      left: `${left.displayName} posts the better battery score.`,
      right: `${right.displayName} posts the better battery score.`
    },
    Price: {
      left: `${left.displayName} comes in at a lower listed price.`,
      right: `${right.displayName} comes in at a lower listed price.`
    }
  };

  for (const row of summaryRows) {
    const labels = labelText[row.label];
    if (!labels) {
      continue;
    }

    if (row.leftWinner) {
      highlights.left.push(labels.left);
    }

    if (row.rightWinner) {
      highlights.right.push(labels.right);
    }
  }

  if (!highlights.left.length) {
    highlights.left.push(`${left.displayName} stays competitive without giving away a major category.`);
  }

  if (!highlights.right.length) {
    highlights.right.push(
      `${right.displayName} stays competitive without giving away a major category.`
    );
  }

  return {
    left: highlights.left.slice(0, 3),
    right: highlights.right.slice(0, 3)
  };
}

function resolveSelection(catalog: PhoneCardRecord[], requestedLeft?: string, requestedRight?: string) {
  const leftSlug = catalog.some((phone) => phone.slug === requestedLeft)
    ? requestedLeft ?? null
    : catalog[0]?.slug ?? null;
  const rightSlug = catalog.some((phone) => phone.slug === requestedRight && phone.slug !== leftSlug)
    ? requestedRight ?? null
    : catalog.find((phone) => phone.slug !== leftSlug)?.slug ?? null;

  return {
    leftSlug,
    rightSlug
  };
}

async function getDevice(slug: string | null) {
  if (!slug) {
    return null;
  }

  const phone = await getPhoneBySlugWithPreviewSource(slug);
  if (!phone) {
    return null;
  }

  const reference = getCachedPhoneReferenceForPhone(phone);
  return buildDevice(phone, reference);
}

export async function comparePhones(ids: string[]) {
  const phones = await getPhonesByIds(ids);
  const leaders = metrics.map((metric) => {
    const sorted = [...phones].sort((a, b) => Number(b[metric.key] ?? 0) - Number(a[metric.key] ?? 0));

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

const buildDetailedComparisonCached = unstable_cache(
  async (leftSlug?: string, rightSlug?: string): Promise<DetailedComparisonView> => {
    const catalogResult = await listPhones({ take: 120, sort: "top" });
    const catalog = catalogResult.phones.map(serializePhoneCard);
    const selection = resolveSelection(catalog, leftSlug, rightSlug);

    const [left, right] = await Promise.all([
      getDevice(selection.leftSlug),
      getDevice(selection.rightSlug)
    ]);

    if (!left || !right) {
      return {
        catalog,
        selectedLeftSlug: selection.leftSlug,
        selectedRightSlug: selection.rightSlug,
        left: null,
        right: null,
        summaryRows: [],
        sections: [],
        highlights: {
          left: [],
          right: []
        }
      };
    }

    const summaryRows = buildSummaryRows(left, right);
    const sections = buildSections(left, right);
    const highlights = buildHighlights(left, right, summaryRows);

    return {
      catalog,
      selectedLeftSlug: selection.leftSlug,
      selectedRightSlug: selection.rightSlug,
      left,
      right,
      summaryRows,
      sections,
      highlights
    };
  },
  ["detailed-comparison"],
  {
    revalidate: 300
  }
);

export async function buildDetailedComparison(leftSlug?: string, rightSlug?: string) {
  return buildDetailedComparisonCached(leftSlug, rightSlug);
}
