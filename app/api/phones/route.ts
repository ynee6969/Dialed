import { NextRequest, NextResponse } from "next/server";

import { ensureApplicationBootstrapped } from "@/lib/services/bootstrap";
import { listPhones } from "@/lib/services/phones";
import { getErrorMessage } from "@/lib/services/runtime-safety";

function parseNumber(value: string | null) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function GET(request: NextRequest) {
  try {
    await ensureApplicationBootstrapped();

    const searchParams = request.nextUrl.searchParams;
    const result = await listPhones({
      search: searchParams.get("search") ?? undefined,
      segment: searchParams.get("segment") ?? undefined,
      brand: searchParams.get("brand") ?? undefined,
      minPrice: parseNumber(searchParams.get("minPrice")),
      maxPrice: parseNumber(searchParams.get("maxPrice")),
      minRam: parseNumber(searchParams.get("minRam")),
      minBattery: parseNumber(searchParams.get("minBattery")),
      sort: (searchParams.get("sort") as
        | "top"
        | "price_asc"
        | "price_desc"
        | "camera"
        | "battery"
        | "performance"
        | null) ?? undefined,
      take: parseNumber(searchParams.get("take")),
      skip: parseNumber(searchParams.get("skip"))
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        phones: [],
        total: 0,
        brands: [],
        error: getErrorMessage(error, "Could not load phones.")
      },
      { status: 200 }
    );
  }
}
