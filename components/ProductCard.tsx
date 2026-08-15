import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice, discountPercent } from "@/lib/format";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductCardMedia } from "@/components/ProductCardMedia";

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
  const colorLabel = primary?.name;
  const dealLabel = isDeal
    ? off
      ? `Deal · -${off}%`
      : "Deal of the week"
    : null;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[1.15rem] border border-white/[0.07] bg-ink-900/85 transition-all duration-500 ease-out-expo hover:border-brand/25 hover:bg-ink-850/90">
      <ProductCardMedia
        href={`/product/${product.slug}`}
        images={product.images}
        name={product.name}
        soldOut={soldOut}
        priority={priority}
        dealLabel={dealLabel}
      />

      <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5 sm:px-3.5 sm:pb-3.5 sm:pt-3">
        <div className="flex items-start justify-between gap-2">
          <span className="truncate text-[10px] font-medium uppercase tracking-wide text-white/40 sm:text-[11px]">
            {product.brand ?? "G-Products"}
          </span>
          {product.stock === "in_stock" ? (
            <span className="shrink-0 text-[10px] font-medium text-accent sm:text-[11px]">
              In stock
            </span>
          ) : product.stock === "low_stock" ? (
            <span className="shrink-0 text-[10px] font-medium text-brand sm:text-[11px]">
              Low stock
            </span>
          ) : (
            <span className="shrink-0 text-[10px] font-medium text-white/35 sm:text-[11px]">
              Sold out
            </span>
          )}
        </div>

        <Link href={`/product/${product.slug}`} className="mt-1 block">
          <h3 className="line-clamp-2 text-[12px] font-bold leading-snug text-white sm:text-[13px]">
            {product.name}
            {colorLabel ? (
              <span className="font-semibold text-white/55"> {colorLabel}</span>
            ) : null}
          </h3>
        </Link>

        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <span className="text-[11px] font-medium text-white/40 sm:text-[12px]">
            From
          </span>
          <span className="text-[14px] font-extrabold tracking-tight text-white sm:text-[15px]">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice ? (
            <span className="text-[11px] text-white/30 line-through sm:text-[12px]">
              {formatPrice(product.compareAtPrice)}
            </span>
          ) : null}
        </div>

        {product.variants.length > 0 ? (
          <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:mt-2.5 sm:gap-2">
            {product.variants.slice(0, 6).map((v) => {
              const selected = primary?.id === v.id;
              return (
                <span
                  key={v.id}
                  title={v.name}
                  className={`h-3.5 w-3.5 rounded-full sm:h-4 sm:w-4 ${
                    selected
                      ? "ring-[1.5px] ring-white ring-offset-[2px] ring-offset-ink-900"
                      : "ring-1 ring-white/15"
                  } ${v.available ? "" : "opacity-30 grayscale"}`}
                  style={{ backgroundColor: v.colorHex || "#6b7280" }}
                />
              );
            })}
            {product.variants.length > 6 ? (
              <span className="text-[10px] text-white/35">
                +{product.variants.length - 6}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="mt-auto pt-2.5 sm:pt-3">
          <AddToCartButton product={product} compact requireOptions />
        </div>
      </div>
    </div>
  );
}
