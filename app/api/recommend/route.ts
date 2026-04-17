import { NextRequest, NextResponse } from "next/server";

import { RateLimitError, enforceRateLimit } from "@/lib/services/rate-limit";
import { ensureApplicationBootstrapped } from "@/lib/services/bootstrap";
import { recommendPhones } from "@/lib/services/recommendations";

export async function POST(request: NextRequest) {
  try {
    await ensureApplicationBootstrapped();
    enforceRateLimit(
      `recommend:${request.headers.get("x-forwarded-for") ?? "local"}`,
      30,
      60_000
    );

    const body = await request.json();
    const result = await recommendPhones(body);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Recommendation failed." },
      { status: 400 }
    );
  }
}
