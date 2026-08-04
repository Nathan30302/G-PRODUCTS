import { Icon } from "@/components/Icons";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { siteConfig } from "@/config/site";

const reasons = [
  {
    icon: "shield",
    title: "Quality you can trust",
    body: "Genuine stationery, electronics and accessories at student-friendly prices."
  },
  {
    icon: "wallet",
    title: "Pay the way you know",
    body: "MTN MoMo, Airtel Money, Zamtel — or confirm on WhatsApp."
  },
  {
    icon: "truck",
    title: "Free delivery in school",
    body: "Quick campus delivery, plus pickup at UNZA, Kalingalinga or Balastone."
  },
  {
    icon: "printer",
    title: "Print & services too",
    body: "Photocopying, printing, key cutting and G-Loans under one roof."
  }
];

export function WhyGProducts() {
  return (
    <section className="relative mt-24 overflow-hidden border-y border-white/[0.05] bg-gradient-to-b from-ink-900/40 to-transparent py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(246,212,0,0.06),_transparent_55%)]" />
      <div className="container-g relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Why shop with us</p>
          <h2 className="display mt-3 text-3xl sm:text-4xl">
            The G-Products difference
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/50 sm:text-base">
            {siteConfig.legalName} — powering your devices and perfecting your
            prints, all in one place.
          </p>
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
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
      </div>
    </section>
  );
}
