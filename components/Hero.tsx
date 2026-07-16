import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/Icons";

const chips = [
  { icon: "shield", label: "Genuine tech" },
  { icon: "wallet", label: "Mobile Money" },
  { icon: "truck", label: "Fast delivery" }
];

export function Hero() {
  return (
    <section className="container-g mt-4 sm:mt-6">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.06] bg-gradient-to-br from-ink-850 via-ink-900 to-ink-950 px-6 py-14 shadow-card sm:px-12 sm:py-20">
        {/* ambient glows */}
        <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-brand/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-accent/10 blur-[100px]" />
        {/* subtle grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
            backgroundSize: "44px 44px"
          }}
        />

        <div className="relative max-w-2xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-pill bg-brand/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand ring-1 ring-brand/30">
            <Icon name="spark" className="h-3.5 w-3.5" />
            {siteConfig.tagline}
          </span>
          <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl">
            Your plug for genuine tech,{" "}
            <span className="bg-gradient-to-r from-brand via-brand-soft to-brand bg-clip-text text-transparent">
              at smart prices.
            </span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg">
            Chargers, power banks, headphones, phones, laptops and more. Shop
            online, pay with Mobile Money, delivered across Zambia.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/search" className="btn-brand px-7 py-3.5 text-base">
              Shop all tech
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
            <Link
              href="/category/laptops"
              className="btn-ghost px-7 py-3.5 text-base"
            >
              Browse laptops
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
            {chips.map((c) => (
              <span
                key={c.label}
                className="inline-flex items-center gap-2 text-sm font-medium text-white/60"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white/[0.05] text-brand ring-1 ring-white/10">
                  <Icon name={c.icon} className="h-4 w-4" />
                </span>
                {c.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
