import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/Icons";
import { Logo } from "@/components/Logo";
import { SmokeBackdrop } from "@/components/SmokeBackdrop";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden lg:hidden">
      <SmokeBackdrop className="-z-10" />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(246,212,0,0.12),transparent_55%)]" />
      </div>

      <div className="container-g relative flex min-h-[calc(100svh-3.5rem)] flex-col justify-center py-14 sm:min-h-[calc(100svh-4rem)] sm:py-16">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
          <div className="hero-rise mb-7">
            <Logo size="hero" priority />
          </div>

          <h1 className="hero-rise display max-w-[12ch] text-[2.6rem] leading-[1.02] text-brand sm:max-w-none sm:text-5xl">
            {siteConfig.tagline}
          </h1>

          <p className="hero-rise hero-rise-delay-1 mt-5 text-base font-semibold leading-snug text-white/85 sm:text-lg">
            Everything you need — one shop.
          </p>

          <p className="hero-rise hero-rise-delay-2 mt-3 max-w-sm text-sm leading-relaxed text-white/45 sm:max-w-md">
            Printing, electronics, stationery and services at prices that feel
            fair. Free delivery within school.
          </p>

          <div className="hero-rise hero-rise-delay-3 mt-9 flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:w-auto sm:flex-row sm:justify-center">
            <Link
              href="/search"
              className="btn-brand w-full px-8 py-3.5 text-sm sm:w-auto sm:text-base"
            >
              Shop now
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
            <Link
              href="/services"
              className="inline-flex w-full items-center justify-center gap-2 rounded-pill bg-white px-8 py-3.5 text-sm font-bold text-ink-950 transition-all duration-200 ease-out-expo hover:-translate-y-0.5 active:scale-[0.98] sm:w-auto sm:text-base"
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand/35 to-transparent" />
    </section>
  );
}
