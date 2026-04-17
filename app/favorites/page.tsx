import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { AuthConfigNotice } from "@/components/auth/auth-config-notice";
import { DeviceCard } from "@/components/phones/device-card";
import { hasConfiguredAuthSecret } from "@/lib/auth/config";
import { listFavoritesByUserId } from "@/lib/services/favorites";
import { serializePhoneCard } from "@/lib/types/phone-card";

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

  const session = await getServerSession(authOptions);

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
