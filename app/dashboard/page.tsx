import { unstable_cache } from "next/cache";

import { MatchmakerDashboard } from "@/components/dashboard/matchmaker-dashboard";
import { listPhones } from "@/lib/services/phones";
import { serializePhoneCard } from "@/lib/types/phone-card";

const getDashboardCatalog = unstable_cache(
  async () => listPhones({ take: 10, sort: "top" }),
  ["dashboard-catalog"],
  {
    revalidate: 120
  }
);

export const revalidate = 120;

export default async function DashboardPage() {
  let catalog = {
    phones: [],
    total: 0,
    brands: []
  } as Awaited<ReturnType<typeof listPhones>>;

  try {
    catalog = await getDashboardCatalog();
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
