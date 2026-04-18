/**
 * ===================================
 * PHONE DETAIL PAGE (Individual Phone Specs)
 * ===================================
 * 
 * Purpose: Shows comprehensive specifications for a single phone.
 * Accessed by clicking a phone card or using direct URL: /phones/[slug]
 * 
 * Dynamic Route: [slug] = phone URL slug (e.g., "xiaomi-14-ultra")
 * 
 * Data Flow:
 * 1. Server resolves [slug] parameter from URL
 * 2. Fetches phone data + cached reference/specs from GSMarena
 * 3. Returns 404 if phone doesn't exist
 * 4. Renders hero section + detailed specs table
 * 
 * Sections:
 * - Hero: Image, name, score chips, summary specs, actions
 * - Specs Table: Full organized by category (Display, Camera, Battery, etc.)
 * - Action Buttons: Favorite, Compare, Lazada/Shopee links, Dashboard link
 * 
 * Caching: revalidate=300 (5 minutes) - specs don't change frequently
 * Performance: Uses unstable_cache to avoid refetching same phone data
 */

import Link from "next/link";
import { notFound } from "next/navigation"; /* Server-side 404 redirect */
import { unstable_cache } from "next/cache"; /* Next.js caching */

import { FavoriteButton } from "@/components/phones/favorite-button";
import { getCachedPhoneReferenceForPhone } from "@/lib/services/gsmarena-reference";
import { getPhoneBySlugWithPreviewSource } from "@/lib/services/phones";
import {
  buildPhoneMarketplaceLinks,
  getPhoneDisplayName
} from "@/lib/utils/phone-presentation";
import { formatPhp, formatScore } from "@/lib/utils/format";

/* Cache function: Fetches phone data + specs
   Caches result for 5 minutes (300 seconds)
   Key: "phone-detail" used to invalidate cache if needed */
const getPhoneDetail = unstable_cache(
  async (slug: string) => {
    /* Fetch phone from database by URL slug */
    const phone = await getPhoneBySlugWithPreviewSource(slug);
    if (!phone) {
      return null; /* Return null if phone not found (triggers 404) */
    }

    /* Bundle phone data with cached reference specs */
    return {
      phone,
      reference: getCachedPhoneReferenceForPhone(phone) /* Cached GSMarena specs */
    };
  },
  ["phone-detail"],    /* Cache key */
  {
    revalidate: 300     /* Cache expires in 5 minutes */
  }
);

/* Page-level revalidation
   Pages regenerate every 5 minutes even with cached data */
export const revalidate = 300;

export default async function PhoneDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  /* Get slug from URL parameters */
  const { slug } = await params;
  
  /* Fetch phone detail (phone data + reference specs)
     Cached for 5 minutes to avoid repeated database queries */
  const detail = await getPhoneDetail(slug);

  /* Return 404 page if phone doesn't exist */
  if (!detail) {
    notFound();
  }

  /* Extract phone and reference from detail after null check
     TypeScript now knows detail is not null */
  const { phone, reference } = detail as NonNullable<typeof detail>;

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
                .map(([label, value]: [string, unknown]) => (
                  <div key={label} className="metric">
                    <span>{label.replace(/([A-Z])/g, " $1").trim()}</span>
                    <strong>{String(value)}</strong>
                  </div>
                ))}
            </div>

            <div className="phone-detail-actions">
              <div className="card-primary-actions">
                <FavoriteButton phoneId={phone.id} variant="full" />
                <Link href={`/compare?left=${phone.slug}`} className="button">
                  Compare in lab
                </Link>
              </div>
              <div className="marketplace-actions">
                <a href={marketplaceLinks.lazada} target="_blank" rel="noreferrer noopener" className="button">
                  Lazada
                </a>
                <a href={marketplaceLinks.shopee} target="_blank" rel="noreferrer noopener" className="button-ghost">
                  Shopee
                </a>
              </div>
              <Link href="/dashboard" className="button-secondary">
                Back to dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Full specifications table organized by category */}
        <div className="glass-panel specs-table-card">
          {/* Map spec sections (Display, Camera, Battery, Performance, etc.) */}
          <div className="specs-table">
            {reference.sections.map((section: any) => (
              <section key={section.title} className="specs-section">
                <div className="specs-section-title">{section.title}</div>
                <div className="specs-section-body">
                  {section.items.map((item: any, index: number) => (
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
