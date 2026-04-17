"use client";

import Link from "next/link";
import { Heart, LoaderCircle, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import { useFavorites } from "@/components/providers/favorites-provider";

export function HeaderAuthControls() {
  const { status } = useSession();
  const { favoritesCount, favoritesReady } = useFavorites();

  if (status === "loading") {
    return (
      <div className="header-auth-group">
        <span className="chip muted-chip">
          <LoaderCircle size={14} className="spin" />
          <span>Loading</span>
        </span>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="header-auth-group">
        <Link href="/favorites" className="button-secondary header-auth-button">
          <Heart size={16} />
          <span>Favorites</span>
          {favoritesReady ? <span className="header-auth-count">{favoritesCount}</span> : null}
        </Link>
        <button
          type="button"
          className="button-ghost header-auth-button"
          onClick={() => void signOut({ callbackUrl: "/" })}
        >
          <LogOut size={16} />
          <span>Sign out</span>
        </button>
      </div>
    );
  }

  return (
    <div className="header-auth-group">
      <Link href="/login" className="button-ghost header-auth-button">
        <span>Log in</span>
      </Link>
      <Link href="/signup" className="button header-auth-button">
        <span>Sign up</span>
      </Link>
    </div>
  );
}
