import { env } from "@/lib/env";

const developmentSecret = "dialed-local-auth-secret-change-me";

export const authConfigurationMessage =
  "Authentication is not configured. Add AUTH_SECRET or NEXTAUTH_SECRET in your environment variables.";

export const resolvedAuthSecret =
  env.AUTH_SECRET ??
  env.NEXTAUTH_SECRET ??
  (process.env.NODE_ENV === "development" ? developmentSecret : undefined);

export function hasConfiguredAuthSecret() {
  return Boolean(resolvedAuthSecret);
}
