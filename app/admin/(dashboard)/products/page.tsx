import Link from "next/link";
import { prisma } from "@/lib/db";
import { AdminProductCard } from "@/components/admin/AdminProductCard";
import { Icon } from "@/components/Icons";
import { Product } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Products" };

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
  const inStock = categories.reduce(
    (n, c) =>
      n +
      c.products.filter((p) => p.variants.some((v) => v.quantity > 0)).length,
    0
  );

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[1.85rem] border border-white/[0.07] bg-gradient-to-br from-ink-850 via-ink-900 to-ink-950 p-6 shadow-card sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/15 blur-[80px]" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-brand">
              Catalogue
            </p>
            <h1 className="display mt-2 text-3xl sm:text-4xl">Products</h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/55">
              {total} item{total === 1 ? "" : "s"} across{" "}
              {categories.filter((c) => c.products.length > 0).length} categories
              · tap Edit to update prices, colours, and photos.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <span className="rounded-pill border border-white/10 bg-white/[0.03] px-3 py-1.5 font-semibold text-white/70">
                {inStock} in stock
              </span>
              <span className="rounded-pill border border-white/10 bg-white/[0.03] px-3 py-1.5 font-semibold text-white/70">
                {total - inStock} sold out
              </span>
            </div>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-pill bg-brand px-6 py-3 text-sm font-bold text-ink-950 shadow-brand-glow transition-all duration-200 ease-out-expo hover:bg-brand-soft hover:-translate-y-0.5"
          >
            <Icon name="plus" className="h-4 w-4" />
            Add product
          </Link>
        </div>
      </section>

      {total > 0 && (
        <nav className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories
            .filter((c) => c.products.length > 0)
            .map((c) => (
              <a
                key={c.slug}
                href={`#cat-${c.slug}`}
                className="inline-flex shrink-0 items-center gap-2 rounded-pill border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-white/60 transition-all hover:border-brand/40 hover:text-brand"
              >
                <Icon name={c.icon} className="h-3.5 w-3.5 text-brand/80" />
                {c.name}
                <span className="rounded-pill bg-white/[0.06] px-1.5 py-0.5 text-[10px] tabular-nums">
                  {c.products.length}
                </span>
              </a>
            ))}
        </nav>
      )}

      {total === 0 ? (
        <div className="rounded-[1.85rem] border border-dashed border-white/10 bg-ink-900/40 px-8 py-16 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand/10 text-brand">
            <Icon name="plus-circle" className="h-8 w-8" />
          </div>
          <p className="mt-5 text-lg font-bold text-white">No products yet</p>
          <p className="mt-2 text-sm text-white/45">
            Add your first item — name, price, category, and photos per colour.
          </p>
          <Link
            href="/admin/products/new"
            className="mt-6 inline-flex rounded-pill bg-brand px-6 py-3 text-sm font-bold text-ink-950 shadow-brand-glow"
          >
            Add first product
          </Link>
        </div>
      ) : (
        categories.map((cat) => {
          if (cat.products.length === 0) return null;
          return (
            <section key={cat.id} id={`cat-${cat.slug}`} className="scroll-mt-28">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/20">
                    <Icon name={cat.icon} className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-white">
                      {cat.name}
                    </h2>
                    <p className="mt-0.5 text-sm text-white/45">{cat.tagline}</p>
                  </div>
                </div>
                <span className="hidden shrink-0 rounded-pill border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-white/50 sm:inline">
                  {cat.products.length} product{cat.products.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {cat.products.map((p) => {
                  const product: Product & {
                    categoryName: string;
                    slug: string;
                  } = {
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
                  return <AdminProductCard key={p.id} product={product} />;
                })}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
