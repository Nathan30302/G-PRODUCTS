"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useToast } from "@/components/Toast";
import { productWhatsAppLink } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/format";
import { Icon } from "@/components/Icons";
import { Product } from "@/lib/types";

export function MobileBuyBar({ product }: { product: Product }) {
  const { add } = useCart();
  const { toast } = useToast();
  const soldOut = product.stock === "sold_out";
  const multi = product.variants.length > 1;
  const first = product.variants.find((v) => v.available);
  const waLink = productWhatsAppLink(product);

  function handleAdd() {
    if (soldOut || !first) return;
    if (multi) return;
    add(product, first);
    toast({
      title: "Added to cart",
      description: `${product.name} · ${first.name}`,
      image: product.images[0]?.url,
      href: "/cart",
      hrefLabel: "View cart"
    });
  }

  return (
    <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+4.5rem)] z-40 px-4 md:hidden">
      <div className="rounded-2xl border border-ink-950/8 bg-white/95 p-3 shadow-[0_12px_40px_rgba(6,24,28,0.15)] backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-[11px] text-ink-950/40">Price</p>
            <p className="truncate text-lg font-extrabold text-ink-950">
              {formatPrice(product.price)}
            </p>
          </div>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Order on WhatsApp"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-pill border border-accent/40 bg-accent/10 text-accent-dark"
          >
            <Icon name="whatsapp" className="h-5 w-5" />
          </a>
          {soldOut ? (
            <Link
              href="#buy"
              className="flex flex-1 items-center justify-center rounded-pill border border-ink-950/12 bg-ink-950/5 px-4 py-3 text-sm font-bold text-ink-950/50"
            >
              Notify me
            </Link>
          ) : multi ? (
            <Link
              href="#buy"
              className="flex flex-1 items-center justify-center gap-2 rounded-pill bg-brand px-4 py-3 text-sm font-bold text-ink-950"
            >
              Choose colour
            </Link>
          ) : (
            <button
              onClick={handleAdd}
              className="flex flex-1 items-center justify-center gap-2 rounded-pill bg-brand px-4 py-3 text-sm font-bold text-ink-950 transition-all active:scale-[0.98]"
            >
              <Icon name="cart" className="h-4 w-4" />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
