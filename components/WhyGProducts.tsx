import { Icon } from "@/components/Icons";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { siteConfig } from "@/config/site";

const reasons = [
  {
    icon: "shield",
    title: "Quality you can trust",
    body: "Stationery, electronics, storage and accessories — genuine stock at student-friendly prices."
  },
  {
    icon: "wallet",
    title: "Pay the way you know",
    body: "Checkout with MTN MoMo, Airtel Money or Zamtel — or confirm your order on WhatsApp."
  },
  {
    icon: "truck",
    title: "Free delivery in school",
    body: "Quick & free delivery within campus. Pickup at UNZA, Kalingalinga or Balastone — or nationwide."
  },
  {
    icon: "printer",
    title: "Print & services too",
    body: "Photocopying, printing, key cutting and G-Loans — all from the same G-Products shops."
  }
];

export function WhyGProducts() {
  return (
    <section className="container-g mt-20">
      <Reveal className="mb-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand/80">
          Why shop with us
        </p>
        <h2 className="mt-1.5 text-2xl font-black tracking-tight text-white sm:text-3xl">
          The G-Products difference
        </h2>
        <p className="mt-2 max-w-xl text-sm text-white/50">
          {siteConfig.legalName} — powering your devices and perfecting your
          prints, all in one place.
        </p>
      </Reveal>

      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map((r) => (
          <StaggerItem key={r.title}>
            <div className="group h-full rounded-[1.35rem] border border-white/[0.07] bg-ink-900/50 p-6 shadow-card backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/25 hover:shadow-brand-glow">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/20 transition-colors group-hover:bg-brand group-hover:text-ink-950">
                <Icon name={r.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-bold text-white">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                {r.body}
              </p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
