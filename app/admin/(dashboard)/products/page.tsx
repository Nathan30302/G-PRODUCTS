import Link from "next/link";
import { prisma } from "@/lib/db";
import { AdminProductCard } from "@/components/admin/AdminProductCard";
import { Icon } from "@/components/Icons";
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
      <section className="relative overflow-hidden rounded-[1.75rem] border border-gp-border/70 bg-gp-surface p-6 shadow-card shadow-lit sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/35 to-transparent" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/25 blur-[80px]" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-accent-ink">
              Catalogue
            </p>
            <h1 className="display mt-2 text-[1.85rem] leading-[1.1] sm:text-4xl">
              Products
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-gp-text-muted">
              {total} item{total === 1 ? "" : "s"} across{" "}
              {categories.filter((c) => c.products.length > 0).length} categories.
              {shown !== total ? ` Showing ${shown}.` : " Tap a product to edit it."}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <span className="rounded-pill border border-gp-border bg-gp-muted/50 px-3 py-1.5 font-semibold text-gp-text-muted">
                {inStock} in stock
              </span>
              <span className="rounded-pill border border-gp-border bg-gp-muted/50 px-3 py-1.5 font-semibold text-gp-text-muted">
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

      {total > 0 ? (
        <form action="/admin/products" className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            name="q"
            defaultValue={rawQ}
            placeholder="Search by name or brand"
            className="min-h-11 w-full rounded-2xl border border-gp-border bg-gp-surface px-4 text-sm text-gp-text outline-none placeholder:text-gp-text-subtle focus:border-brand/70 focus:shadow-[0_0_0_4px_rgba(229,243,79,0.28)] sm:max-w-sm"
          />
          {stock !== "all" ? <input type="hidden" name="stock" value={stock} /> : null}
          <button
            type="submit"
            className="min-h-11 rounded-pill bg-ink-850 px-5 text-sm font-bold text-white hover:bg-ink-950"
          >
            Search
          </button>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {stockFilters.map((f) => {
              const active = stock === f.id;
              return (
                <Link
                  key={f.id}
                  href={filterHref(f.id)}
                  className={`shrink-0 rounded-pill border px-3.5 py-2 text-xs font-bold ${
                    active
                      ? "border-ink-850 bg-ink-850 text-white"
                      : "border-gp-border bg-gp-surface text-gp-text-muted hover:text-gp-text"
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
      ) : null}

      {total > 0 && shown > 0 && (
        <nav className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {visible.map((c) => (
              <a
                key={c.slug}
                href={`#cat-${c.slug}`}
                className="inline-flex shrink-0 items-center gap-2 rounded-pill border border-gp-border bg-gp-muted/50 px-4 py-2 text-xs font-semibold text-gp-text-muted transition-all hover:border-brand/40 hover:text-accent-ink"
              >
                <Icon name={c.icon} className="h-3.5 w-3.5 text-accent-ink/80" />
                {c.name}
                <span className="rounded-pill bg-gp-muted/50 px-1.5 py-0.5 text-[10px] tabular-nums">
                  {c.products.length}
                </span>
              </a>
            ))}
        </nav>
      )}

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
              <div className="mb-4 flex items-end justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand/10 text-accent-ink ring-1 ring-brand/20">
                    <Icon name={cat.icon} className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-gp-text">
                      {cat.name}
                    </h2>
                    <p className="mt-0.5 text-sm text-gp-text-subtle">{cat.tagline}</p>
                  </div>
                </div>
                <span className="hidden shrink-0 rounded-pill border border-gp-border bg-gp-muted/50 px-3 py-1.5 text-xs font-semibold text-gp-text-muted sm:inline">
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
