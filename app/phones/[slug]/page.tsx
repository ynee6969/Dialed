import Link from "next/link";
import { notFound } from "next/navigation";

import {
  buildLocalPhoneReference,
  getPhoneReferenceBySlug
} from "@/lib/services/gsmarena-reference";
import { getPhoneBySlug } from "@/lib/services/phones";
import {
  buildPhoneMarketplaceLinks,
  getPhoneDisplayName
} from "@/lib/utils/phone-presentation";
import { formatPhp, formatScore } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export default async function PhoneDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let phone = null;
  let reference = null;

  try {
    [phone, reference] = await Promise.all([
      getPhoneBySlug(slug),
      getPhoneReferenceBySlug(slug)
    ]);
  } catch (error) {
    console.error("[phone-detail.page]", error);
    phone = await getPhoneBySlug(slug);
    reference = phone ? buildLocalPhoneReference(phone) : null;
  }

  if (!phone) {
    notFound();
  }

  if (!reference) {
    reference = buildLocalPhoneReference(phone);
  }

  const detailTitle = getPhoneDisplayName(phone.brand, reference.title);
  const marketplaceLinks = buildPhoneMarketplaceLinks(phone);

  return (
    <section className="section">
      <div className="page-shell phone-detail-layout">
        <div className="glass-panel phone-detail-hero">
          <div className="phone-detail-media">
            {reference.imageUrl ? (
              <img src={reference.imageUrl} alt={detailTitle} />
            ) : (
              <div className="phone-media-placeholder">{phone.brand.slice(0, 1)}</div>
            )}
          </div>

          <div className="stack">
            <span className="section-label">{phone.segment.replace(/_/g, " ")}</span>
            <h1 className="phone-detail-title">{detailTitle}</h1>
            {reference.alternativeNames.length ? (
              <p className="section-copy" style={{ margin: 0 }}>
                Also known as {reference.alternativeNames.join(", ")}
              </p>
            ) : null}

            <div className="chip-row">
              <span className="chip">{formatPhp(phone.price)}</span>
              <span className="chip">Overall {formatScore(phone.finalScore)}</span>
              <span className="chip">Performance {formatScore(phone.performanceScore)}</span>
              <span className="chip">Camera {formatScore(phone.cameraScore)}</span>
              <span className="chip">Battery {formatScore(phone.batteryScore)}</span>
            </div>

            <div className="detail-summary-grid">
              {Object.entries(reference.summary)
                .filter(([, value]) => Boolean(value))
                .map(([label, value]) => (
                  <div key={label} className="metric">
                    <span>{label.replace(/([A-Z])/g, " $1").trim()}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
            </div>

            <div className="phone-detail-actions">
              <Link href="/dashboard" className="button-secondary">
                Back to dashboard
              </Link>
              <div className="marketplace-actions">
                <a href={marketplaceLinks.lazada} target="_blank" rel="noreferrer noopener" className="button">
                  Lazada
                </a>
                <a href={marketplaceLinks.shopee} target="_blank" rel="noreferrer noopener" className="button-ghost">
                  Shopee
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel specs-table-card">
          <div className="specs-table">
            {reference.sections.map((section) => (
              <section key={section.title} className="specs-section">
                <div className="specs-section-title">{section.title}</div>
                <div className="specs-section-body">
                  {section.items.map((item, index) => (
                    <div key={`${section.title}-${item.label}-${index}`} className="spec-row">
                      <div className="spec-label">{item.label || " "}</div>
                      <div className="spec-value">{item.value}</div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
