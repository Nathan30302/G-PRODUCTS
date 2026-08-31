import type { Metadata } from "next";
import Link from "next/link";
import { bundles } from "@/lib/bundles";
import { getAllProducts } from "@/lib/queries";
import { BundleCard } from "@/components/bundles/BundleCard";
import { CampusBanner } from "@/components/shared/CampusBanner";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bundles & packs",
  description: `Save with curated G-Products bundles — student, phone, laptop and printing packs in ${siteConfig.deliveryArea}.`
};

export default async function BundlesPage() {
  const products = await getAllProducts();
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const featured = bundles.find((b) => b.badge === "Campus favourite");
  const rest = bundles.filter((b) => b.slug !== featured?.slug);

  return (
    <div className="container-g py-8 pb-12 sm:py-10 sm:pb-16">
      <nav className="text-sm text-gp-text-subtle">
        <Link href="/" className="hover:text-gp-text">
          Home
        </Link>{" "}
        / <span className="text-gp-text-muted">Campus packs</span>
      </nav>

      <header className="mt-5">
        <CampusBanner
          eyebrow="Campus packs"
          title="Packs that just make sense"
          description="Add a whole set to your cart in one tap. Adjust quantities in the cart before checkout — or ask on WhatsApp if you need a custom mix."
          footnote={`${bundles.length} curated packs · tap any card to see what's inside`}
          bullets={[
            { icon: "cart", text: "One-tap add to cart" },
            { icon: "star", text: "Curated for campus life" },
            { icon: "whatsapp", text: "Custom mix on WhatsApp" }
          ]}
        />
      </header>

      {featured ? (
        <section className="mt-10">
          <p className="section-label">Featured</p>
          <h2 className="display heading-section mt-2">Most popular on campus</h2>
          <div className="mt-5 max-w-xl">
            <BundleCard
              bundle={featured}
              productsBySlug={bySlug}
              featured
            />
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <p className="section-label">All packs</p>
        <h2 className="display heading-section mt-2">Choose your bundle</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {rest.map((b) => (
            <BundleCard key={b.slug} bundle={b} productsBySlug={bySlug} />
          ))}
        </div>
      </section>

      <p className="mt-10 text-center text-sm text-gp-text-subtle">
        Prefer to build your own?{" "}
        <Link href="/search" className="font-semibold text-ink-700 hover:underline">
          Browse the catalogue
        </Link>{" "}
        or{" "}
        <Link
          href="/services/printing"
          className="font-semibold text-ink-700 hover:underline"
        >
          Upload &amp; Print
        </Link>
        .
      </p>
    </div>
  );
}
