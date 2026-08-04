import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/Icons";
import { Logo } from "@/components/Logo";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_12%,rgba(246,212,0,0.16),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_85%_95%,rgba(34,201,138,0.1),transparent_55%)]" />
        <div className="absolute left-1/2 top-[18%] h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-brand/10 blur-[100px] animate-glow-breathe" />
      </div>

      <div className="container-g relative flex min-h-[calc(100svh-3.5rem)] flex-col justify-center py-12 sm:min-h-[calc(100svh-4rem)] sm:py-16 lg:py-20">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
          {/* Single brand cue — small mark only; full lockup lives in the header */}
          <div className="hero-rise">
            <Logo
              withText={false}
              size="md"
              priority
              className="rounded-2xl ring-1 ring-white/10 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.7)]"
            />
          </div>

          <h1 className="hero-rise hero-rise-delay-1 display mt-7 max-w-[11ch] text-[2.5rem] leading-[1.02] text-brand sm:mt-8 sm:max-w-none sm:text-5xl lg:text-[3.5rem]">
            {siteConfig.tagline}
          </h1>

          <p className="hero-rise hero-rise-delay-2 mt-4 text-base font-semibold leading-snug text-white/80 sm:text-lg lg:text-xl">
            Everything you need — one shop.
          </p>

          <p className="hero-rise hero-rise-delay-3 mt-3 max-w-sm text-sm leading-relaxed text-white/45 sm:max-w-md sm:text-[0.95rem]">
            Printing, electronics, stationery and services at prices that feel
            fair. Free delivery within school.
          </p>

          <div className="hero-rise hero-rise-delay-4 mt-8 flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:w-auto sm:flex-row sm:justify-center">
            <Link
              href="/search"
              className="btn-brand w-full px-8 py-3.5 text-sm sm:w-auto sm:text-base"
            >
              Shop now
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
            <Link
              href="/services"
              className="btn-ghost w-full px-8 py-3.5 text-sm sm:w-auto sm:text-base"
            >
              Printing & services
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
    </section>
  );
}
