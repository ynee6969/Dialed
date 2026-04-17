import { NextResponse } from "next/server";

import { ensureApplicationBootstrapped } from "@/lib/services/bootstrap";
import { getErrorMessage } from "@/lib/services/runtime-safety";

export async function POST() {
  try {
    const result = await ensureApplicationBootstrapped();

    return NextResponse.json({
      ok: true,
      ...result
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      seeded: 0,
      queued: 0,
      skipped: true,
      reason: getErrorMessage(error, "Bootstrap failed.")
    });
  }
}
