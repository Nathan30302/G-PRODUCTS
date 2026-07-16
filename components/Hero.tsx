import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Hero() {
  return (
    <section className="container-g mt-6">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-ink-800 bg-gradient-to-br from-ink-850 via-ink-900 to-ink-950 px-6 py-14 sm:px-12 sm:py-20">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center rounded-pill bg-brand/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand ring-1 ring-brand/30">
            {siteConfig.tagline}
          </span>
          <h1 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl">
            Your plug for genuine tech,{" "}
            <span className="text-brand">at smart prices.</span>
          </h1>
          <p className="mt-4 max-w-lg text-base text-white/60">
            Chargers, power banks, headphones, phones, laptops and more. Shop
            online, pay with Mobile Money, delivered across Zambia.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/category/phones"
              className="rounded-pill bg-brand px-6 py-3 text-sm font-bold text-ink-950 hover:bg-brand-soft"
            >
              Shop Phones
            </Link>
            <Link
              href="/search"
              className="rounded-pill border border-ink-700 bg-ink-850 px-6 py-3 text-sm font-bold text-white hover:border-brand/40"
            >
              Browse All Tech
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
