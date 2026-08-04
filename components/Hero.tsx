import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/Icons";
import { Logo } from "@/components/Logo";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Full-bleed brand atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_18%,rgba(246,212,0,0.16),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_90%,rgba(34,201,138,0.10),transparent_55%)]" />
        <div className="absolute left-1/2 top-[18%] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-brand/10 blur-[100px] animate-glow-breathe" />
      </div>

      <div className="container-g relative flex min-h-[calc(100svh-3.5rem)] flex-col justify-center py-10 sm:min-h-[calc(100svh-4rem)] sm:py-14 lg:py-16">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
          {/* Brand plate — logo navy blends into soft stage, not a floating card */}
          <div className="hero-rise relative">
            <div
              className="absolute -inset-8 rounded-[2.5rem] opacity-80 blur-2xl sm:-inset-10"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(26,51,68,0.95) 0%, rgba(26,51,68,0.35) 55%, transparent 75%)"
              }}
              aria-hidden
            />
            <div
              className="relative overflow-hidden rounded-[1.65rem] sm:rounded-[1.85rem]"
              style={{ backgroundColor: "#1a3344" }}
            >
              <Logo size="hero" priority className="rounded-[1.65rem] sm:rounded-[1.85rem]" />
            </div>
          </div>

          <p className="hero-rise hero-rise-delay-1 mt-8 text-[11px] font-bold uppercase tracking-[0.32em] text-brand sm:mt-9">
            {siteConfig.tagline}
          </p>

          <h1 className="hero-rise hero-rise-delay-2 mt-4 max-w-[16ch] text-[1.85rem] font-black leading-[1.08] tracking-tight text-white sm:max-w-none sm:text-4xl lg:text-5xl">
            Everything you need — one shop.
          </h1>

          <p className="hero-rise hero-rise-delay-3 mt-4 max-w-md text-[0.95rem] leading-relaxed text-white/55 sm:text-base">
            Printing, electronics, stationery and services at prices that feel
            fair. Free delivery within school.
          </p>

          <div className="hero-rise hero-rise-delay-4 mt-8 flex w-full flex-col gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:justify-center">
            <Link
              href="/search"
              className="btn-brand w-full px-8 py-3.5 text-base sm:w-auto"
            >
              Shop now
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
            <Link
              href="/services"
              className="btn-ghost w-full px-8 py-3.5 text-base sm:w-auto"
            >
              Printing & services
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand/35 to-transparent" />
    </section>
  );
}
