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
      <nav className="text-sm text-ink-950/40">
        <Link href="/" className="transition-colors hover:text-ink-950">
          Home
        </Link>{" "}
        / <span className="text-ink-950/70">Services</span>
      </nav>

      <header className="mt-5 max-w-2xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand/80">
          Heart-gladdening help
        </p>
        <h1 className="mt-1.5 text-3xl font-black tracking-tight text-ink-950 sm:text-4xl">
          Services
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-950/45">
          Key cutting, collateral-based loans, and document printing — order
          online, pay with Mobile Money, then pick up at {siteConfig.branch} or
          get delivery via Yango.
        </p>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <ServiceTile key={s.slug} service={s} />
        ))}
      </div>
    </div>
  );
}
