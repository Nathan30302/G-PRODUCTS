import Link from "next/link";
import { catalogGroups, hrefForCatalogGroup } from "@/lib/catalog-taxonomy";
import { siteConfig, whatsappHref, configuredSocialLinks } from "@/config/site";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/Icons";

const serviceLinks = [
  { href: "/services/printing", name: "Upload & Print" },
  { href: "/services/key-cutting", name: "Key Cutting" },
  { href: "/services/g-loans", name: "G-Loans" },
  { href: "/services", name: "All services" }
];

const helpLinks = [
  { href: "/orders/track", name: "Track order" },
  { href: "/faq", name: "FAQs" },
  { href: "/delivery", name: "Delivery & Pickup" },
  { href: "/returns", name: "Returns & Refunds" },
  { href: "/warranty", name: "Warranty" },
  { href: "/search", name: "Search products" }
];

const companyLinks = [
  { href: "/about", name: "About Us" },
  { href: "/bundles", name: "Bundles & packs" },
  { href: "/privacy", name: "Privacy Policy" },
  { href: "/terms", name: "Terms of Use" },
  { href: "/terms/g-loans", name: "G-Loans Terms" }
];

export function Footer() {
  return (
    <footer className="relative mt-16 border-t border-white/[0.06] bg-ink-950/80 sm:mt-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/35 to-transparent" />
      <div className="container-g grid grid-cols-2 gap-8 py-12 sm:gap-10 sm:py-14 md:grid-cols-3 lg:grid-cols-12">
        <div className="col-span-2 md:col-span-3 lg:col-span-4">
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

        <div className="lg:col-span-2">
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
            <li>
              <Link href="/search?deals=1" className="transition-colors hover:text-brand">
                Hot Deals
              </Link>
            </li>
            <li>
              <Link href="/bundles" className="transition-colors hover:text-brand">
                Bundles &amp; packs
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-2">
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

        <div className="lg:col-span-2">
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

        <div className="col-span-2 md:col-span-1 lg:col-span-2">
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
      </div>

      <div className="container-g border-t border-white/[0.06] pb-6 pt-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
              Connect
            </h4>
            <p className="mt-3 max-w-md text-sm text-white/55">
              Call or WhatsApp for stock, printing and services.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {siteConfig.contacts.map((c) => (
                <div
                  key={c.tel}
                  className="flex items-center justify-between gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3"
                >
                  <span className="text-sm font-semibold tabular-nums text-white">
                    {c.display}
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
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
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-end gap-3 lg:col-span-5 lg:items-end">
            <div className="flex flex-wrap gap-2">
              {configuredSocialLinks().map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-pill border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/60 transition hover:border-brand/40 hover:text-brand"
                >
                  {s.label}
                </a>
              ))}
            </div>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full sm:w-auto"
            >
              <Icon name="whatsapp" className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.06] py-6">
        <div className="container-g flex flex-col items-center justify-between gap-3 text-xs text-white/35 sm:flex-row sm:items-start">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} {siteConfig.legalName}. All rights
            reserved.
          </p>
          <ul className="flex max-w-xl flex-wrap justify-center gap-x-2 gap-y-1 text-center sm:justify-end sm:text-right">
            {siteConfig.locationLabels.map((loc) => (
              <li key={loc} className="after:ml-2 after:text-white/20 after:content-['·'] last:after:content-none">
                {loc}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
