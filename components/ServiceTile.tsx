import Link from "next/link";
import { ServiceDef } from "@/lib/services";
import { Icon } from "@/components/Icons";
import { SafeImage } from "@/components/SafeImage";

export function ServiceTile({ service }: { service: ServiceDef }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-gp-border/80 bg-gp-surface shadow-card transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:border-ink-700/20 hover:shadow-card-hover active:scale-[0.99]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gp-muted">
        {service.image ? (
          <SafeImage
            src={service.image}
            alt={service.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-ink-850 via-ink-900 to-ink-950">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand/15 text-brand ring-1 ring-brand/30">
              <Icon name={service.icon} className="h-8 w-8" />
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/55 via-transparent to-transparent" />
        {service.priceLabel && (
          <span className="absolute left-3 top-3 rounded-pill bg-brand px-2.5 py-1 text-xs font-bold text-ink-950 shadow-brand-glow">
            {service.priceLabel}
          </span>
        )}
        <span className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/90 text-ink-700 shadow-float transition-transform group-hover:scale-105">
          <Icon name="arrow-right" className="h-4 w-4" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gp-muted text-ink-700 ring-1 ring-gp-border">
            <Icon name={service.icon} className="h-5 w-5" />
          </span>
          <h3 className="text-lg font-bold text-gp-text">{service.name}</h3>
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-gp-text-muted">
          {service.tagline}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink-700 transition-colors group-hover:text-brand">
          Order now
          <Icon
            name="arrow-right"
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
