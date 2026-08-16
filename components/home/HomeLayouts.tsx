import Link from "next/link";
import { Category, Product } from "@/lib/types";
import { CategoryTile } from "@/components/CategoryTile";
import { ProductRail } from "@/components/ProductRail";
import { Icon } from "@/components/Icons";

type ServiceLink = { slug: string; name: string; tagline: string };

function coverByCategory(products: Product[]) {
  const map = new Map<string, string>();
  for (const p of products) {
    if (map.has(p.categorySlug)) continue;
    const url = p.images[0]?.url;
    if (url) map.set(p.categorySlug, url);
  }
  return map;
}

/** Laptop / desktop homepage — mobile keeps the original stacked layout. */
export function HomeDesktop({
  categories,
  hotDeals,
  featured,
  newest,
  services,
  allProducts = []
}: {
  categories: Category[];
  hotDeals: Product[];
  featured: Product[];
  newest: Product[];
  services: ServiceLink[];
  allProducts?: Product[];
}) {
  return (
    <div className="hidden lg:block">
      <section className="relative border-b border-white/[0.06] bg-gradient-to-b from-ink-900/80 to-ink-950 py-10">
        <div className="container-g flex items-center justify-between gap-10">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-brand">
              G-Products
            </p>
            <h1 className="display mt-2 text-4xl text-brand">
              Heart Gladdening Products
            </h1>
            <p className="mt-3 text-base text-white/55">
              Stationery, electronics, chargers and services — organised so you
              find what you need fast.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/search" className="btn-brand px-6 py-3 text-sm">
                Shop catalogue
                <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="rounded-pill border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white/80 hover:border-brand/40"
              >
                Services
              </Link>
            </div>
          </div>
          <div className="grid max-w-md shrink-0 grid-cols-3 gap-2">
            {services.slice(0, 3).map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 transition-colors hover:border-brand/35"
              >
                <p className="text-xs font-bold text-white">{s.name}</p>
                <p className="mt-1 line-clamp-2 text-[11px] text-white/40">
                  {s.tagline}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container-g py-10 xl:py-12">
        <div className="flex gap-8 xl:gap-10">
          <aside className="w-[220px] shrink-0 xl:w-[240px]">
            <div className="sticky top-28 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <Link
                href="/"
                className="mb-5 flex items-center gap-2 rounded-xl bg-brand/10 px-3 py-2.5 text-sm font-bold text-brand transition-colors hover:bg-brand/15"
              >
                <Icon name="home" className="h-4 w-4" />
                Home
              </Link>

              <p className="eyebrow">Browse</p>
              <h2 className="display mt-2 text-xl">Shop by category</h2>
              <p className="mt-2 text-sm text-white/45">
                Tap a category to open it.
              </p>
              <nav className="mt-5 space-y-1.5">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/category/${c.slug}`}
                    className="flex items-center justify-between rounded-xl border border-transparent px-3 py-2.5 text-sm font-semibold text-white/75 transition-colors hover:border-brand/30 hover:bg-white/[0.03] hover:text-white"
                  >
                    <span>{c.name}</span>
                    <Icon
                      name="chevron-right"
                      className="h-4 w-4 shrink-0 text-white/25"
                    />
                  </Link>
                ))}
              </nav>
              <Link
                href="/search"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
              >
                Full catalogue
                <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            </div>
          </aside>

          <div className="min-w-0 flex-1 space-y-12">
            <ProductRail
              title="Hot Deals of the Week"
              subtitle="Smart picks at better prices."
              products={hotDeals}
              href="/search"
              hrefLabel="View all deals"
              accent="accent"
              className="!mt-0"
              embedded
            />
            <ProductRail
              title="Our Bestsellers"
              subtitle="Popular items from G-Products."
              products={featured}
              href="/search"
              hrefLabel="View all"
              className="!mt-0"
              embedded
            />
            <ProductRail
              title="Fresh Arrivals"
              subtitle="Browse the latest from our catalogue."
              products={newest}
              href="/search"
              hrefLabel="View all"
              className="!mt-0"
              embedded
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Mobile / tablet — Plug-inspired category grid + product rails. */
export function HomeMobileSections({
  categories,
  hotDeals,
  featured,
  newest,
  allProducts = []
}: {
  categories: Category[];
  hotDeals: Product[];
  featured: Product[];
  newest: Product[];
  allProducts?: Product[];
}) {
  const covers = coverByCategory(allProducts);

  return (
    <div className="lg:hidden">
      <section className="container-g mt-10 sm:mt-14">
        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
            Trusted by many, loved by all
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Explore our top picks
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5">
          {categories.map((c) => (
            <CategoryTile
              key={c.slug}
              category={c}
              imageUrl={covers.get(c.slug)}
            />
          ))}
        </div>
      </section>

      <ProductRail
        title="Hot Deals of the Week"
        subtitle="Smart picks at better prices."
        products={hotDeals}
        href="/search"
        hrefLabel="View all"
        accent="accent"
      />
      <ProductRail
        title="Our Bestsellers"
        subtitle="Popular items from G-Products."
        products={featured}
        href="/search"
        hrefLabel="View all"
      />
      <ProductRail
        title="Fresh Arrivals"
        subtitle="Browse the latest from our catalogue."
        products={newest}
        href="/search"
        hrefLabel="View all"
      />
    </div>
  );
}
