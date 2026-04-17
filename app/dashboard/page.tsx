import { MatchmakerDashboard } from "@/components/dashboard/matchmaker-dashboard";
import { ensureApplicationBootstrapped } from "@/lib/services/bootstrap";
import { listPhones } from "@/lib/services/phones";
import { serializePhoneCard } from "@/lib/types/phone-card";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let catalog = {
    phones: [],
    total: 0,
    brands: []
  } as Awaited<ReturnType<typeof listPhones>>;

  try {
    await ensureApplicationBootstrapped();
    catalog = await listPhones({ take: 100, sort: "top" });
  } catch (error) {
    console.error("[dashboard.page]", error);
  }

  return (
    <section className="section">
      <div className="page-shell">
        <MatchmakerDashboard
          initialPhones={catalog.phones.map(serializePhoneCard)}
          initialBrands={catalog.brands}
          stats={{
            catalogSize: catalog.total
          }}
        />
      </div>
    </section>
  );
}
