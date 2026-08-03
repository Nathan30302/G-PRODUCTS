import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getServiceOffer, getAllServiceOffers } from "@/lib/service-queries";
import { Icon } from "@/components/Icons";
import { KeyCuttingForm } from "@/components/services/KeyCuttingForm";
import { GLoansForm } from "@/components/services/GLoansForm";
import { PrintingForm } from "@/components/services/PrintingForm";

export const revalidate = 60;

export async function generateStaticParams() {
  const services = await getAllServiceOffers();
  return services.map((s) => ({ slug: s.slug }));
}

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
          <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-ink-800 bg-ink-850">
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
          <h1 className="mt-6 text-3xl font-black text-white">{service.name}</h1>
          <p className="mt-2 text-brand">{service.tagline}</p>
          <p className="mt-4 text-white/60">{service.description}</p>
          {service.priceLabel && (
            <p className="mt-4 text-sm font-semibold text-white/80">
              {service.priceLabel}
            </p>
          )}
        </div>

        <div className="rounded-card border border-ink-800 bg-ink-850 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white">
            {service.payable ? "Place your order" : "Submit a request"}
          </h2>
          <p className="mt-1 text-sm text-white/50">
            {service.payable
              ? "Fill in the details, pay with Mobile Money, then pickup or Yango."
              : "We'll review your request and contact you on WhatsApp."}
          </p>
          <div className="mt-6">
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
