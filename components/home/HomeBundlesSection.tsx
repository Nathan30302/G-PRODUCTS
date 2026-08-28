import Link from "next/link";
import { bundles } from "@/lib/bundles";
import type { Product } from "@/lib/types";
import { BundleCard } from "@/components/bundles/BundleCard";
import { ShopSectionHeader } from "@/components/shop/ui";
import { Icon } from "@/components/Icons";

/** Curated packs on the homepage — same cards as /bundles, limited to two. */
export function HomeBundlesSection({ products }: { products: Product[] }) {
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const featured = bundles.slice(0, 2);

  return (
    <section className="container-g mt-14 sm:mt-16">
      <ShopSectionHeader
        eyebrow="Save with packs"
        title="Bundles & packs"
        subtitle="Student, phone and laptop essentials — add a curated set in one tap."
        action={
          <Link
            href="/bundles"
            className="hidden shrink-0 items-center gap-1 rounded-pill border border-white/10 bg-white/[0.02] px-4 py-2 text-sm font-semibold text-brand transition-colors hover:border-brand/35 sm:inline-flex"
          >
            View all
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        }
      />
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {featured.map((b) => (
          <BundleCard key={b.slug} bundle={b} productsBySlug={bySlug} />
        ))}
      </div>
      <div className="mt-5 sm:hidden">
        <Link
          href="/bundles"
          className="flex min-h-11 items-center justify-center gap-1 rounded-pill border border-white/10 bg-white/[0.02] px-4 py-3 text-sm font-semibold text-brand"
        >
          View all packs
          <Icon name="arrow-right" className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
