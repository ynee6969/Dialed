"use client";

/**
 * ===================================
 * APP PROVIDERS
 * ===================================
 *
 * Purpose:
 * Central place for app-wide React context providers.
 *
 * Current stack:
 * - SessionProvider from NextAuth for auth state
 * - FavoritesProvider for user-specific saved-phone state
 */
import { SessionProvider } from "next-auth/react";

import { FavoritesProvider } from "@/components/providers/favorites-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    /* Session refetch options are relaxed to avoid noisy background polling in a mostly
       browse-first experience. */
    <SessionProvider refetchOnWindowFocus={false} refetchWhenOffline={false}>
      <FavoritesProvider>{children}</FavoritesProvider>
    </SessionProvider>
  );
}
