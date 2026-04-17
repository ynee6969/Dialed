import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { hasConfiguredAuthSecret } from "@/lib/auth/config";

export async function getAuthenticatedUser() {
  if (!hasConfiguredAuthSecret()) {
    return null;
  }

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user?.id || !user.email) {
    return null;
  }

  return user;
}

export function unauthorizedResponse(message = "Sign in to continue.") {
  return NextResponse.json({ error: message }, { status: 401 });
}
