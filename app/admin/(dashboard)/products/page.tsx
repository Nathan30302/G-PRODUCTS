import Link from "next/link";
import { prisma } from "@/lib/db";
import { AdminProductCard } from "@/components/admin/AdminProductCard";
import { Icon } from "@/components/Icons";
import { DeskPageHeader } from "@/components/admin/desk";
import { Product } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Products" };

export default async function AdminProducts({
  searchParams
}: {
  searchParams: Promise<{ q?: string; stock?: string }>;
}) {
  const { q: rawQ = "", stock: rawStock = "all" } = await searchParams;
  const q = rawQ.trim().toLowerCase();
  const stock =
    rawStock === "in" ||
    rawStock === "low" ||
    rawStock === "out" ||
    rawStock === "attention"
      ? rawStock
      : "all";

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

  function unitsOf(p: { variants: { quantity: number }[] }) {
    return p.variants.reduce((n, v) => n + v.quantity, 0);
  }

  function keep(p: {
    name: string;
    brand: string | null;
    variants: { quantity: number }[];
  }) {
    if (q) {
      const hay = `${p.name} ${p.brand ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    const units = unitsOf(p);
    if (stock === "in") return units > 5;
    if (stock === "low") return units > 0 && units <= 5;
    if (stock === "out") return units <= 0;
    if (stock === "attention") return units <= 5;
    return true;
  }

  const visible = categories
    .map((c) => ({ ...c, products: c.products.filter(keep) }))
    .filter((c) => c.products.length > 0);
  const shown = visible.reduce((n, c) => n + c.products.length, 0);
  const inStock = categories.reduce(
    (n, c) => n + c.products.filter((p) => unitsOf(p) > 0).length,
    0
  );

  function filterHref(nextStock: string) {
    const params = new URLSearchParams();
    if (rawQ.trim()) params.set("q", rawQ.trim());
    if (nextStock !== "all") params.set("stock", nextStock);
    const s = params.toString();
    return s ? `/admin/products?${s}` : "/admin/products";
  }

  const stockFilters = [
    { id: "all", label: "All" },
    { id: "in", label: "In stock" },
    { id: "low", label: "Low stock" },
    { id: "out", label: "Out of stock" }
  ] as const;

  return (
    <div className="space-y-8">
      <DeskPageHeader
        eyebrow="Catalogue"
        title="Products"
        description={
          <>
            {total} item{total === 1 ? "" : "s"} · {inStock} in stock ·{" "}
            {total - inStock} sold out.
            {shown !== total ? ` Showing ${shown}.` : " Tap a product to edit it."}
          </>
        }
        actions={
          <Link
            href="/admin/products/new"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-pill bg-brand px-6 py-3 text-sm font-bold text-ink-950 shadow-brand-glow transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:bg-brand-soft"
          >
            <Icon name="plus" className="h-4 w-4" />
            Add product
          </Link>
        }
      />

      {total > 0 ? (
        <div className="rounded-[1.35rem] border border-gp-border/80 bg-gp-surface p-4 shadow-card sm:p-5">
          <form action="/admin/products" className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <input
              name="q"
              defaultValue={rawQ}
              placeholder="Search by name or brand"
              className="min-h-11 w-full rounded-2xl border border-gp-border bg-gp-bg px-4 text-sm text-gp-text outline-none placeholder:text-gp-text-subtle focus:border-brand/70 focus:shadow-[0_0_0_4px_rgba(229,243,79,0.28)] lg:max-w-sm"
            />
            {stock !== "all" ? (
              <input type="hidden" name="stock" value={stock} />
            ) : null}
            <button
              type="submit"
              className="min-h-11 rounded-pill bg-ink-850 px-5 text-sm font-bold text-white hover:bg-ink-950"
            >
              Search
            </button>
            <div className="flex gap-2 overflow-x-auto no-scrollbar lg:ml-auto">
              {stockFilters.map((f) => {
                const active = stock === f.id;
                return (
                  <Link
                    key={f.id}
                    href={filterHref(f.id)}
                    className={`shrink-0 rounded-pill border px-3.5 py-2 text-xs font-bold ${
                      active
                        ? "border-ink-850 bg-ink-850 text-white"
                        : "border-gp-border bg-gp-bg text-gp-text-muted hover:text-gp-text"
                    }`}
                  >
                    {f.label}
                  </Link>
                );
              })}
              {stock === "attention" ? (
                <span className="shrink-0 rounded-pill border border-ink-850 bg-ink-850 px-3.5 py-2 text-xs font-bold text-white">
                  Needs restock
                </span>
              ) : null}
            </div>
          </form>
          {shown > 0 ? (
            <nav className="mt-4 flex gap-2 overflow-x-auto border-t border-gp-border/70 pt-4 no-scrollbar">
              {visible.map((c) => (
                <a
                  key={c.slug}
                  href={`#cat-${c.slug}`}
                  className="inline-flex shrink-0 items-center gap-2 rounded-pill px-3 py-1.5 text-xs font-semibold text-gp-text-muted transition-colors hover:bg-gp-muted hover:text-gp-text"
                >
                  <Icon name={c.icon} className="h-3.5 w-3.5 text-ink-700" />
                  {c.name}
                  <span className="tabular-nums text-gp-text-subtle">
                    {c.products.length}
                  </span>
                </a>
              ))}
            </nav>
          ) : null}
        </div>
      ) : null}

      {total === 0 ? (
        <div className="rounded-[1.85rem] border border-dashed border-gp-border bg-gp-surface px-8 py-16 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand/10 text-accent-ink">
            <Icon name="plus-circle" className="h-8 w-8" />
          </div>
          <p className="mt-5 text-lg font-bold text-gp-text">No products yet</p>
          <p className="mt-2 text-sm text-gp-text-subtle">
            Add your first item — name, price, category, and photos per colour.
          </p>
          <Link
            href="/admin/products/new"
            className="mt-6 inline-flex rounded-pill bg-brand px-6 py-3 text-sm font-bold text-ink-950 shadow-brand-glow"
          >
            Add first product
          </Link>
        </div>
      ) : shown === 0 ? (
        <div className="rounded-[1.85rem] border border-dashed border-gp-border bg-gp-surface px-8 py-16 text-center">
          <p className="text-lg font-bold text-gp-text">No products found</p>
          <p className="mt-2 text-sm text-gp-text-subtle">
            Try a different search or stock filter.
          </p>
          <Link
            href="/admin/products"
            className="mt-6 inline-flex rounded-pill bg-ink-850 px-6 py-3 text-sm font-bold text-white"
          >
            Clear filters
          </Link>
        </div>
      ) : (
        visible.map((cat) => {
          if (cat.products.length === 0) return null;
          return (
            <section key={cat.id} id={`cat-${cat.slug}`} className="scroll-mt-28">
              <div className="mb-5 flex items-end justify-between gap-4 border-b border-gp-border/70 pb-3">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-gp-text sm:text-xl">
                    {cat.name}
                  </h2>
                  <p className="mt-1 text-sm text-gp-text-muted">{cat.tagline}</p>
                </div>
                <span className="shrink-0 text-xs font-semibold tabular-nums text-gp-text-subtle">
                  {cat.products.length}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 min-[560px]:grid-cols-2 xl:grid-cols-3">
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
                      price: v.price ?? undefined,
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
