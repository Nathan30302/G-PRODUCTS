import { Icon } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { siteConfig } from "@/config/site";

export function ContactBand() {
  return (
    <section className="container-g mt-16">
      <Reveal>
        <div className="relative overflow-hidden rounded-[1.75rem] border border-accent/20 bg-gradient-to-br from-ink-850 via-ink-900 to-ink-950 px-6 py-12 shadow-card sm:px-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/15 blur-[90px]" />
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-pill bg-accent/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent ring-1 ring-accent/30">
                <Icon name="whatsapp" className="h-3.5 w-3.5" />
                Talk to us
              </span>
              <h2 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
                Need help choosing the right tech?
              </h2>
              <p className="mt-2 text-sm text-white/60 sm:text-base">
                Message the G-Products team on WhatsApp for quick advice, live
                stock and prices. We reply fast.
              </p>
              <p className="mt-4 flex items-center gap-2 text-sm text-white/50">
                <Icon name="map-pin" className="h-4 w-4 text-brand" />
                {siteConfig.branch}
                <span className="mx-1 text-white/20">|</span>
                <span className="font-semibold text-white/80">
                  {siteConfig.phoneDisplay}
                </span>
              </p>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col">
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-pill bg-accent px-7 py-3.5 text-sm font-bold text-ink-950 shadow-accent-glow transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98]"
              >
                <Icon name="whatsapp" className="h-5 w-5" />
                Chat on WhatsApp
              </a>
              <a
                href={`tel:${siteConfig.phoneDisplay.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 rounded-pill border border-white/10 bg-white/[0.03] px-7 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:border-white/20"
              >
                <Icon name="phone" className="h-5 w-5" />
                Call us
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
