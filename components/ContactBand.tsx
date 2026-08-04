import { Icon } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { siteConfig } from "@/config/site";

export function ContactBand() {
  return (
    <section id="contact" className="container-g mt-16 mb-8 scroll-mt-24 sm:mt-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-ink-950 px-6 py-12 sm:px-10 sm:py-14 lg:px-14">
          <div className="pointer-events-none absolute -right-16 top-0 h-72 w-72 rounded-full bg-accent/20 blur-[110px]" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-brand/15 blur-[100px]" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
              backgroundSize: "22px 22px"
            }}
          />

          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-accent">
                Talk to us
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Need help choosing?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/55 sm:text-base">
                Message us on WhatsApp for live stock, prices and advice. We
                reply fast.
              </p>
              <div className="mt-6 space-y-3 text-sm text-white/45">
                <p className="flex items-start gap-2.5">
                  <Icon
                    name="map-pin"
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                  />
                  <span className="leading-relaxed">
                    {siteConfig.locations.join(" · ")}
                  </span>
                </p>
                <p className="flex flex-wrap gap-x-4 gap-y-1 pl-7 font-semibold text-white/80">
                  {siteConfig.phones.map((ph) => (
                    <a
                      key={ph}
                      href={`tel:${ph.replace(/\s/g, "")}`}
                      className="transition-colors hover:text-brand"
                    >
                      {ph}
                    </a>
                  ))}
                </p>
              </div>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col">
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-pill bg-accent px-8 py-3.5 text-sm font-bold text-ink-950 shadow-accent-glow transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:brightness-110"
              >
                <Icon name="whatsapp" className="h-5 w-5" />
                Chat on WhatsApp
              </a>
              <a
                href={`tel:${siteConfig.phoneDisplay.replace(/\s/g, "")}`}
                className="btn-ghost-dark px-8 py-3.5"
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
