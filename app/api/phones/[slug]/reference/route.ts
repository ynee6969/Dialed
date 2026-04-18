import { NextResponse } from "next/server";

import { getCachedPhoneReferenceBySlug } from "@/lib/services/gsmarena-reference";
import { getErrorMessage } from "@/lib/services/runtime-safety";

export async function GET(
  _request: Request,
  context: {
    params: Promise<{ slug: string }>;
  }
  ) {
  try {
    const { slug } = await context.params;
    const reference = await getCachedPhoneReferenceBySlug(slug);

    if (!reference) {
      return NextResponse.json({ error: "Phone not found." }, { status: 404 });
    }

    return NextResponse.json(reference, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=1800"
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error, "Reference lookup failed.") },
      { status: 503 }
    );
  }
}
