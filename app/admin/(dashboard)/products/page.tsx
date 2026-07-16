import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";

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
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Products</h1>
          <p className="mt-1 text-sm text-white/50">
            {products.length} product{products.length === 1 ? "" : "s"} — set
            colours & qty when you add or edit
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-pill bg-brand px-5 py-2.5 text-sm font-bold text-ink-950 hover:bg-brand-soft"
        >
          + Add product
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-card border border-ink-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-900 text-white/50">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Colours / stock</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const total = p.variants.reduce((n, v) => n + v.quantity, 0);
              return (
                <tr key={p.id} className="border-t border-ink-800 bg-ink-850">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-ink-800">
                        {p.images[0] && (
                          <Image
                            src={p.images[0].url}
                            alt={p.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <span className="font-medium text-white">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/60">{p.category.name}</td>
                  <td className="px-4 py-3 text-white">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    {p.variants.length === 0 ? (
                      <span className="text-white/40">No colours set</span>
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
                                    : "text-white"
                                }
                              >
                                {v.quantity === 0 ? "Out" : v.quantity}
                              </span>
                            </span>
                          </div>
                        ))}
                        <p className="text-xs text-white/35">
                          Total {total}
                        </p>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-sm font-semibold text-brand hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
