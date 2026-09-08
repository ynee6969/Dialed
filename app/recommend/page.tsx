import { RecommendationWorkspace } from "@/components/recommendation/recommendation-workspace";
import { listPhones } from "@/lib/services/phones";

export default async function RecommendPage() {
  const catalog = await listPhones({ take: 1000 });

  return (
    <section className="section">
      <div className="page-shell">
        <RecommendationWorkspace brands={catalog.brands} />
      </div>
    </section>
  );
}
