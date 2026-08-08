import Link from "next/link";
import { ServiceDef } from "@/lib/services";
import { Icon } from "@/components/Icons";
import { SafeImage } from "@/components/SafeImage";

export function ServiceTile({ service }: { service: ServiceDef }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-ink-900/50 shadow-card backdrop-blur-sm transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:border-brand/30 hover:shadow-brand-glow"
    >
      <div className="relative aspect-[16/10] bg-ink-950">
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
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
        {service.priceLabel && (
          <span className="absolute left-3 top-3 rounded-pill bg-brand px-2.5 py-1 text-xs font-bold text-ink-950 shadow-brand-glow">
            {service.priceLabel}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/20">
            <Icon name={service.icon} className="h-5 w-5" />
          </span>
          <h3 className="text-lg font-bold text-white">{service.name}</h3>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-white/50">
          {service.tagline}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
          Order now
          <Icon name="arrow-right" className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
