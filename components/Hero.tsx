import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/Icons";
import { Logo } from "@/components/Logo";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Full-bleed Plug-style promo plane */}
      <div className="relative mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative overflow-hidden sm:rounded-[2rem] sm:mt-3">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(165deg, #f6d400 0%, #e8c200 28%, #2a6b78 68%, #0a2429 100%)"
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.28),transparent_55%)]" />
          <div className="pointer-events-none absolute -bottom-24 left-1/2 h-64 w-[120%] -translate-x-1/2 rounded-[100%] bg-ink-950/20 blur-2xl" />

          <div className="relative flex min-h-[min(88svh,42rem)] flex-col items-center justify-center px-5 pb-14 pt-10 text-center sm:min-h-[36rem] sm:px-10 sm:pb-16 sm:pt-12">
            <div className="hero-rise mb-6 sm:mb-8">
              <div
                className="mx-auto overflow-hidden rounded-2xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.45)]"
                style={{ backgroundColor: "#1a3344" }}
              >
                <Logo size="md" priority className="rounded-2xl" />
              </div>
            </div>

            <div className="hero-rise hero-rise-delay-1 relative mb-6 h-40 w-40 sm:mb-8 sm:h-52 sm:w-52">
              <div className="absolute inset-0 rounded-full bg-white/25 blur-xl" />
              <div className="relative h-full w-full overflow-hidden rounded-full border-[3px] border-white/70 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.35)]">
                <Image
                  src="/products/mango-airpods.png"
                  alt="Featured G-Products tech"
                  fill
                  priority
                  sizes="208px"
                  className="object-cover"
                />
              </div>
            </div>

            <span className="hero-rise hero-rise-delay-2 inline-flex items-center rounded-pill bg-accent px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_8px_24px_-8px_rgba(34,201,138,0.55)]">
              Free delivery in school
            </span>

            <h1 className="hero-rise hero-rise-delay-2 mt-4 max-w-[14ch] font-display text-[2.15rem] font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-sm sm:max-w-none sm:text-5xl lg:text-[3.25rem]">
              {siteConfig.tagline}
            </h1>

            <p className="hero-rise hero-rise-delay-3 mt-3 max-w-md text-sm font-medium leading-relaxed text-white/90 sm:text-base">
              Everything you need — one shop. Printing, electronics &amp;
              stationery at fair prices.
            </p>

            <div className="hero-rise hero-rise-delay-4 mt-7 flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
              <Link
                href="/search"
                className="inline-flex w-full items-center justify-center gap-2 rounded-pill bg-ink-950 px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_32px_-8px_rgba(0,0,0,0.45)] transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:bg-ink-900 active:scale-[0.98] sm:w-auto"
              >
                Shop now
                <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex w-full items-center justify-center gap-2 rounded-pill border border-white/40 bg-white/15 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 ease-out-expo hover:bg-white/25 active:scale-[0.98] sm:w-auto"
              >
                Services
              </Link>
            </div>

            {/* Carousel-style progress bars (decorative) */}
            <div className="hero-rise hero-rise-delay-4 mt-10 flex w-full max-w-[12rem] gap-1.5">
              <span className="h-1 flex-1 rounded-full bg-white" />
              <span className="h-1 flex-1 rounded-full bg-white/35" />
              <span className="h-1 flex-1 rounded-full bg-white/35" />
              <span className="h-1 flex-1 rounded-full bg-white/35" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
