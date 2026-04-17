"use client";

import { SessionProvider } from "next-auth/react";

import { FavoritesProvider } from "@/components/providers/favorites-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchWhenOffline={false}>
      <FavoritesProvider>{children}</FavoritesProvider>
    </SessionProvider>
  );
}
