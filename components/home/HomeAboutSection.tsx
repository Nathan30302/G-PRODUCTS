import Link from "next/link";
import { Icon } from "@/components/Icons";
import { siteConfig } from "@/config/site";

const benefits = [
  {
    icon: "shield" as const,
    title: "Worry-free experience",
    body: "Shop with confidence — genuine products, clear pricing, and support when you need it."
  },
  {
    icon: "truck" as const,
    title: "Get your devices fast",
    body: "Free campus delivery where applicable, plus pickup at UNZA, Kalingalinga and Balastone."
  },
  {
    icon: "refresh" as const,
    title: "Hassle-free returns",
    body: "Friendly help in-store and on WhatsApp if something is not right with your order."
  },
  {
    icon: "wallet" as const,
    title: "Shop with confidence",
    body: "Mobile Money checkout, fair campus pricing, and trusted service built for everyday shoppers."
  }
];

/** About G-Products + trust benefit cards. */
export function HomeAboutSection() {
  return (
    <section className="container-g mt-10 sm:mt-12">
      <div className="max-w-2xl">
        <h2 className="display text-[clamp(1.25rem,0.95rem+1.2vw,1.625rem)] font-extrabold text-gp-text">
          About {siteConfig.name}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-gp-text-muted sm:text-base">
          {siteConfig.description}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gp-text-muted">
          {siteConfig.tagline} — shop online with Mobile Money, browse campus
          packs, and visit us for printing, key cutting and G-Loans.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {benefits.map((b) => (
          <div
            key={b.title}
            className="flex items-start gap-4 rounded-[1.25rem] border border-gp-border/70 bg-white p-4 shadow-card sm:p-5"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-ink-700/10 text-ink-700">
              <Icon name={b.icon} className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-base font-extrabold text-gp-text">
                {b.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-gp-text-muted">
                {b.body}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/about" className="btn-ghost px-5 py-2.5 text-sm">
          Learn more
        </Link>
        <Link href="/services" className="btn-brand px-5 py-2.5 text-sm">
          Our services
        </Link>
      </div>
    </section>
  );
}
