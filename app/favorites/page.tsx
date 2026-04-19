/**
 * ===================================
 * FAVORITES PAGE
 * ===================================
 * 
 * Purpose: Displays user's saved/favorited phones.
 * Protected page - requires authentication to view.
 * 
 * Features:
 * - Shows all phones user has marked as favorite
 * - Filters out phones not yet added to catalog
 * - Uses same card layout as dashboard for consistency
 * - Empty state when no favorites saved
 * - Quick navigation to dashboard to browse more phones
 * 
 * User Journey: Authenticated user clicks favorites → Views saved devices → Can compare or view details.
 * 
 * Security:
 * - Checks auth is configured (else shows notice)
 * - Requires active user session (redirects to login if not)
 * - Only returns current user's favorites (server-side filtering)
 * 
 * Data: Fetches favorites from database, serializes to phone card format.
 * Dynamic: force-dynamic ensures only current user's data is shown.
 */

import Link from "next/link";
import { redirect } from "next/navigation"; /* Server-side redirect */

import { AuthConfigNotice } from "@/components/auth/auth-config-notice";
import { DeviceCard } from "@/components/phones/device-card";
import { hasConfiguredAuthSecret } from "@/lib/auth/config";
import { getOptionalSession } from "@/lib/auth/session";
import { listFavoritesByUserId } from "@/lib/services/favorites";
import { serializePhoneCard } from "@/lib/types/phone-card";

/* force-dynamic: Don't cache this page
   Each user has different favorites; always fetch fresh data */
export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  if (!hasConfiguredAuthSecret()) {
    return (
      <section className="section">
        <div className="page-shell">
          <AuthConfigNotice />
        </div>
      </section>
    );
  }

  const session = await getOptionalSession();

  /* Protect page: Redirect to login if not authenticated
     Encodes callback URL so user returns here after login */
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=%2Ffavorites");
  }

  const favorites = await listFavoritesByUserId(session.user.id);
  const phones = favorites.map((favorite) => serializePhoneCard(favorite.phone));

  return (
    <section className="section">
      <div className="page-shell">
        <span className="section-label">Favorites</span>
        <h1 className="section-title">Your saved phones.</h1>
        <p className="section-copy">
          Keep standout devices in one place, then jump back into compare when the shortlist gets tight.
        </p>

        {phones.length ? (
          <div className="phone-grid dashboard-grid" style={{ marginTop: 28 }}>
            {phones.map((phone) => (
              <DeviceCard key={phone.id} phone={phone} />
            ))}
          </div>
        ) : (
          <div className="glass-panel card empty-state" style={{ marginTop: 28 }}>
            <p className="muted" style={{ marginTop: 0 }}>
              You have not saved any phones yet.
            </p>
            <Link href="/dashboard" className="button-secondary" style={{ display: "inline-flex" }}>
              Browse the dashboard
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
