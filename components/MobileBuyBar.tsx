"use client";

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
  const waLink = productWhatsAppLink(product);

  function handleAdd() {
    if (soldOut) return;
    add(product);
    toast({
      title: "Added to cart",
      description: product.name,
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
        <button
          onClick={handleAdd}
          disabled={soldOut}
          className="flex flex-1 items-center justify-center gap-2 rounded-pill bg-brand px-4 py-3 text-sm font-bold text-ink-950 transition-all active:scale-[0.98] disabled:bg-ink-700 disabled:text-white/40"
        >
          {soldOut ? (
            "Sold Out"
          ) : (
            <>
              <Icon name="cart" className="h-4 w-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
