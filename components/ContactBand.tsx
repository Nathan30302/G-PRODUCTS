import { Icon } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { siteConfig } from "@/config/site";

export function ContactBand() {
  return (
    <section className="container-g mt-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.07] bg-gradient-to-br from-ink-850/90 via-ink-900/90 to-ink-950 px-6 py-12 shadow-card sm:px-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/15 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-brand/10 blur-[90px]" />
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                Talk to us
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                Need help choosing?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/55 sm:text-base">
                Message us on WhatsApp for quick advice, live stock and prices.
                We reply fast.
              </p>
              <p className="mt-5 space-y-2 text-sm text-white/45">
                <span className="flex items-start gap-2">
                  <Icon
                    name="map-pin"
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                  />
                  <span className="leading-relaxed">
                    {siteConfig.locations.join(" · ")}
                  </span>
                </span>
                <span className="flex flex-wrap gap-x-3 gap-y-1 pl-6 font-semibold text-white/80">
                  {siteConfig.phones.map((ph) => (
                    <a
                      key={ph}
                      href={`tel:${ph.replace(/\s/g, "")}`}
                      className="transition-colors hover:text-brand"
                    >
                      {ph}
                    </a>
                  ))}
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
                className="btn-ghost px-7 py-3.5"
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
