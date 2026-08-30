import Link from "next/link";
import { siteConfig, whatsappHref } from "@/config/site";
import { Icon } from "@/components/Icons";

/** Compact homepage banner — product shop is the focus; search lives in the header. */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/[0.05]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(246,212,0,0.12),transparent_60%)]" />

      <div className="container-g py-6 sm:py-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-brand/90">G-Products · Online shop</p>
          <h1 className="display mt-2 text-2xl leading-tight text-white sm:text-3xl">
            {siteConfig.tagline}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
            {siteConfig.subheading}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <Link href="/search" className="btn-brand min-h-11 px-6 py-3 text-sm">
              Browse products
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
            <a
              href={whatsappHref("Hi G-Products, I'd like to place an order.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-accent/35 bg-accent/10 px-5 py-3 text-sm font-bold text-white"
            >
              <Icon name="whatsapp" className="h-4 w-4 text-accent" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
