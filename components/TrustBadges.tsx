import { Icon } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";

const items = [
  {
    icon: "shield",
    title: "Genuine Products",
    subtitle: "Quality you can trust"
  },
  {
    icon: "wallet",
    title: "Mobile Money",
    subtitle: "MTN, Airtel & Zamtel"
  },
  {
    icon: "truck",
    title: "Fast Delivery",
    subtitle: "Lusaka & nationwide"
  },
  {
    icon: "refresh",
    title: "Easy Returns",
    subtitle: "Hassle-free support"
  }
];

export function TrustBadges() {
  return (
    <section className="container-g mt-16">
      <Reveal>
        <div className="grid grid-cols-2 gap-3 rounded-card border border-white/[0.06] bg-ink-850/60 p-3 lg:grid-cols-4">
          {items.map((t) => (
            <div
              key={t.title}
              className="flex items-center gap-3 rounded-xl2 p-3 transition-colors hover:bg-white/[0.03]"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand/10 text-brand ring-1 ring-brand/20">
                <Icon name={t.icon} className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-white">{t.title}</p>
                <p className="mt-0.5 text-xs text-white/50">{t.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
