import { Icon } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { siteConfig, whatsappHref } from "@/config/site";
import { SmokeBackdrop } from "@/components/SmokeBackdrop";
import Link from "next/link";

/** Compact contact strip — prefer LocationsBand on the homepage. */
export function ContactBand() {
  return (
    <section id="contact" className="container-g mt-24 mb-8 scroll-mt-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[#0a2429] px-6 py-12 sm:px-10 sm:py-14 lg:px-14">
          <SmokeBackdrop />
          <div className="pointer-events-none absolute -right-16 top-0 h-72 w-72 rounded-full bg-accent/20 blur-[110px]" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-brand/15 blur-[100px]" />

          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-accent">
                Talk to us
              </p>
              <h2 className="display mt-3 text-3xl sm:text-4xl">
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
                    {siteConfig.locationLabels.join(" · ")}
                  </span>
                </p>
                <p className="flex flex-wrap gap-x-4 gap-y-1 pl-7 font-semibold text-white/80">
                  {siteConfig.contacts.map((c) => (
                    <a
                      key={c.tel}
                      href={`tel:${c.tel}`}
                      className="transition-colors hover:text-brand"
                    >
                      {c.display}
                    </a>
                  ))}
                </p>
              </div>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col">
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-pill bg-accent px-8 py-3.5 text-sm font-bold text-ink-950 shadow-accent-glow transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:brightness-110"
              >
                <Icon name="whatsapp" className="h-5 w-5" />
                Chat on WhatsApp
              </a>
              <Link href="/#locations" className="btn-ghost px-8 py-3.5">
                <Icon name="map-pin" className="h-5 w-5" />
                Our locations
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
