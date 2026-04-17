import { NextResponse } from "next/server";

import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/auth/session";
import { removeFavorite } from "@/lib/services/favorites";
import { hasDatabaseUrl } from "@/lib/services/runtime-safety";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ phoneId: string }> }
) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { error: "Favorites are unavailable until the database is configured." },
      { status: 503 }
    );
  }

  const user = await getAuthenticatedUser();
  if (!user) {
    return unauthorizedResponse("Sign in to manage favorites.");
  }

  const { phoneId } = await params;
  await removeFavorite(user.id, phoneId);

  return NextResponse.json({ ok: true });
}
