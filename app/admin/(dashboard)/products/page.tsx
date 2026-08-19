import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { Product } from "@/lib/types";
import { SafeImage } from "@/components/SafeImage";

export const dynamic = "force-dynamic";
export const metadata = { title: "Products" };

function ProductRow({
  product
}: {
  product: Product & { categoryName: string };
}) {
  const thumb = product.images[0]?.url ?? "";
  return (
    <tr className="border-t border-white/[0.05] transition-colors hover:bg-white/[0.02]">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-ink-800 ring-1 ring-white/10">
            <SafeImage
              src={thumb}
              alt={product.name}
              fill
              sizes="44px"
              className="object-cover"
              fallbackClassName="grid h-full w-full place-items-center text-[8px] font-bold uppercase tracking-wide text-white/25"
            />
          </div>
          <span className="font-semibold text-white">{product.name}</span>
        </div>
      </td>
      <td className="px-5 py-3.5 font-semibold text-white">
        {formatPrice(product.price)}
      </td>
      <td className="px-5 py-3.5">
        {product.variants.length === 0 ? (
          <span className="text-white/35">No colours</span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <span
                key={v.id}
                title={`${v.name}${v.available ? "" : " · out"}`}
                className="inline-flex items-center gap-1.5 rounded-pill border border-white/10 px-2 py-0.5 text-xs text-white/70"
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ring-1 ring-white/20 ${
                    v.available ? "" : "opacity-40 grayscale"
                  }`}
                  style={{ backgroundColor: v.colorHex || "#6b7280" }}
                />
                {v.name}
                <span className="text-white/35">({v.quantity})</span>
              </span>
            ))}
          </div>
        )}
      </td>
      <td className="px-5 py-3.5 text-right">
        <Link
          href={`/admin/products/${product.id}`}
          className="text-sm font-semibold text-brand hover:underline"
        >
          Edit
        </Link>
      </td>
    </tr>
  );
}

export default async function AdminProducts() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      products: {
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          category: true,
          variants: { orderBy: { sortOrder: "asc" } }
        },
        orderBy: { name: "asc" }
      }
    }
  });

  const total = categories.reduce((n, c) => n + c.products.length, 0);

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
            {total} item{total === 1 ? "" : "s"} grouped by category · add
            photos per colour when editing
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-pill bg-brand px-5 py-2.5 text-sm font-bold text-ink-950 shadow-brand-glow transition-all hover:bg-brand-soft"
        >
          + Add product
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <a
            key={c.slug}
            href={`#cat-${c.slug}`}
            className="rounded-pill border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-semibold text-white/60 transition-colors hover:border-brand/40 hover:text-brand"
          >
            {c.name} ({c.products.length})
          </a>
        ))}
      </div>

      {total === 0 ? (
        <div className="rounded-[1.35rem] border border-white/[0.07] bg-ink-900/50 p-12 text-center text-white/40 shadow-card">
          No products yet. Add your first item to the catalogue.
        </div>
      ) : (
        categories.map((cat) => {
          if (cat.products.length === 0) return null;
          return (
            <section
              key={cat.id}
              id={`cat-${cat.slug}`}
              className="overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-ink-900/50 shadow-card"
            >
              <div className="border-b border-white/[0.06] px-5 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand/80">
                  {cat.name}
                </p>
                <p className="mt-0.5 text-sm text-white/45">
                  {cat.products.length} product
                  {cat.products.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="bg-white/[0.02] text-[11px] uppercase tracking-[0.14em] text-white/40">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Product</th>
                      <th className="px-5 py-3 font-semibold">Price</th>
                      <th className="px-5 py-3 font-semibold">
                        Colours / stock
                      </th>
                      <th className="px-5 py-3 font-semibold"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.products.map((p) => {
                      const product: Product & { categoryName: string } = {
                        id: p.id,
                        slug: p.slug,
                        name: p.name,
                        brand: p.brand ?? undefined,
                        categorySlug: cat.slug,
                        categoryName: cat.name,
                        price: p.price,
                        compareAtPrice: p.compareAtPrice ?? undefined,
                        images: p.images.map((i) => ({
                          url: i.url,
                          alt: i.alt,
                          variantId: i.variantId
                        })),
                        shortSpecs: [],
                        description: p.description,
                        stock: p.stock,
                        featured: p.featured,
                        hotDeal: p.hotDeal,
                        variants: p.variants.map((v) => ({
                          id: v.id,
                          name: v.name,
                          colorHex: v.colorHex ?? undefined,
                          quantity: v.quantity,
                          available: v.quantity > 0
                        }))
                      };
                      return <ProductRow key={p.id} product={product} />;
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
