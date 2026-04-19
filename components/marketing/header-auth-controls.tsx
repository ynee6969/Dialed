"use client";

import Link from "next/link";
import { Heart, LoaderCircle, LogIn, LogOut, Menu, UserPlus, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

import { useFavorites } from "@/components/providers/favorites-provider";
import styles from "./HeaderAuthControls.module.css";

export function HeaderAuthControls() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { favoritesCount, favoritesReady } = useFavorites();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, status]);

  const mobileCount = status === "authenticated" && favoritesReady ? favoritesCount : null;

  function closeMobileSheet() {
    setMobileOpen(false);
  }

  async function handleSignOut() {
    closeMobileSheet();
    await signOut({ callbackUrl: "/" });
  }

  return (
    <>
      <div className={`header-auth-desktop ${styles.desktop}`}>
        {status === "loading" ? (
          <span className="chip muted-chip">
            <LoaderCircle size={14} className="spin" />
            <span>Loading</span>
          </span>
        ) : status === "authenticated" ? (
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
        ) : (
          <div className="header-auth-group">
            <Link href="/login" className="button-ghost header-auth-button">
              <span>Log in</span>
            </Link>
            <Link href="/signup" className="button header-auth-button">
              <span>Sign up</span>
            </Link>
          </div>
        )}
      </div>

      <div className={`header-auth-mobile ${styles.mobile}`}>
        <button
          type="button"
          className="button-secondary header-mobile-trigger"
          onClick={() => setMobileOpen(true)}
          aria-label="Open account actions"
        >
          {status === "loading" ? <LoaderCircle size={17} className="spin" /> : <Menu size={18} />}
          {mobileCount ? <span className="header-mobile-count">{mobileCount}</span> : null}
        </button>
      </div>

      {mobileOpen ? (
        <div
          className={`sheet-overlay header-account-overlay ${styles.overlay}`}
          role="presentation"
          onClick={closeMobileSheet}
        >
          <div
            className={`sheet-panel header-account-sheet ${styles.panel}`}
            role="dialog"
            aria-modal="true"
            aria-label="Account actions"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sheet-header header-account-sheet-header">
              <div className="header-account-sheet-copy">
                <strong>{status === "authenticated" ? "Your account" : "Browsing mode"}</strong>
                <p className="muted">
                  {status === "authenticated"
                    ? `Signed in as ${session?.user?.name ?? session?.user?.email ?? "your account"}.`
                    : "Sign in only when you want saved phones and account-level history."}
                </p>
              </div>

              <button type="button" className="button-ghost header-account-close" onClick={closeMobileSheet}>
                <X size={16} />
              </button>
            </div>

            {status === "authenticated" ? (
              <div className="header-account-actions">
                <Link href="/favorites" className="button-secondary header-account-link" onClick={closeMobileSheet}>
                  <Heart size={16} />
                  <span>Favorites</span>
                  {favoritesReady ? <span className="header-auth-count">{favoritesCount}</span> : null}
                </Link>
                <button type="button" className="button-ghost header-account-link" onClick={() => void handleSignOut()}>
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <div className="header-account-actions">
                <Link href="/login" className="button-secondary header-account-link" onClick={closeMobileSheet}>
                  <LogIn size={16} />
                  <span>Log in</span>
                </Link>
                <Link href="/signup" className="button header-account-link" onClick={closeMobileSheet}>
                  <UserPlus size={16} />
                  <span>Sign up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
