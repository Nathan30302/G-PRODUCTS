import Link from "next/link";
import { categories } from "@/lib/categories";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/Icons";

const serviceLinks = [
  { slug: "key-cutting", name: "Key Cutting" },
  { slug: "g-loans", name: "G-Loans" },
  { slug: "printing", name: "Printing" }
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/[0.06] bg-ink-950/80">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/35 to-transparent" />
      <div className="container-g grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <Logo size="lg" />
          <p className="mt-4 text-sm font-semibold text-brand/90">
            {siteConfig.tagline}
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/50">
            {siteConfig.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {Object.values(siteConfig.mobileMoney).map((m) => (
              <span
                key={m.label}
                className="rounded-pill border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/55"
              >
                {m.label}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
            Shop
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/55">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/category/${c.slug}`}
                  className="transition-colors hover:text-brand"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
            Services
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/55">
            {serviceLinks.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="transition-colors hover:text-brand"
                >
                  {s.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/services"
                className="transition-colors hover:text-brand"
              >
                All services
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
            <Icon name="clock" className="h-3.5 w-3.5 text-brand" />
            Hours
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/55">
            {siteConfig.hours.map((h) => (
              <li key={h.days} className="flex justify-between gap-3">
                <span>{h.days}</span>
                <span className="font-medium text-white/80">{h.time}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-start gap-1.5 text-xs text-white/40">
            <Icon name="map-pin" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span className="leading-relaxed">
              {siteConfig.locations.join(" · ")}
            </span>
          </p>
        </div>

        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
            Get in touch
          </h4>
          <p className="mt-4 text-sm text-white/55">
            Message us on WhatsApp for products, key cutting, loans or printing.
          </p>
          <p className="mt-3 space-y-1 text-sm font-semibold text-white">
            {siteConfig.phones.map((ph) => (
              <a
                key={ph}
                href={`tel:${ph.replace(/\s/g, "")}`}
                className="block transition-colors hover:text-brand"
              >
                {ph}
              </a>
            ))}
          </p>
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-4"
          >
            <Icon name="whatsapp" className="h-4 w-4" />
            Chat on WhatsApp
          </a>
          {siteConfig.whatsappCatalogue && (
            <a
              href={siteConfig.whatsappCatalogue}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-sm text-brand hover:underline"
            >
              WhatsApp catalogue
            </a>
          )}
        </div>
      </div>

      <div className="border-t border-white/[0.06] py-6">
        <div className="container-g flex flex-col items-center justify-between gap-2 text-xs text-white/35 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.legalName}. All rights
            reserved.
          </p>
          <p className="text-center sm:text-right">
            {siteConfig.locations.join(" · ")}
          </p>
        </div>
      </div>
    </footer>
  );
}
