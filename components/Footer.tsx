import Link from "next/link";
import { catalogGroups, hrefForCatalogGroup } from "@/lib/catalog-taxonomy";
import { siteConfig, whatsappHref } from "@/config/site";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/Icons";

const serviceLinks = [
  { href: "/services/printing", name: "Upload & Print" },
  { href: "/services/key-cutting", name: "Key Cutting" },
  { href: "/services/g-loans", name: "G-Loans" },
  { href: "/services", name: "All services" }
];

const helpLinks = [
  { href: "/delivery", name: "Delivery & Pickup" },
  { href: "/returns", name: "Returns & Refunds" },
  { href: "/warranty", name: "Warranty" },
  { href: "/search", name: "Search products" }
];

const companyLinks = [
  { href: "/about", name: "About Us" },
  { href: "/privacy", name: "Privacy Policy" },
  { href: "/terms", name: "Terms of Use" },
  { href: "/terms/g-loans", name: "G-Loans Terms" }
];

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/[0.06] bg-ink-950/80 sm:mt-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/35 to-transparent" />
      <div className="container-g grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-7">
        <div className="sm:col-span-2 lg:col-span-2">
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
            {catalogGroups
              .filter((g) => !g.href)
              .map((g) => (
                <li key={g.slug}>
                  <Link
                    href={hrefForCatalogGroup(g)}
                    className="transition-colors hover:text-brand"
                  >
                    {g.name}
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
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="transition-colors hover:text-brand"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
            Help
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/55">
            {helpLinks.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="transition-colors hover:text-brand"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
            Company
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/55">
            {companyLinks.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="transition-colors hover:text-brand"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
            Connect
          </h4>
          <p className="mt-3 text-sm text-white/55">
            Call or WhatsApp for stock, printing and services.
          </p>
          <div className="mt-3 space-y-2">
            {siteConfig.contacts.map((c) => (
              <div key={c.tel} className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold tabular-nums text-white">
                  {c.display}
                </span>
                <a
                  href={`tel:${c.tel}`}
                  className="text-xs font-semibold text-brand hover:underline"
                >
                  Call
                </a>
                <span className="text-white/20">·</span>
                <a
                  href={`https://wa.me/${c.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-accent hover:underline"
                >
                  WhatsApp
                </a>
              </div>
            ))}
          </div>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-4"
          >
            <Icon name="whatsapp" className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-white/[0.06] py-6">
        <div className="container-g flex flex-col items-center justify-between gap-2 text-xs text-white/35 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.legalName}. All rights
            reserved.
          </p>
          <p className="text-center sm:text-right">
            {siteConfig.locationLabels.join(" · ")}
          </p>
        </div>
      </div>
    </footer>
  );
}
