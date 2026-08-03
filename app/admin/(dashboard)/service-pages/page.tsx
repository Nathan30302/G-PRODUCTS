import Link from "next/link";
import Image from "next/image";
import { getAllServiceOffersAdmin } from "@/lib/service-queries";

export const dynamic = "force-dynamic";
export const metadata = { title: "Service pages" };

export default async function AdminServicePages() {
  const offers = await getAllServiceOffersAdmin();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand/80">
          Public content
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-white">
          Service pages
        </h1>
        <p className="mt-2 max-w-xl text-sm text-white/50">
          Photos, descriptions and prices on /services. Incoming customer jobs
          live under{" "}
          <Link href="/admin/services" className="text-brand hover:underline">
            Service orders
          </Link>
          .
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((o) => (
          <Link
            key={o.id}
            href={`/admin/service-pages/${o.id}`}
            className="group overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-ink-900/50 shadow-card transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-brand-glow"
          >
            <div className="relative aspect-[16/10] bg-ink-800">
              {o.imageUrl && (
                <Image
                  src={o.imageUrl}
                  alt={o.name}
                  fill
                  sizes="33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
              {!o.enabled && (
                <span className="absolute left-3 top-3 rounded-pill border border-white/20 bg-ink-950/70 px-2.5 py-1 text-xs font-semibold text-white/80 backdrop-blur">
                  Hidden
                </span>
              )}
              <span className="absolute bottom-3 left-3 text-sm font-bold text-white">
                {o.name}
              </span>
            </div>
            <div className="p-4">
              <p className="text-sm text-white/50">{o.tagline}</p>
              <span className="mt-3 inline-block text-sm font-semibold text-brand">
                Edit page →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
