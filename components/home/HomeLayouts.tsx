import Link from "next/link";
import { Category } from "@/lib/types";
import { CategoryTile } from "@/components/CategoryTile";
import { ProductRail } from "@/components/ProductRail";
import { Icon } from "@/components/Icons";

type ServiceLink = { slug: string; name: string; tagline: string };

/** Laptop / desktop homepage — mobile keeps the original stacked layout. */
export function HomeDesktop({
  categories,
  hotDeals,
  featured,
  newest,
  services
}: {
  categories: Category[];
  hotDeals: Parameters<typeof ProductRail>[0]["products"];
  featured: Parameters<typeof ProductRail>[0]["products"];
  newest: Parameters<typeof ProductRail>[0]["products"];
  services: ServiceLink[];
}) {
  return (
    <div className="hidden lg:block">
      {/* Compact hero — not full-screen on laptop */}
      <section className="relative border-b border-white/[0.06] bg-gradient-to-b from-ink-900/80 to-ink-950 py-10">
        <div className="container-g flex items-center justify-between gap-10">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-brand">
              G-Products · UNZA
            </p>
            <h1 className="display mt-2 text-4xl text-brand">
              Heart Gladdening Products
            </h1>
            <p className="mt-3 text-base text-white/55">
              Stationery, electronics, chargers and services — organised so you
              find what you need fast.
            </p>
            <div className="mt-6 flex gap-3">
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

      <div className="container-g py-12">
        <div className="grid grid-cols-12 gap-10">
          {/* Categories sidebar */}
          <aside className="col-span-3">
            <p className="eyebrow">Browse</p>
            <h2 className="display mt-2 text-2xl">Shop by category</h2>
            <p className="mt-2 text-sm text-white/45">
              Jump straight to what you need.
            </p>
            <nav className="mt-6 space-y-2">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm font-semibold text-white/75 transition-colors hover:border-brand/35 hover:text-white"
                >
                  <span>{c.name}</span>
                  <Icon name="chevron-right" className="h-4 w-4 text-white/30" />
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
          </aside>

          {/* Product sections */}
          <div className="col-span-9 space-y-12">
            <ProductRail
              title="Hot Deals of the Week"
              subtitle="Smart picks at better prices."
              products={hotDeals}
              href="/search"
              hrefLabel="View all deals"
              accent="accent"
              className="!mt-0"
            />
            <ProductRail
              title="Our Bestsellers"
              subtitle="Popular items from G-Products."
              products={featured}
              href="/search"
              hrefLabel="View all"
              className="!mt-0"
            />
            <ProductRail
              title="Fresh Arrivals"
              subtitle="Browse the latest from our catalogue."
              products={newest}
              href="/search"
              hrefLabel="View all"
              className="!mt-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Mobile / tablet — unchanged stacked homepage sections. */
export function HomeMobileSections({
  categories,
  hotDeals,
  featured,
  newest
}: {
  categories: Category[];
  hotDeals: Parameters<typeof ProductRail>[0]["products"];
  featured: Parameters<typeof ProductRail>[0]["products"];
  newest: Parameters<typeof ProductRail>[0]["products"];
}) {
  return (
    <div className="lg:hidden">
      <section className="container-g mt-16 sm:mt-20">
        <div className="mb-8">
          <p className="eyebrow">Browse</p>
          <h2 className="display mt-2 text-2xl sm:text-3xl">Shop by category</h2>
          <p className="mt-2 text-sm text-white/50">
            Stationery, storage, chargers, audio and more.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {categories.map((c) => (
            <CategoryTile key={c.slug} category={c} />
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
