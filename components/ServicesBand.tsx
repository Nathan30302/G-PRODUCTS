import Link from "next/link";
import { getAllServiceOffers } from "@/lib/service-queries";
import { ServiceTile } from "@/components/ServiceTile";
import { Icon } from "@/components/Icons";

export async function ServicesBand() {
  const services = await getAllServiceOffers();

  return (
    <section className="container-g mt-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            And Services
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
            Need more than gadgets?
          </h2>
          <p className="mt-2 max-w-xl text-sm text-white/50">
            Key cutting, G-Loans, and printing — order online, pick up at
            Kalingalinga or get it delivered by Yango.
          </p>
        </div>
        <Link
          href="/services"
          className="hidden items-center gap-1 text-sm font-semibold text-brand sm:inline-flex"
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
