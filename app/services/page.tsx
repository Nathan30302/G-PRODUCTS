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
        <Link href="/" className="hover:text-white">
          Home
        </Link>{" "}
        / <span className="text-white/70">Services</span>
      </nav>

      <header className="mt-4 max-w-2xl">
        <h1 className="text-3xl font-black text-white sm:text-4xl">
          Services that gladden hearts
        </h1>
        <p className="mt-3 text-white/55">
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
