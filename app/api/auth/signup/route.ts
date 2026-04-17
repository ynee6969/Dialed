import { NextResponse } from "next/server";

import { authConfigurationMessage, hasConfiguredAuthSecret } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { signupSchema } from "@/lib/auth/validation";
import {
  authServiceUnavailableMessage,
  hasDatabaseUrl,
  isPrismaRuntimeError,
  logServerFailure
} from "@/lib/services/runtime-safety";

export async function POST(request: Request) {
  if (!hasConfiguredAuthSecret()) {
    return NextResponse.json({ error: authConfigurationMessage }, { status: 503 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ error: authServiceUnavailableMessage }, { status: 503 });
  }

  try {
    const body = signupSchema.parse(await request.json());
    const email = body.email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        name: body.name.trim(),
        email,
        password: await hashPassword(body.password)
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (isPrismaRuntimeError(error)) {
      logServerFailure("auth.signup", error);
      return NextResponse.json({ error: authServiceUnavailableMessage }, { status: 503 });
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Sign up failed." }, { status: 400 });
  }
}
