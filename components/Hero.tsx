import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/Icons";
import { Logo } from "@/components/Logo";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_12%,rgba(246,212,0,0.18),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_85%_95%,rgba(34,201,138,0.11),transparent_55%)]" />
        <div className="absolute left-1/2 top-[14%] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-brand/12 blur-[110px] animate-glow-breathe" />
      </div>

      <div className="container-g relative flex min-h-[calc(100svh-3.5rem)] flex-col justify-center py-10 sm:min-h-[calc(100svh-4rem)] sm:py-14 lg:py-16">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <div className="hero-rise relative">
            <div
              className="absolute -inset-10 rounded-[2.75rem] opacity-90 blur-2xl sm:-inset-12"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(26,51,68,0.98) 0%, rgba(26,51,68,0.4) 52%, transparent 74%)"
              }}
              aria-hidden
            />
            <div
              className="relative overflow-hidden rounded-[1.75rem] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.85)] sm:rounded-[2rem]"
              style={{ backgroundColor: "#1a3344" }}
            >
              <Logo
                size="hero"
                priority
                className="rounded-[1.75rem] sm:rounded-[2rem]"
              />
            </div>
          </div>

          {/* Tagline leads — bigger than the supporting line below */}
          <h1 className="hero-rise hero-rise-delay-1 display mt-9 max-w-[12ch] text-[2.35rem] leading-[1.02] text-brand sm:mt-10 sm:max-w-none sm:text-5xl lg:text-6xl">
            {siteConfig.tagline}
          </h1>

          <p className="hero-rise hero-rise-delay-2 mt-4 max-w-[20ch] text-lg font-semibold leading-snug text-white/85 sm:max-w-none sm:text-xl lg:text-2xl">
            Everything you need — one shop.
          </p>

          <p className="hero-rise hero-rise-delay-3 mt-4 max-w-md text-sm leading-relaxed text-white/50 sm:text-base">
            Printing, electronics, stationery and services at prices that feel
            fair. Free delivery within school.
          </p>

          <div className="hero-rise hero-rise-delay-4 mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
            <Link
              href="/search"
              className="btn-brand w-full px-9 py-3.5 text-base sm:w-auto"
            >
              Shop now
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
            <Link
              href="/services"
              className="btn-ghost w-full px-9 py-3.5 text-base sm:w-auto"
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
