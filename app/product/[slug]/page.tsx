import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getProductBySlug,
  getProductsByCategory,
  getCategoryBySlug
} from "@/lib/queries";
import { formatPrice, discountPercent } from "@/lib/format";
import { StockBadge } from "@/components/StockBadge";
import { ProductActions } from "@/components/ProductActions";
import { ProductGallery } from "@/components/ProductGallery";
import { MobileBuyBar } from "@/components/MobileBuyBar";
import { ProductRail } from "@/components/ProductRail";
import { Icon } from "@/components/Icons";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.map((i) => ({ url: i.url })),
      type: "website"
    }
  };
}

const trust = [
  { icon: "shield", label: "Genuine product" },
  { icon: "wallet", label: "Mobile Money" },
  { icon: "truck", label: "Fast delivery" }
];

function ProductHeading({
  product,
  off,
  saved
}: {
  product: Product;
  off: number | null;
  saved: number;
}) {
  return (
    <>
      {product.brand ? (
        <span className="text-sm font-semibold uppercase tracking-wide text-brand/80">
          {product.brand}
        </span>
      ) : null}
      <h1 className="mt-1.5 text-[1.65rem] font-black leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
        {product.name}
      </h1>

      <div className="mt-4 flex flex-wrap items-end gap-x-3 gap-y-2">
        <span className="text-3xl font-black tracking-tight text-white sm:text-4xl">
          {formatPrice(product.price)}
        </span>
        {product.compareAtPrice ? (
          <span className="pb-1 text-base text-white/35 line-through sm:text-lg">
            {formatPrice(product.compareAtPrice)}
          </span>
        ) : null}
        {off ? (
          <span className="mb-0.5 rounded-pill bg-brand px-2.5 py-1 text-[11px] font-extrabold text-ink-950">
            Save {off}%
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2.5">
        <StockBadge status={product.stock} />
        {saved > 0 ? (
          <span className="text-xs font-medium text-white/45">
            You save {formatPrice(saved)}
          </span>
        ) : null}
      </div>
    </>
  );
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [category, categoryProducts] = await Promise.all([
    getCategoryBySlug(product.categorySlug),
    getProductsByCategory(product.categorySlug)
  ]);
  const off = discountPercent(product.price, product.compareAtPrice);
  const saved = product.compareAtPrice
    ? product.compareAtPrice - product.price
    : 0;
  const related = categoryProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 8);

  return (
    <div className="pb-24 md:pb-0">
      <div className="container-g py-6 sm:py-10">
        <nav className="flex flex-wrap items-center gap-1.5 text-sm text-white/40">
          <Link href="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <Icon name="chevron-right" className="h-3.5 w-3.5" />
          {category && (
            <>
              <Link
                href={`/category/${category.slug}`}
                className="transition-colors hover:text-white"
              >
                {category.name}
              </Link>
              <Icon name="chevron-right" className="h-3.5 w-3.5" />
            </>
          )}
          <span className="truncate text-white/70">{product.name}</span>
        </nav>

        {/* Mobile: title → gallery → buy (Plug order). Desktop: gallery | details */}
        <div className="mt-5 grid gap-6 lg:mt-6 lg:grid-cols-2 lg:gap-12">
          <div className="lg:hidden">
            <ProductHeading product={product} off={off} saved={saved} />
          </div>

          <div className="order-2 lg:order-1">
            <ProductGallery
              images={product.images}
              name={product.name}
              badge={off ? `-${off}%` : null}
            />
          </div>

          <div className="order-3 space-y-6 lg:order-2 lg:py-1">
            <div className="hidden lg:block">
              <ProductHeading product={product} off={off} saved={saved} />
            </div>

            <div className="max-w-md">
              <ProductActions product={product} />
            </div>

            <p className="leading-relaxed text-white/60">{product.description}</p>

            <div className="grid grid-cols-3 gap-2.5">
              {trust.map((t) => (
                <div
                  key={t.label}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-white/[0.06] bg-ink-850/50 px-2 py-3 text-center"
                >
                  <Icon name={t.icon} className="h-5 w-5 text-brand" />
                  <span className="text-[10px] font-medium leading-tight text-white/55 sm:text-[11px]">
                    {t.label}
                  </span>
                </div>
              ))}
            </div>

            {product.shortSpecs.length > 0 && (
              <div>
                <h2 className="text-base font-bold text-white sm:text-lg">
                  Specifications
                </h2>
                <dl className="mt-3 overflow-hidden rounded-[1.1rem] border border-white/[0.06]">
                  {product.shortSpecs.map((s, i) => (
                    <div
                      key={s}
                      className={`flex items-start gap-3 px-4 py-3 text-sm ${
                        i % 2 === 0 ? "bg-ink-850/60" : "bg-transparent"
                      }`}
                    >
                      <Icon
                        name="check"
                        className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                      />
                      <span className="text-white/75">{s}</span>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <ProductRail
          title="Related products"
          subtitle={`More from ${category?.name ?? "the shop"}.`}
          products={related}
          href={category ? `/category/${category.slug}` : "/search"}
        />
      )}

      <div className="h-16" />

      <MobileBuyBar product={product} />
    </div>
  );
}
