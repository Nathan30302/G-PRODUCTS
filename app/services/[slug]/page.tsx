import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getServiceOffer } from "@/lib/service-queries";
import { Icon } from "@/components/Icons";
import { KeyCuttingForm } from "@/components/services/KeyCuttingForm";
import { GLoansForm } from "@/components/services/GLoansForm";
import { PrintingForm } from "@/components/services/PrintingForm";
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

  return (
    <div className="container-g py-10">
      <nav className="text-sm text-white/40">
        <Link href="/" className="hover:text-white">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/services" className="hover:text-white">
          Services
        </Link>{" "}
        / <span className="text-white/70">{service.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem] border border-white/[0.08] bg-ink-850 shadow-card">
            {service.image ? (
              <Image
                src={service.image}
                alt={service.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-ink-800 to-ink-950">
                <span className="grid h-20 w-20 place-items-center rounded-2xl bg-brand/15 text-brand ring-1 ring-brand/30">
                  <Icon name={service.icon} className="h-10 w-10" />
                </span>
              </div>
            )}
          </div>
          <h1 className="display mt-6 text-3xl sm:text-4xl">{service.name}</h1>
          <p className="mt-2 text-brand">{service.tagline}</p>
          <p className="mt-4 leading-relaxed text-white/60">
            {service.description}
          </p>
          {service.priceLabel && (
            <p className="mt-4 inline-flex rounded-pill border border-brand/25 bg-brand/10 px-3.5 py-1.5 text-sm font-semibold text-brand">
              {service.priceLabel}
            </p>
          )}
          <ul className="mt-6 space-y-2 text-sm text-white/50">
            <li className="flex items-start gap-2.5">
              <Icon name="map-pin" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              Pickup at {siteConfig.branch} — or Yango delivery.
            </li>
            <li className="flex items-start gap-2.5">
              <Icon name="wallet" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              Pay with MTN, Airtel or Zamtel Mobile Money.
            </li>
            <li className="flex items-start gap-2.5">
              <Icon name="whatsapp" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              We confirm and update you on WhatsApp.
            </li>
          </ul>
        </div>

        <div className="rounded-[1.5rem] border border-white/[0.08] bg-gradient-to-b from-ink-850/90 to-ink-900/95 p-6 shadow-card sm:p-8">
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
                  ? "Choose a job, upload files from your phone, pay, then track status."
                  : service.payable
                    ? "Fill in the details, pay with Mobile Money, then pickup or Yango."
                    : "Upload what’s needed — we’ll review and contact you on WhatsApp."}
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
