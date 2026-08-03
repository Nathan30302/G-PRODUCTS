import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/Icons";
import { Logo } from "@/components/Logo";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-brand/15 blur-[130px]" />
        <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-accent/10 blur-[110px]" />
      </div>

      <div className="container-g relative flex min-h-[78vh] flex-col justify-center py-16 sm:min-h-[72vh] sm:py-20 lg:py-24">
        <div className="max-w-3xl animate-fade-up">
          <Logo size="hero" priority className="rounded-[1.75rem] shadow-brand-glow sm:rounded-[2rem]" />

          <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.28em] text-brand">
            {siteConfig.tagline}
          </p>
          <p className="mt-4 max-w-xl text-lg font-medium leading-snug text-white/80 sm:text-xl">
            Everything you need — one shop.
          </p>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-white/50 sm:text-lg">
            Printing, electronics, stationery and services at prices that feel
            fair. Free delivery within school.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/search" className="btn-brand px-8 py-3.5 text-base">
              Shop now
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
            <Link href="/services" className="btn-ghost px-8 py-3.5 text-base">
              Printing & services
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
    </section>
  );
}
