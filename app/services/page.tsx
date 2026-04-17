import type { Route } from "next";
import Link from "next/link";

const services = [
  {
    title: "Catalog browser",
    copy: "See the full list, sort it quickly, and jump straight into the phones that fit your budget.",
    href: "/gallery",
    cta: "Browse catalog"
  },
  {
    title: "Compare tool",
    copy: "Shortlist a few phones and check their scores, price, and core specs side by side.",
    href: "/compare",
    cta: "Open compare lab"
  },
  {
    title: "Full spec pages",
    copy: "Open any device for the long-form spec sheet, then jump to Lazada or Shopee when you are ready to shop.",
    href: "/dashboard",
    cta: "Open dashboard"
  }
] satisfies Array<{
  title: string;
  copy: string;
  href: Route;
  cta: string;
}>;

export default function ServicesPage() {
  return (
    <section className="section">
      <div className="page-shell">
        <span className="section-label">Inside The Site</span>
        <h1 className="section-title">The main tools are simple on purpose.</h1>
        <div className="card-grid" style={{ marginTop: 28 }}>
          {services.map((service) => (
            <article key={service.title} className="glass-panel card">
              <h3>{service.title}</h3>
              <p className="muted">{service.copy}</p>
              <Link href={service.href} className="button-secondary" style={{ marginTop: 12, display: "inline-flex" }}>
                {service.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
