import Link from "next/link";
import { siteConfig } from "@/config/site";

/** Plug-style promo banner — gradient hero with sale CTA. */
export function HomePromoHero() {
  return (
    <section className="container-g pt-4 sm:pt-5">
      <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#c8f0dc] via-[#e8f8ef] to-[#fff9e6] shadow-card sm:rounded-[1.75rem]">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#f6d400]/25 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-6 h-36 w-36 rounded-full bg-accent/20 blur-2xl" />

        <div className="relative flex flex-col items-center px-5 py-8 text-center sm:px-8 sm:py-10">
          <span className="rounded-pill bg-gradient-to-r from-[#9b7bff] via-[#c084fc] to-[#f4a261] px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white shadow-sm">
            Campus favorite
          </span>

          <h2 className="display mt-4 max-w-[16ch] text-[clamp(1.375rem,1rem+1.8vw,1.875rem)] font-extrabold leading-tight text-ink-900 sm:max-w-none">
            Tech you&apos;ll love at prices you&apos;ll love more
          </h2>

          <p className="mt-3 max-w-md text-sm font-medium leading-relaxed text-gp-text-muted">
            {siteConfig.subheading}
          </p>

          <Link
            href="/search?deals=1"
            className="btn-brand mt-6 min-h-12 w-full max-w-xs px-8 text-base"
          >
            Shop the sale
          </Link>
        </div>
      </div>
    </section>
  );
}
