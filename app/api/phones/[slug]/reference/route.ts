import { NextResponse } from "next/server";

import { getPhoneReferenceBySlug } from "@/lib/services/gsmarena-reference";
import { getErrorMessage } from "@/lib/services/runtime-safety";

export async function GET(
  _request: Request,
  context: {
    params: Promise<{ slug: string }>;
  }
) {
  try {
    const { slug } = await context.params;
    const reference = await getPhoneReferenceBySlug(slug);

    if (!reference) {
      return NextResponse.json({ error: "Phone not found." }, { status: 404 });
    }

    return NextResponse.json(reference);
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error, "Reference lookup failed.") },
      { status: 503 }
    );
  }
}
