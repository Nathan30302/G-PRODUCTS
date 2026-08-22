import Link from "next/link";
import { getAllServiceOffers } from "@/lib/service-queries";
import { ServiceTile } from "@/components/ServiceTile";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Services",
  description:
    "Key cutting, G-Loans, and printing services from G-Products — pickup at Kalingalinga or Yango delivery."
};

export default async function ServicesPage() {
  const services = await getAllServiceOffers();

  return (
    <div className="container-g py-10">
      <nav className="text-sm text-white/40">
        <Link href="/" className="transition-colors hover:text-white">
          Home
        </Link>{" "}
        / <span className="text-white/70">Services</span>
      </nav>

      <header className="relative mt-5 max-w-2xl overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-gradient-to-br from-ink-900 via-ink-900/80 to-ink-950 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand/10 blur-3xl" />
        <div className="relative">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand/80">
            Heart-gladdening help
          </p>
          <h1 className="display mt-1.5 text-3xl sm:text-4xl">Services</h1>
          <p className="mt-3 text-base leading-relaxed text-white/55">
            Key cutting, collateral-based loans, and document printing — order
            online, pay with Mobile Money, then pick up at {siteConfig.branch} or
            get delivery via Yango.
          </p>
        </div>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <ServiceTile key={s.slug} service={s} />
        ))}
      </div>
    </div>
  );
}
