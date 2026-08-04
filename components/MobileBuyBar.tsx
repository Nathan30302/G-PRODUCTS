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
    if (multi) return; // use Choose colour link
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
    <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+3.75rem)] z-40 border-t border-white/10 bg-ink-950/95 px-4 py-3 backdrop-blur-lg md:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0">
          <p className="text-[11px] text-white/45">Price</p>
          <p className="truncate text-lg font-extrabold text-white">
            {formatPrice(product.price)}
          </p>
        </div>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Order on WhatsApp"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-pill border border-accent/40 bg-accent/10 text-accent"
        >
          <Icon name="whatsapp" className="h-5 w-5" />
        </a>
        {soldOut ? (
          <Link
            href="#buy"
            className="flex flex-1 items-center justify-center rounded-pill border border-white/20 bg-white/[0.06] px-4 py-3 text-sm font-bold text-white/60"
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
  );
}
