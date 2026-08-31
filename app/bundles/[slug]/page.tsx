import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bundles, getBundle } from "@/lib/bundles";
import { getAllProducts } from "@/lib/queries";
import { BundleDetailClient } from "@/components/bundles/BundleDetailClient";
import { CampusBannerShell } from "@/components/shared/CampusBanner";
import { formatPrice } from "@/lib/format";
import { bundleLineTotal } from "@/lib/bundles";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const bundle = getBundle(slug);
  if (!bundle) return { title: "Pack" };
  return {
    title: bundle.name,
    description: bundle.description
  };
}

export default async function BundleDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bundle = getBundle(slug);
  if (!bundle) notFound();

  const products = await getAllProducts();
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const { total, missing } = bundleLineTotal(bundle, bySlug);
  const ready = missing.length === 0;

  return (
    <div className="container-g py-8 pb-32 sm:py-10 lg:pb-16">
      <nav className="text-sm text-gp-text-subtle">
        <Link href="/" className="hover:text-gp-text">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/bundles" className="hover:text-gp-text">
          Campus packs
        </Link>{" "}
        / <span className="text-gp-text-muted">{bundle.name}</span>
      </nav>

      <header className="mt-5">
        <CampusBannerShell>
          <div className="px-5 py-7 sm:px-8 sm:py-9">
            {bundle.badge ? (
              <span className="rounded-pill bg-accent px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-950 shadow-sm">
                {bundle.badge}
              </span>
            ) : (
              <span className="rounded-pill bg-brand px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-950 shadow-sm">
                Campus pack
              </span>
            )}
            <h1 className="display mt-3 text-[clamp(1.35rem,1rem+1.4vw,2rem)] font-extrabold leading-snug text-white">
              {bundle.name}
            </h1>
            <p className="mt-2 max-w-xl text-sm font-medium text-brand sm:text-base">
              {bundle.tagline}
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
              {bundle.description}
            </p>
            <p className="mt-5 text-2xl font-extrabold tabular-nums text-white sm:text-3xl">
              {ready ? formatPrice(total) : "—"}
              <span className="ml-2 text-sm font-medium text-white/55">
                pack total
              </span>
            </p>
          </div>
        </CampusBannerShell>
      </header>

      <BundleDetailClient bundle={bundle} productsBySlug={bySlug} />
    </div>
  );
}
