import { MatchmakerDashboard, type DashboardPhone } from "@/components/dashboard/matchmaker-dashboard";
import { ensureApplicationBootstrapped } from "@/lib/services/bootstrap";
import { listPhones } from "@/lib/services/phones";

export const dynamic = "force-dynamic";

function serializePhone(phone: Awaited<ReturnType<typeof listPhones>>["phones"][number]): DashboardPhone {
  return {
    id: phone.id,
    slug: phone.slug,
    brand: phone.brand,
    model: phone.model,
    segment: phone.segment,
    price: phone.price,
    performanceScore: phone.performanceScore,
    cameraScore: phone.cameraScore,
    batteryScore: phone.batteryScore,
    valueScore: phone.valueScore,
    finalScore: phone.finalScore
  };
}

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
          initialPhones={catalog.phones.map(serializePhone)}
          initialBrands={catalog.brands}
          stats={{
            catalogSize: catalog.total
          }}
        />
      </div>
    </section>
  );
}
