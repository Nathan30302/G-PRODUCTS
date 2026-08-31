import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getServiceOffer } from "@/lib/service-queries";
import { Icon } from "@/components/Icons";
import { KeyCuttingForm } from "@/components/services/KeyCuttingForm";
import { GLoansForm } from "@/components/services/GLoansForm";
import { PrintingForm } from "@/components/services/PrintingForm";
import { ServiceGallery } from "@/components/services/ServiceGallery";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceOffer(slug);
  if (!service) return { title: "Service" };
  return {
    title: service.name,
    description: service.description
  };
}

export default async function ServiceDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceOffer(slug);
  if (!service) notFound();

  const gallery =
    service.images?.length > 0
      ? service.images
      : service.image
        ? [service.image]
        : [];

  return (
    <div className="container-g py-10">
      <nav className="text-sm text-gp-text-subtle">
        <Link href="/" className="hover:text-gp-text">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/services" className="hover:text-gp-text">
          Services
        </Link>{" "}
        / <span className="text-gp-text-muted">{service.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="lg:sticky lg:top-[calc(var(--chrome-h)+0.75rem)]">
          <ServiceGallery
            images={gallery}
            name={service.name}
            badge={service.priceLabel}
          />
          <h1 className="display heading-page mt-6">
            {service.name}
          </h1>
          <p className="mt-2 text-brand">{service.tagline}</p>
          <p className="mt-4 leading-relaxed text-gp-text-muted">
            {service.description}
          </p>
          <ul className="mt-6 space-y-2.5 text-sm text-gp-text-muted">
            <li className="flex items-start gap-2.5">
              <Icon
                name="map-pin"
                className="mt-0.5 h-4 w-4 shrink-0 text-brand"
              />
              Pickup at {siteConfig.branch} — or Yango delivery.
            </li>
            <li className="flex items-start gap-2.5">
              <Icon
                name="wallet"
                className="mt-0.5 h-4 w-4 shrink-0 text-brand"
              />
              Pay with MTN, Airtel or Zamtel Mobile Money.
            </li>
            <li className="flex items-start gap-2.5">
              <Icon
                name="whatsapp"
                className="mt-0.5 h-4 w-4 shrink-0 text-brand"
              />
              We confirm and update you on WhatsApp.
            </li>
          </ul>
        </div>

        <div className="rounded-[1.5rem] border border-white/[0.08] bg-gradient-to-b from-ink-850/90 to-ink-900/95 p-5 shadow-card sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/20">
              <Icon name="edit" className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">
                {service.payable ? "Place your order" : "Submit a request"}
              </h2>
              <p className="mt-0.5 text-sm text-white/50">
                {slug === "printing"
                  ? "Upload → choose options → pay → we print → collect or delivery."
                  : slug === "key-cutting"
                    ? "Pick key type → in-store or Yango → pay → we cut."
                    : "Details → collateral → NRC → we review on WhatsApp."}
              </p>
            </div>
          </div>
          <div className="mt-6 border-t border-white/[0.06] pt-6">
            {slug === "key-cutting" && (
              <KeyCuttingForm settings={service.settings} />
            )}
            {slug === "g-loans" && <GLoansForm settings={service.settings} />}
            {slug === "printing" && (
              <PrintingForm settings={service.settings} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
