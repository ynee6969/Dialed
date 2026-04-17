import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/auth/session";
import { addFavorite, getFavoritePhoneIdsByUserId, listFavoritesByUserId } from "@/lib/services/favorites";
import {
  favoritesServiceUnavailableMessage,
  hasDatabaseUrl,
  isPrismaRuntimeError,
  logServerFailure
} from "@/lib/services/runtime-safety";
import { serializePhoneCard } from "@/lib/types/phone-card";

const favoriteSchema = z.object({
  phoneId: z.string().min(1)
});

export async function GET() {
  if (!hasDatabaseUrl()) {
    return NextResponse.json({ error: favoritesServiceUnavailableMessage }, { status: 503 });
  }

  const user = await getAuthenticatedUser();
  if (!user) {
    return unauthorizedResponse("Sign in to view your favorites.");
  }

  try {
    const favorites = await listFavoritesByUserId(user.id);
    const favoritePhoneIds = await getFavoritePhoneIdsByUserId(user.id);

    return NextResponse.json({
      favoritePhoneIds,
      favorites: favorites.map((favorite) => ({
        id: favorite.id,
        phoneId: favorite.phoneId,
        createdAt: favorite.createdAt,
        phone: serializePhoneCard(favorite.phone)
      }))
    });
  } catch (error) {
    if (isPrismaRuntimeError(error)) {
      logServerFailure("favorites.list", error);
      return NextResponse.json({ error: favoritesServiceUnavailableMessage }, { status: 503 });
    }

    throw error;
  }
}

export async function POST(request: Request) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json({ error: favoritesServiceUnavailableMessage }, { status: 503 });
  }

  const user = await getAuthenticatedUser();
  if (!user) {
    return unauthorizedResponse("Sign in to save phones.");
  }

  try {
    const body = favoriteSchema.parse(await request.json());
    const phone = await prisma.phone.findUnique({
      where: { id: body.phoneId },
      select: { id: true }
    });

    if (!phone) {
      return NextResponse.json({ error: "Phone not found." }, { status: 404 });
    }

    const favorite = await addFavorite(user.id, body.phoneId);

    return NextResponse.json({
      favorite: {
        id: favorite.id,
        phoneId: favorite.phoneId,
        createdAt: favorite.createdAt,
        phone: serializePhoneCard(favorite.phone)
      }
    });
  } catch (error) {
    if (isPrismaRuntimeError(error)) {
      logServerFailure("favorites.add", error);
      return NextResponse.json({ error: favoritesServiceUnavailableMessage }, { status: 503 });
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Could not save this phone." }, { status: 400 });
  }
}
