import { Icon } from "@/components/Icons";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { siteConfig } from "@/config/site";

const reasons = [
  {
    icon: "shield",
    title: "100% genuine stock",
    body: "Every charger, laptop and accessory is sourced from trusted suppliers - no fakes, no surprises."
  },
  {
    icon: "wallet",
    title: "Pay the way you know",
    body: "Checkout with MTN MoMo, Airtel Money or Zamtel - or confirm your order instantly on WhatsApp."
  },
  {
    icon: "truck",
    title: "Delivered to your door",
    body: `Fast delivery in Lusaka and ${siteConfig.deliveryArea.toLowerCase()}, so your tech reaches you quickly.`
  },
  {
    icon: "clock",
    title: "Real people, real hours",
    body: "Open early till late. Message us and chat with the G-Products team whenever you need a hand."
  }
];

export function WhyGProducts() {
  return (
    <section className="container-g mt-16">
      <Reveal className="mb-6">
        <span className="eyebrow">Why shop with us</span>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          The G-Products difference
        </h2>
        <p className="mt-1.5 max-w-xl text-sm text-white/50">
          {siteConfig.legalName} - powering your devices and perfecting your
          prints, all in one place.
        </p>
      </Reveal>

      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map((r) => (
          <StaggerItem key={r.title}>
            <div className="group h-full rounded-card border border-white/[0.06] bg-ink-850 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/25 hover:shadow-card-hover">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/20 transition-colors group-hover:bg-brand group-hover:text-ink-950">
                <Icon name={r.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-bold text-white">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                {r.body}
              </p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
