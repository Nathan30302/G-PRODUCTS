import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice, discountPercent } from "@/lib/format";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductCardMedia } from "@/components/ProductCardMedia";
import { Icon } from "@/components/Icons";

export function ProductCard({
  product,
  priority = false
}: {
  product: Product;
  priority?: boolean;
}) {
  const off = discountPercent(product.price, product.compareAtPrice);
  const soldOut = product.stock === "sold_out";
  const isDeal = product.hotDeal || Boolean(off);
  const primary =
    product.variants.find((v) => v.available) ?? product.variants[0] ?? null;
  const colorLabel =
    primary && primary.name.toLowerCase() !== "standard" ? primary.name : null;
  const dealLabel = isDeal
    ? off
      ? `-${off}%`
      : "Deal"
    : null;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[1.2rem] border border-white/[0.08] bg-ink-900/90 transition-all duration-500 ease-out-expo hover:border-brand/30 hover:bg-ink-850/95">
      <ProductCardMedia
        href={`/product/${product.slug}`}
        images={product.images}
        name={product.name}
        soldOut={soldOut}
        priority={priority}
        dealLabel={dealLabel}
      />

      <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5 sm:px-3.5 sm:pb-3.5">
        {/* Brand + soft trust row — Plug bestsellers pattern */}
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[11px] font-medium text-white/40">
            {product.brand ?? "G-Products"}
          </span>
          {product.stock === "in_stock" ? (
            <span className="inline-flex shrink-0 items-center gap-0.5 text-[11px] font-semibold text-accent">
              <Icon name="check" className="h-3 w-3" />
              In stock
            </span>
          ) : product.stock === "low_stock" ? (
            <span className="shrink-0 text-[11px] font-semibold text-brand">
              Low stock
            </span>
          ) : (
            <span className="shrink-0 text-[11px] font-medium text-white/35">
              Sold out
            </span>
          )}
        </div>

        <Link href={`/product/${product.slug}`} className="mt-1.5 block">
          <h3 className="line-clamp-2 text-[13px] font-bold leading-snug text-white">
            {product.name}
            {colorLabel ? (
              <span className="font-semibold text-white/50"> {colorLabel}</span>
            ) : null}
          </h3>
        </Link>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <span className="text-[12px] font-medium text-white/40">From</span>
          <span className="text-[15px] font-extrabold tracking-tight text-white">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice ? (
            <span className="text-[12px] text-white/30 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          ) : null}
        </div>

        {product.variants.filter((v) => v.name.toLowerCase() !== "standard")
          .length > 0 ? (
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {product.variants
              .filter((v) => v.name.toLowerCase() !== "standard")
              .slice(0, 6)
              .map((v) => {
                const selected = primary?.id === v.id;
                return (
                  <span
                    key={v.id}
                    title={v.name}
                    className={`h-3.5 w-3.5 rounded-full ${
                      selected
                        ? "ring-[1.5px] ring-white ring-offset-[2px] ring-offset-ink-900"
                        : "ring-1 ring-white/15"
                    } ${v.available ? "" : "opacity-30 grayscale"}`}
                    style={{ backgroundColor: v.colorHex || "#6b7280" }}
                  />
                );
              })}
          </div>
        ) : null}

        <div className="mt-auto pt-3">
          <AddToCartButton product={product} compact requireOptions />
        </div>
      </div>
    </div>
  );
}
