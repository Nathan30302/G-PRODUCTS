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

      <div className="container-g relative flex flex-col justify-center py-10 sm:py-14 lg:py-20">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          <p className="eyebrow text-brand/90">G-Products · Online shop</p>

          <h1 className="display mt-2 max-w-[14ch] text-[2.15rem] leading-[1.1] text-white sm:mt-3 sm:max-w-none sm:text-[3rem] lg:text-[3.5rem]">
            {siteConfig.tagline}
          </h1>

          <p className="mt-4 max-w-2xl text-lg font-medium leading-relaxed text-white/85 sm:mt-5 sm:text-xl">
            {siteConfig.subheading}
          </p>

          <div className="mt-6 flex w-full max-w-xl flex-col gap-2 sm:max-w-2xl">
            <div className="rounded-[1.75rem] border border-white/10 bg-ink-900/60 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  href="/search"
                  className="btn-brand flex min-h-[3.25rem] flex-1 items-center justify-center gap-2 px-6 py-4 text-base font-bold sm:min-h-[3.5rem]"
                >
                  Browse products
                  <Icon name="arrow-right" className="h-5 w-5" />
                </Link>
                <a
                  href={whatsappHref(
                    "Hi G-Products, I'd like to place an order on WhatsApp."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[3.25rem] flex-1 items-center justify-center gap-2.5 rounded-pill border border-accent/35 bg-accent/10 px-6 py-4 text-base font-bold text-white transition-colors hover:border-accent/55 hover:bg-accent/20 sm:min-h-[3.5rem]"
                >
                  <Icon name="whatsapp" className="h-5 w-5 text-accent" />
                  WhatsApp order
                </a>
              </div>
            </div>
            <p className="text-center text-[11px] leading-relaxed text-white/40 sm:text-xs">
              MTN · Airtel · Zamtel Money · campus delivery · store pickup
            </p>
          </div>

          <div className="mt-5 hidden flex-wrap items-center justify-center gap-2 sm:mt-6 sm:flex">
            {siteConfig.heroCategories.map((label) => (
              <Link
                key={label}
                href={`/search?q=${encodeURIComponent(label)}`}
                className="rounded-pill border border-white/12 bg-white/[0.05] px-3.5 py-2 text-xs font-medium text-white/75 transition-colors hover:border-brand/40 hover:bg-brand/10 hover:text-brand sm:text-sm"
              >
                {label}
              </Link>
            ))}
          </div>

          <p className="mt-5 hidden text-xs leading-relaxed text-white/35 sm:block">
            Printing, key cutting &amp; G-Loans available in-store.{" "}
            <Link
              href="/services"
              className="font-semibold text-brand/85 hover:text-brand"
            >
              View services
            </Link>
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand/35 to-transparent" />
    </section>
  );
}
