/**
 * ===================================
 * DASHBOARD PAGE (Main Phone Browser)
 * ===================================
 * 
 * Purpose: The main phone discovery and browsing interface.
 * Users filter, sort, and browse all available phones in a responsive grid.
 * 
 * Data Flow:
 * 1. Server fetches top phones using cached service (revalidates every 2 min)
 * 2. Component passes initial data to MatchmakerDashboard client component
 * 3. Client component handles all filtering, sorting, search interactions
 * 4. Dynamic filters: Brand, segment, price range, specifications
 * 5. Cards display: Model, price, score, key specs, action buttons
 * 
 * Caching Strategy:
 * - unstable_cache: Caches the top phones list
 * - revalidate: 120 seconds (2 minutes)
 * - Fresh data fetched automatically every 2 minutes
 * - If fetch fails, shows empty state or fallback UI
 * 
 * User Journey: After homepage, users land here to browse and filter phones.
 * From here, they can favorite phones, navigate to compare, or view details.
 */

import { unstable_cache } from "next/cache"; /* Next.js caching helper */

import { MatchmakerDashboard } from "@/components/dashboard/matchmaker-dashboard"; /* Client component with all interactivity */
import { listPhones } from "@/lib/services/phones";
import { serializePhoneCard } from "@/lib/types/phone-card";

/* Cache function: Fetches top 10 phones and caches result
   - Key: "dashboard-catalog" (used to invalidate cache if needed)
   - revalidate: 120 seconds (cache expires and refetches every 2 minutes)
   Impact: Reduces database queries while keeping data relatively fresh */
const getDashboardCatalog = unstable_cache(
  async () => listPhones({ take: 10, sort: "top" }), /* Fetch top-rated phones */
  ["dashboard-catalog"],    /* Cache key identifier */
  {
    revalidate: 120          /* Revalidate cache every 120 seconds */
  }
);

/* Also set page-level revalidation
   Pages regenerate every 120 seconds even if cached data is used */
export const revalidate = 120;

export default async function DashboardPage() {
  let catalog = {
    phones: [],
    total: 0,
    brands: []
  } as Awaited<ReturnType<typeof listPhones>>;

  /* Try to fetch cached catalog data
     If cache miss or database error, fallback to empty state (initialized above) */
  try {
    catalog = await getDashboardCatalog();
  } catch (error) {
    /* Log error but don't crash the page
       User sees empty dashboard with message to try again */
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
