import { NextResponse } from "next/server";

import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/auth/session";
import { removeFavorite } from "@/lib/services/favorites";
import {
  favoritesServiceUnavailableMessage,
  hasDatabaseUrl,
  isPrismaRuntimeError,
  logServerFailure
} from "@/lib/services/runtime-safety";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ phoneId: string }> }
) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json({ error: favoritesServiceUnavailableMessage }, { status: 503 });
  }

  const user = await getAuthenticatedUser();
  if (!user) {
    return unauthorizedResponse("Sign in to manage favorites.");
  }

  const { phoneId } = await params;
  try {
    await removeFavorite(user.id, phoneId);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isPrismaRuntimeError(error)) {
      logServerFailure("favorites.remove", error);
      return NextResponse.json({ error: favoritesServiceUnavailableMessage }, { status: 503 });
    }

    throw error;
  }
}
