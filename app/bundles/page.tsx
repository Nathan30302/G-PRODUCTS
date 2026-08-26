import type { Metadata } from "next";
import Link from "next/link";
import { bundles } from "@/lib/bundles";
import { getAllProducts } from "@/lib/queries";
import { BundleCard } from "@/components/bundles/BundleCard";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bundles & packs",
  description: `Save with curated G-Products bundles — student, phone, laptop and printing packs in ${siteConfig.deliveryArea}.`
};

export default async function BundlesPage() {
  const products = await getAllProducts();
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  return (
    <div className="container-g py-10 sm:py-14">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
          Bundles
        </p>
        <h1 className="mt-2 display heading-page">
          Packs that just make sense
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/55 sm:text-base">
          Add a whole set to your cart in one tap. Adjust quantities in the cart
          before checkout — or ask on WhatsApp if you need a custom mix.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {bundles.map((b) => (
          <BundleCard key={b.slug} bundle={b} productsBySlug={bySlug} />
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-white/45">
        Prefer to build your own?{" "}
        <Link href="/search" className="font-semibold text-brand hover:underline">
          Browse the catalogue
        </Link>{" "}
        or{" "}
        <Link
          href="/services/printing"
          className="font-semibold text-brand hover:underline"
        >
          Upload &amp; Print
        </Link>
        .
      </p>
    </div>
  );
}
