import Link from "next/link";
import { siteConfig } from "@/config/site";

/** Full-width G-Products promo strip — services & campus reach. */
export function HomePromoBanner() {
  return (
    <section className="container-g mt-10 sm:mt-12">
      <div className="relative overflow-hidden rounded-[1.5rem] bg-ink-850 shadow-card sm:rounded-[1.75rem]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_30%_20%,rgba(200,224,63,0.22),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_90%_80%,rgba(229,243,79,0.12),transparent_55%)]" />
        </div>

        <div className="relative px-6 py-10 text-center sm:px-10 sm:py-12">
          <span className="rounded-pill bg-gradient-to-r from-brand to-accent px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-950">
            More than a shop
          </span>
          <h2 className="display mx-auto mt-4 max-w-lg text-[clamp(1.25rem,0.95rem+1.4vw,1.75rem)] font-extrabold leading-snug text-white">
            Powering your devices and perfecting your prints — all in one place
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/70">
            Visit {siteConfig.name} across Lusaka for printing, key cutting,
            G-Loans and genuine tech at fair prices.
          </p>
          <Link
            href="/services"
            className="btn-brand mt-6 inline-flex min-h-11 bg-brand px-6 text-sm font-bold text-ink-900 hover:bg-brand-soft"
          >
            Explore services
          </Link>
        </div>
      </div>
    </section>
  );
}
