import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { comparePhones } from "@/lib/services/comparison";

const compareSchema = z.object({
  ids: z.array(z.string()).min(2).max(4)
});

export async function POST(request: NextRequest) {
  try {
    const body = compareSchema.parse(await request.json());
    const result = await comparePhones(body.ids);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Comparison failed." },
      { status: 400 }
    );
  }
}
