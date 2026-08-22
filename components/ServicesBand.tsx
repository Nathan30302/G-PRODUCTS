import Link from "next/link";
import { getAllServiceOffers } from "@/lib/service-queries";
import { ServiceTile } from "@/components/ServiceTile";
import { Icon } from "@/components/Icons";

export async function ServicesBand() {
  const services = await getAllServiceOffers();

  return (
    <section className="container-g mt-24">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">And services</p>
          <h2 className="display mt-2 text-2xl sm:text-3xl">
            Need more than gadgets?
          </h2>
          <p className="mt-2 max-w-xl text-sm text-white/50">
            Key cutting, collateral loans, and document printing — upload from
            home, pay with Mobile Money, pick up or get Yango delivery.
          </p>
        </div>
        <Link
          href="/services"
          className="hidden items-center gap-1 rounded-pill border border-white/10 bg-white/[0.02] px-4 py-2 text-sm font-semibold text-brand sm:inline-flex"
        >
          View all
          <Icon name="arrow-right" className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <ServiceTile key={s.slug} service={s} />
        ))}
      </div>
    </section>
  );
}
