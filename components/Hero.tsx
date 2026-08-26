import Link from "next/link";
import { siteConfig, whatsappHref } from "@/config/site";
import { Icon } from "@/components/Icons";
import { SmokeBackdrop } from "@/components/SmokeBackdrop";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <SmokeBackdrop className="-z-10" />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(246,212,0,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_90%_20%,rgba(34,197,94,0.07),transparent_50%)]" />
      </div>

      <div className="container-g relative flex flex-col justify-center py-10 sm:py-16 lg:py-20">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <p className="hero-rise text-[11px] font-bold uppercase tracking-[0.28em] text-brand">
            {siteConfig.name}
          </p>
          <p className="hero-rise hero-rise-delay-1 mt-3 text-sm font-semibold text-brand/90 sm:text-base">
            {siteConfig.tagline}
          </p>

          <h1 className="hero-rise hero-rise-delay-1 display mt-4 max-w-[18ch] text-[clamp(1.75rem,5.2vw+0.55rem,3.25rem)] leading-[1.08] text-white sm:max-w-none">
            {siteConfig.headline}
          </h1>

          <p className="hero-rise hero-rise-delay-2 mt-4 max-w-xl text-sm font-medium leading-relaxed text-white/65 sm:text-base">
            {siteConfig.subheading}
          </p>

          <ul className="hero-rise hero-rise-delay-2 mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40 sm:text-xs">
            {siteConfig.promise.map((p) => (
              <li key={p} className="flex items-center gap-1.5">
                <Icon name="check" className="h-3.5 w-3.5 shrink-0 text-accent" />
                {p}
              </li>
            ))}
          </ul>

          <div className="hero-rise hero-rise-delay-3 mt-8 flex w-full max-w-md flex-col gap-3 sm:mt-9 sm:max-w-none sm:w-auto sm:flex-row sm:justify-center">
            <Link
              href="/search"
              className="btn-brand w-full px-8 py-3.5 text-sm sm:w-auto sm:text-base"
            >
              Shop now
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
            <a
              href={whatsappHref(
                "Hi G-Products, I'd like to place an order on WhatsApp."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-pill border border-accent/40 bg-accent/10 px-8 py-3.5 text-sm font-bold text-accent transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:bg-accent hover:text-ink-950 sm:w-auto sm:text-base"
            >
              <Icon name="whatsapp" className="h-5 w-5" />
              Order on WhatsApp
            </a>
          </div>

          <Link
            href="/services/printing"
            className="hero-rise hero-rise-delay-3 group mt-4 inline-flex min-h-12 w-full max-w-md items-center justify-center gap-2 rounded-2xl border border-brand/50 bg-brand px-6 py-4 text-center text-sm font-extrabold uppercase tracking-[0.14em] text-ink-950 shadow-brand-glow transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:brightness-105 sm:mt-6 sm:w-auto sm:px-10 sm:text-base"
          >
            <Icon name="printer" className="h-5 w-5 shrink-0" />
            <span className="text-balance">Upload &amp; Print Now</span>
            <Icon
              name="arrow-right"
              className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand/35 to-transparent" />
    </section>
  );
}
