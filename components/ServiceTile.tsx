import Link from "next/link";
import Image from "next/image";
import { ServiceDef } from "@/lib/services";
import { Icon } from "@/components/Icons";

export function ServiceTile({ service }: { service: ServiceDef }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group overflow-hidden rounded-card border border-ink-800 bg-ink-850 shadow-card transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] bg-ink-800">
        {service.image ? (
          <Image
            src={service.image}
            alt={service.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-ink-800 via-ink-850 to-ink-900">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand/15 text-brand ring-1 ring-brand/30">
              <Icon name={service.icon} className="h-8 w-8" />
            </span>
          </div>
        )}
        {service.priceLabel && (
          <span className="absolute left-3 top-3 rounded-pill bg-brand px-2.5 py-1 text-xs font-bold text-ink-950">
            {service.priceLabel}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink-800 text-brand">
            <Icon name={service.icon} className="h-5 w-5" />
          </span>
          <h3 className="text-lg font-bold text-white">{service.name}</h3>
        </div>
        <p className="mt-2 text-sm text-white/55">{service.tagline}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
          Order now
          <Icon name="arrow-right" className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
