import { Icon } from "@/components/Icons";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { siteConfig } from "@/config/site";

const reasons = [
  {
    icon: "shield",
    title: "Genuine products",
    body: "Quality electronics, stationery and accessories you can trust — not mystery stock."
  },
  {
    icon: "wallet",
    title: "Fair prices",
    body: "Clear pricing for students and everyday shoppers, with Mobile Money at checkout."
  },
  {
    icon: "map-pin",
    title: "Physical locations",
    body: "Visit us at UNZA, Kalingalinga and Balastone — real shops you can walk into."
  },
  {
    icon: "truck",
    title: "Fast support & delivery",
    body: "Free campus delivery where applicable, easy pickup, and quick WhatsApp help."
  }
];

export function WhyGProducts() {
  return (
    <section className="relative mt-20 overflow-hidden border-y border-white/[0.05] bg-gradient-to-b from-ink-900/40 to-transparent py-14 sm:mt-24 sm:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(246,212,0,0.06),_transparent_55%)]" />
      <div className="container-g relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Why choose G-Products</p>
          <h2 className="display heading-page mt-3">
            Why trust G-Products?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/50 sm:text-base">
            Genuine electronics, phone accessories and stationery — fair prices,
            Mobile Money, and real shops across Lusaka.
          </p>
        </Reveal>

        <Stagger className="mt-10 grid grid-cols-1 gap-x-8 gap-y-8 sm:mt-12 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
          {reasons.map((r) => (
            <StaggerItem key={r.title}>
              <div className="text-center sm:text-left">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/20 sm:mx-0">
                  <Icon name={r.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-white">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  {r.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/40">
          {siteConfig.promise.map((p) => (
            <li key={p} className="flex items-center gap-1.5">
              <Icon name="check" className="h-3.5 w-3.5 text-accent" />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
