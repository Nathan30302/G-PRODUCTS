import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice, discountPercent } from "@/lib/format";
import { AddToCartButton } from "@/components/AddToCartButton";
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
  const colorLabel = primary?.name;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-ink-900/85 transition-all duration-500 ease-out-expo hover:border-brand/25 hover:bg-ink-850/90">
      <Link
        href={`/product/${product.slug}`}
        className="relative block overflow-hidden"
      >
        <div className="relative aspect-square bg-[radial-gradient(ellipse_at_center,_#123b43_0%,_#06181c_70%)]">
          <Image
            src={product.images[0]?.url}
            alt={product.images[0]?.alt ?? product.name}
            fill
            priority={priority}
            quality={75}
            sizes="(max-width: 640px) 62vw, (max-width: 1024px) 33vw, 19rem"
            className={`object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04] ${
              soldOut ? "opacity-55 saturate-50" : ""
            }`}
          />
        </div>

        {isDeal ? (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-pill bg-gradient-to-r from-brand to-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-ink-950">
            <Icon name="bolt" className="h-3 w-3" />
            {off ? `Deal · -${off}%` : "Deal of the week"}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-3 sm:px-4">
        {/* Brand top-left — Plug layout */}
        <div className="flex items-start justify-between gap-2">
          <span className="truncate text-[11px] font-medium text-white/40">
            {product.brand ?? "G-Products"}
          </span>
          {product.stock === "in_stock" ? (
            <span className="shrink-0 text-[11px] font-medium text-accent">
              In stock
            </span>
          ) : product.stock === "low_stock" ? (
            <span className="shrink-0 text-[11px] font-medium text-brand">
              Low stock
            </span>
          ) : (
            <span className="shrink-0 text-[11px] font-medium text-white/35">
              Sold out
            </span>
          )}
        </div>

        {/* Product name + color */}
        <Link href={`/product/${product.slug}`} className="mt-1.5 block">
          <h3 className="line-clamp-2 text-[13px] font-bold leading-snug text-white sm:text-sm">
            {product.name}
            {colorLabel ? (
              <span className="font-semibold text-white/55">
                {" "}
                {colorLabel}
              </span>
            ) : null}
          </h3>
        </Link>

        {/* From + price + compare */}
        <div className="mt-2 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <span className="text-[13px] font-medium text-white/40">From</span>
          <span className="text-[15px] font-extrabold tracking-tight text-white">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice ? (
            <span className="text-[13px] text-white/30 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          ) : null}
        </div>

        {/* Color swatches */}
        {product.variants.length > 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {product.variants.slice(0, 6).map((v) => {
              const selected = primary?.id === v.id;
              return (
                <span
                  key={v.id}
                  title={v.name}
                  className={`h-4 w-4 rounded-full ${
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

        <div className="mt-auto pt-3.5">
          <AddToCartButton product={product} compact requireOptions />
        </div>
      </div>
    </div>
  );
}
