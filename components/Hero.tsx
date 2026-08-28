import Link from "next/link";
import { siteConfig, whatsappHref } from "@/config/site";
import { Icon } from "@/components/Icons";
import { SmokeBackdrop } from "@/components/SmokeBackdrop";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <SmokeBackdrop className="-z-10" />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(246,212,0,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_90%_20%,rgba(34,201,138,0.06),transparent_50%)]" />
      </div>

      <div className="container-g relative flex flex-col justify-center py-14 sm:py-16 lg:py-20">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          <p className="hero-rise eyebrow text-brand/90">{siteConfig.name}</p>

          <h1 className="hero-rise hero-rise-delay-1 display max-w-[14ch] text-[2.15rem] leading-[1.1] text-white sm:max-w-none sm:text-[3rem] lg:text-[3.5rem]">
            {siteConfig.tagline}
          </h1>

          <p className="hero-rise hero-rise-delay-2 mt-5 max-w-2xl text-lg font-medium leading-relaxed text-white/80 sm:text-xl">
            {siteConfig.splashLine}
          </p>

          <p className="hero-rise hero-rise-delay-2 mt-4 max-w-xl text-sm leading-relaxed text-white/50 sm:text-base">
            {siteConfig.subheading}
          </p>

          <div className="hero-rise hero-rise-delay-2 mt-6 flex flex-wrap items-center justify-center gap-2">
            {siteConfig.heroCategories.map((label) => (
              <Link
                key={label}
                href="/search"
                className="rounded-pill border border-white/12 bg-white/[0.05] px-3.5 py-2 text-xs font-medium text-white/75 transition-colors hover:border-brand/40 hover:bg-brand/10 hover:text-brand sm:text-sm"
              >
                {label}
              </Link>
            ))}
          </div>

          <ul className="hero-rise hero-rise-delay-2 mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-white/45 sm:text-sm">
            {siteConfig.promise.map((p) => (
              <li key={p} className="flex items-center gap-1.5">
                <Icon name="check" className="h-3.5 w-3.5 shrink-0 text-accent" />
                {p}
              </li>
            ))}
          </ul>

          <div className="hero-rise hero-rise-delay-3 mt-10 w-full max-w-xl sm:max-w-2xl">
            <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.03] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-md">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  href="/search"
                  className="btn-brand flex min-h-[3.25rem] flex-1 items-center justify-center gap-2 px-6 py-4 text-base font-bold sm:min-h-[3.5rem]"
                >
                  Shop products
                  <Icon name="arrow-right" className="h-5 w-5" />
                </Link>
                <a
                  href={whatsappHref(
                    "Hi G-Products, I'd like to place an order on WhatsApp."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[3.25rem] flex-1 items-center justify-center gap-2.5 rounded-pill border border-accent/35 bg-accent/10 px-6 py-4 text-base font-bold text-white transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:border-accent/55 hover:bg-accent/20 sm:min-h-[3.5rem]"
                >
                  <Icon name="whatsapp" className="h-5 w-5 text-accent" />
                  Order on WhatsApp
                </a>
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] leading-relaxed text-white/35 sm:text-xs">
              Mobile Money checkout · campus delivery · pickup in Lusaka
            </p>
          </div>

          <p className="hero-rise hero-rise-delay-3 mt-6 text-xs leading-relaxed text-white/35">
            Printing, key cutting &amp; G-Loans at our stores.{" "}
            <Link
              href="/services"
              className="font-semibold text-brand/85 hover:text-brand"
            >
              View services
            </Link>
            {" · "}
            <Link href="#reviews" className="font-semibold text-brand/85 hover:text-brand">
              Customer reviews
            </Link>
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand/35 to-transparent" />
    </section>
  );
}
