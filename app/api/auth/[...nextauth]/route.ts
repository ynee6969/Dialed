import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/auth";
import { authConfigurationMessage, hasConfiguredAuthSecret } from "@/lib/auth/config";

const handler = NextAuth(authOptions);

export async function GET(request: Request, context: { params: Promise<{ nextauth: string[] }> }) {
  if (!hasConfiguredAuthSecret()) {
    return NextResponse.json({ error: authConfigurationMessage }, { status: 503 });
  }

  return handler(request, context);
}

export async function POST(request: Request, context: { params: Promise<{ nextauth: string[] }> }) {
  if (!hasConfiguredAuthSecret()) {
    return NextResponse.json({ error: authConfigurationMessage }, { status: 503 });
  }

  return handler(request, context);
}
