import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { SafeImage } from "@/components/SafeImage";

export const dynamic = "force-dynamic";
export const metadata = { title: "Products" };

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
      variants: { orderBy: { sortOrder: "asc" } }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand/80">
            Catalogue
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-white">
            Products
          </h1>
          <p className="mt-2 text-sm text-white/50">
            {products.length} item{products.length === 1 ? "" : "s"} · set
            colours & quantities per product
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-pill bg-brand px-5 py-2.5 text-sm font-bold text-ink-950 shadow-brand-glow transition-all hover:bg-brand-soft"
        >
          + Add product
        </Link>
      </div>

      <div className="overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-ink-900/50 shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-white/[0.02] text-[11px] uppercase tracking-[0.14em] text-white/40">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Product</th>
                <th className="px-5 py-3.5 font-semibold">Category</th>
                <th className="px-5 py-3.5 font-semibold">Price</th>
                <th className="px-5 py-3.5 font-semibold">Colours / stock</th>
                <th className="px-5 py-3.5 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-white/40"
                  >
                    No products yet. Add your first item to the catalogue.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const total = p.variants.reduce((n, v) => n + v.quantity, 0);
                  return (
                    <tr
                      key={p.id}
                      className="border-t border-white/[0.05] transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-ink-800 ring-1 ring-white/10">
                            <SafeImage
                              src={p.images[0]?.url}
                              alt={p.name}
                              fill
                              sizes="44px"
                              className="object-cover"
                              fallbackClassName="grid h-full w-full place-items-center text-[8px] font-bold uppercase tracking-wide text-white/25"
                            />
                          </div>
                          <span className="font-semibold text-white">
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-white/55">
                        {p.category.name}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-white">
                        {formatPrice(p.price)}
                      </td>
                      <td className="px-5 py-3.5">
                        {p.variants.length === 0 ? (
                          <span className="text-white/35">No colours set</span>
                        ) : (
                          <div className="space-y-1">
                            {p.variants.map((v) => (
                              <div
                                key={v.id}
                                className="flex items-center gap-2 text-white/70"
                              >
                                <span
                                  className="h-3 w-3 shrink-0 rounded-full ring-1 ring-white/20"
                                  style={{
                                    backgroundColor: v.colorHex || "#6b7280"
                                  }}
                                />
                                <span>
                                  {v.name}:{" "}
                                  <span
                                    className={
                                      v.quantity === 0
                                        ? "text-white/35"
                                        : "font-medium text-white"
                                    }
                                  >
                                    {v.quantity === 0 ? "Out" : v.quantity}
                                  </span>
                                </span>
                              </div>
                            ))}
                            <p className="text-[11px] text-white/30">
                              Total {total}
                            </p>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="text-sm font-semibold text-brand hover:underline"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
