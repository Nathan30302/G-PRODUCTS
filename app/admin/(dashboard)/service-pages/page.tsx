import Link from "next/link";
import Image from "next/image";
import { getAllServiceOffersAdmin } from "@/lib/service-queries";

export const dynamic = "force-dynamic";
export const metadata = { title: "Service pages" };

export default async function AdminServicePages() {
  const offers = await getAllServiceOffersAdmin();

  return (
    <div>
      <h1 className="text-2xl font-black text-white">Service pages</h1>
      <p className="mt-1 text-sm text-white/50">
        Edit photos, descriptions and prices shown on /services. Customer
        requests are under{" "}
        <Link href="/admin/services" className="text-brand hover:underline">
          Service orders
        </Link>
        .
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((o) => (
          <div
            key={o.id}
            className="overflow-hidden rounded-card border border-ink-800 bg-ink-850"
          >
            <div className="relative aspect-[16/10] bg-ink-800">
              {o.imageUrl && (
                <Image
                  src={o.imageUrl}
                  alt={o.name}
                  fill
                  sizes="33vw"
                  className="object-cover"
                />
              )}
              {!o.enabled && (
                <span className="absolute left-3 top-3 rounded-pill bg-white/20 px-2 py-1 text-xs font-semibold text-white">
                  Hidden
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-white">{o.name}</h3>
              <p className="mt-1 text-sm text-white/50">{o.tagline}</p>
              <Link
                href={`/admin/service-pages/${o.id}`}
                className="mt-4 inline-block text-sm font-semibold text-brand hover:underline"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
