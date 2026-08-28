import Link from "next/link";
import { siteConfig, whatsappHref } from "@/config/site";
import { Icon } from "@/components/Icons";
import { SmokeBackdrop } from "@/components/SmokeBackdrop";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <SmokeBackdrop className="-z-10" />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(246,212,0,0.16),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_90%_20%,rgba(246,212,0,0.06),transparent_50%)]" />
      </div>

      <div className="container-g relative flex flex-col justify-center py-12 sm:py-16 lg:py-20">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <p className="hero-rise text-xs font-semibold uppercase tracking-[0.14em] text-brand sm:text-sm">
            {siteConfig.name} · Lusaka
          </p>

          <h1 className="hero-rise hero-rise-delay-1 display mt-4 max-w-[16ch] text-[2rem] sm:max-w-none sm:text-5xl lg:text-[3.1rem]">
            {siteConfig.headline}
          </h1>

          <p className="hero-rise hero-rise-delay-2 mt-4 max-w-2xl text-sm font-normal leading-relaxed text-white/65 sm:text-base">
            {siteConfig.subheading}
          </p>

          <div className="hero-rise hero-rise-delay-2 mt-5 flex flex-wrap items-center justify-center gap-2">
            {siteConfig.heroCategories.map((label) => (
              <Link
                key={label}
                href="/search"
                className="rounded-pill border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-brand/35 hover:text-brand"
              >
                {label}
              </Link>
            ))}
          </div>

          <ul className="hero-rise hero-rise-delay-2 mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-white/45 sm:text-sm">
            {siteConfig.promise.map((p) => (
              <li key={p} className="flex items-center gap-1.5">
                <Icon name="check" className="h-3.5 w-3.5 shrink-0 text-accent" />
                {p}
              </li>
            ))}
          </ul>

          <div className="hero-rise hero-rise-delay-3 mt-9 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:w-auto sm:flex-row sm:justify-center">
            <Link
              href="/search"
              className="btn-brand w-full px-8 py-3.5 text-sm sm:w-auto sm:text-base"
            >
              Shop products
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
            <a
              href={whatsappHref(
                "Hi G-Products, I'd like to place an order on WhatsApp."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-pill border border-white/15 bg-white/[0.04] px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.07] sm:w-auto sm:text-base"
            >
              <Icon name="whatsapp" className="h-5 w-5 text-accent" />
              Order on WhatsApp
            </a>
          </div>

          <p className="hero-rise hero-rise-delay-3 mt-5 text-xs leading-relaxed text-white/35">
            {siteConfig.tagline} — printing, key cutting &amp; G-Loans available at
            our stores.{" "}
            <Link href="/services" className="font-semibold text-brand/80 hover:text-brand">
              View services
            </Link>
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand/35 to-transparent" />
    </section>
  );
}
