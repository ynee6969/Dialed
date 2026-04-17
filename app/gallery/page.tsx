import { GalleryGrid } from "@/components/phones/gallery-grid";
import { catalogStats } from "@/lib/data/seed-phones";
import { ensureApplicationBootstrapped } from "@/lib/services/bootstrap";
import { listPhones } from "@/lib/services/phones";
import { serializePhoneCard } from "@/lib/types/phone-card";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  let catalog = {
    phones: [],
    total: 0,
    brands: []
  } as Awaited<ReturnType<typeof listPhones>>;
  const totalPhones = catalog.total || catalogStats.total;

  try {
    await ensureApplicationBootstrapped();
    catalog = await listPhones({ take: 100, sort: "top" });
  } catch (error) {
    console.error("[gallery.page]", error);
  }

  const resolvedTotalPhones = catalog.total || totalPhones;

  return (
    <section className="section">
      <div className="page-shell">
        <span className="section-label">Gallery</span>
        <h1 className="section-title">All {resolvedTotalPhones} phones, one page.</h1>
        <p className="section-copy">
          Browse the full catalog with photos and quick spec lines. Open any phone for the full spec page.
        </p>
        <div style={{ marginTop: 28 }}>
          <GalleryGrid phones={catalog.phones.map(serializePhoneCard)} />
        </div>
      </div>
    </section>
  );
}
