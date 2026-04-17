import type { Session } from "next-auth";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { hasConfiguredAuthSecret } from "@/lib/auth/config";
import { isPrismaRuntimeError, logServerFailure } from "@/lib/services/runtime-safety";

export async function getOptionalSession(): Promise<Session | null> {
  if (!hasConfiguredAuthSecret()) {
    return null;
  }

  try {
    return await getServerSession(authOptions);
  } catch (error) {
    if (isPrismaRuntimeError(error)) {
      logServerFailure("auth.session", error);
      return null;
    }

    throw error;
  }
}

export async function getAuthenticatedUser() {
  const session = await getOptionalSession();
  const user = session?.user;

  if (!user?.id || !user.email) {
    return null;
  }

  return user;
}

export function unauthorizedResponse(message = "Sign in to continue.") {
  return NextResponse.json({ error: message }, { status: 401 });
}
