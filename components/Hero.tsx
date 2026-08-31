import Link from "next/link";
import { siteConfig, whatsappHref } from "@/config/site";
import { Icon } from "@/components/Icons";

/** Light retail homepage welcome — Heart Gladdening Products, no splash gate. */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-gp-border bg-gp-surface">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(34,201,138,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_90%_20%,rgba(246,212,0,0.06),transparent_50%)]" />
      </div>

      <div className="container-g relative flex flex-col justify-center py-10 sm:py-12 lg:py-14">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <p className="hero-rise section-label sm:text-xs">
            {siteConfig.splashLine}
          </p>

          <h1 className="hero-rise hero-rise-delay-1 display heading-page mt-4 max-w-[14ch] sm:max-w-none">
            {siteConfig.tagline}
          </h1>

          <p className="hero-rise hero-rise-delay-2 text-subtitle mt-4 max-w-2xl">
            {siteConfig.subheading}
          </p>

          <div className="hero-rise hero-rise-delay-3 mt-7 flex w-full max-w-md flex-col gap-2.5 sm:max-w-lg sm:flex-row sm:justify-center">
            <Link
              href="/search"
              className="btn-brand flex min-h-12 flex-1 items-center justify-center gap-2 px-6 text-base font-bold"
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
              className="btn-whatsapp flex min-h-12 flex-1 items-center justify-center gap-2 px-6 text-base font-semibold"
            >
              <Icon name="whatsapp" className="h-5 w-5" />
              Order on WhatsApp
            </a>
          </div>

          <p className="hero-rise hero-rise-delay-3 mt-4 text-xs text-gp-text-subtle">
            Printing, key cutting &amp; G-Loans at our stores.{" "}
            <Link href="/services" className="font-semibold text-ink-700 hover:underline">
              View services
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
