import { Prisma } from "@prisma/client";

import { env } from "@/lib/env";

export const authServiceUnavailableMessage =
  "Account services are temporarily unavailable. Please try again in a moment.";

export const favoritesServiceUnavailableMessage =
  "Favorites are temporarily unavailable. Please try again in a moment.";

export function hasDatabaseUrl() {
  return Boolean(env.DATABASE_URL?.trim());
}

export function isPrismaRuntimeError(error: unknown) {
  if (!error) {
    return false;
  }

  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.PrismaClientRustPanicError ||
    error instanceof Prisma.PrismaClientValidationError
  ) {
    return true;
  }

  const message = error instanceof Error ? error.message : String(error);

  return [
    "environment variable not found: database_url",
    "can't reach database server",
    "prepared statement",
    "does not exist in the current database",
    "invalid `prisma",
    "schema",
    "table",
    "connection pool",
    "p1001",
    "p1012",
    "p2021"
  ].some((needle) => message.toLowerCase().includes(needle));
}

export function getErrorMessage(error: unknown, fallback = "Unexpected server error.") {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }

  return fallback;
}

export function logServerFailure(scope: string, error: unknown) {
  console.error(`[${scope}]`, error);
}
