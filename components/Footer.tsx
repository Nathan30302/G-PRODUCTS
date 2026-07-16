import Link from "next/link";
import { categories } from "@/lib/categories";
import { services } from "@/lib/services";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/Icons";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-ink-900">
      <div className="container-g grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <Logo />
          <p className="mt-4 text-sm font-semibold text-brand/90">
            {siteConfig.tagline}
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/55">
            {siteConfig.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {Object.values(siteConfig.mobileMoney).map((m) => (
              <span
                key={m.label}
                className="rounded-pill border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/60"
              >
                {m.label}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Shop</h4>
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
          <h4 className="text-sm font-semibold text-white">Services</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/55">
            {services.map((s) => (
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
              <Link href="/services" className="transition-colors hover:text-brand">
                All services
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-white">
            <Icon name="clock" className="h-4 w-4 text-brand" />
            Working Hours
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/55">
            {siteConfig.hours.map((h) => (
              <li key={h.days} className="flex justify-between gap-3">
                <span>{h.days}</span>
                <span className="font-medium text-white/80">{h.time}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-center gap-1.5 text-xs text-white/40">
            <Icon name="map-pin" className="h-3.5 w-3.5" />
            {siteConfig.branch}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Get in touch</h4>
          <p className="mt-4 text-sm text-white/55">
            Message us on WhatsApp for products, key cutting, loans or printing.
          </p>
          <p className="mt-3 text-sm font-semibold text-white">
            {siteConfig.phoneDisplay}
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
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container-g flex flex-col items-center justify-between gap-2 text-xs text-white/40 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.legalName}. All rights
            reserved.
          </p>
          <p>Made with care in {siteConfig.branch}.</p>
        </div>
      </div>
    </footer>
  );
}
