import Link from "next/link";
import { getAllServiceOffers } from "@/lib/service-queries";
import { ServiceTile } from "@/components/ServiceTile";
import { CampusBanner } from "@/components/shared/CampusBanner";
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
    <div className="container-g py-8 pb-12 sm:py-10 sm:pb-16">
      <nav className="text-sm text-gp-text-subtle">
        <Link href="/" className="transition-colors hover:text-gp-text">
          Home
        </Link>{" "}
        / <span className="text-gp-text-muted">Services</span>
      </nav>

      <header className="mt-5">
        <CampusBanner
          eyebrow="Services Center"
          title="Keys, loans & printing"
          description={`Order online from your phone — upload print files, pay with Mobile Money, then pick up at ${siteConfig.branch} or get delivery via Yango.`}
          footnote={`${services.length} services · tap any card to start`}
          bullets={[
            { icon: "printer", text: "Upload → we print" },
            { icon: "key", text: "In-store or Yango" },
            { icon: "wallet", text: "Mobile Money" }
          ]}
        />
      </header>

      <div className="mt-10">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="section-label">Choose a service</p>
            <h2 className="display heading-section mt-2">What do you need today?</h2>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceTile key={s.slug} service={s} />
          ))}
        </div>
      </div>
    </div>
  );
}
