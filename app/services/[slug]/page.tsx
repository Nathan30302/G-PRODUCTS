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

function orderHint(slug: string) {
  if (slug === "printing") {
    return "Upload → choose options → pay → we print → collect or delivery.";
  }
  if (slug === "key-cutting") {
    return "Pick key type → in-store or Yango → pay → we cut.";
  }
  return "Details → collateral → NRC → we review on WhatsApp.";
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
    <div className="container-g py-8 pb-16 sm:py-10">
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

      <div className="mt-5 lg:hidden">
        <p className="section-label">{service.priceLabel ?? "Service"}</p>
        <h1 className="display heading-page mt-1">{service.name}</h1>
        <p className="mt-1 text-sm font-medium text-ink-700">{service.tagline}</p>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
        <div className="order-2 lg:order-1 lg:sticky lg:top-[calc(var(--chrome-h)+0.75rem)]">
          <ServiceGallery
            images={gallery}
            name={service.name}
            badge={service.priceLabel}
          />
          <div className="hidden lg:block">
            <h1 className="display heading-page mt-6">{service.name}</h1>
            <p className="mt-2 font-medium text-ink-700">{service.tagline}</p>
          </div>
          <p className="mt-4 leading-relaxed text-gp-text-muted lg:mt-4">
            {service.description}
          </p>
          <ul className="mt-6 grid gap-2.5 sm:grid-cols-1">
            {[
              {
                icon: "map-pin",
                text: `Pickup at ${siteConfig.branch} — or Yango delivery.`
              },
              {
                icon: "wallet",
                text: "Pay with MTN, Airtel or Zamtel Mobile Money."
              },
              {
                icon: "whatsapp",
                text: "We confirm and update you on WhatsApp."
              }
            ].map((item) => (
              <li
                key={item.text}
                className="flex items-start gap-2.5 rounded-xl border border-gp-border/80 bg-gp-muted/60 px-3.5 py-3 text-sm text-gp-text-muted"
              >
                <Icon
                  name={item.icon}
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                />
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="order-1 lg:order-2">
          <div className="gp-card shadow-float lg:sticky lg:top-[calc(var(--chrome-h)+0.75rem)]">
            <div className="flex items-center gap-3 border-b border-gp-border/70 pb-5">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gp-muted text-ink-700 ring-1 ring-gp-border">
                <Icon name={service.icon} className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-gp-text">
                  {service.payable ? "Place your order" : "Submit a request"}
                </h2>
                <p className="mt-0.5 text-sm text-gp-text-muted">
                  {orderHint(slug)}
                </p>
              </div>
            </div>
            <div className="pt-6">
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
    </div>
  );
}
