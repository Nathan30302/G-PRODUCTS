"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icons";
import { formatDateTime, formatPrice } from "@/lib/format";
import { getRecentProductSlugs } from "@/lib/recent-products";
import {
  lookupRecentProducts,
  type RecentProductCard
} from "@/app/profile/account/actions";
import { ShopStatusPill } from "@/components/shop/ui";

type ServiceRow = {
  id: string;
  ref: string;
  serviceType: string;
  status: string;
  createdAt: Date;
};

export function RecentViewed({ services }: { services: ServiceRow[] }) {
  const [products, setProducts] = useState<RecentProductCard[] | null>(null);

  useEffect(() => {
    const slugs = getRecentProductSlugs();
    if (slugs.length === 0) {
      setProducts([]);
      return;
    }
    let cancelled = false;
    lookupRecentProducts(slugs)
      .then((rows) => {
        if (!cancelled) setProducts(rows);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const waiting = products === null;
  const empty = !waiting && products.length === 0 && services.length === 0;

  if (empty) {
    return (
      <p className="mt-5 text-sm text-gp-text-muted">
        Products you open, and services you request, will show up here.
      </p>
    );
  }

  return (
    <div className="mt-5 space-y-6">
      {waiting ? (
        <p className="text-sm text-gp-text-muted">Loading what you opened…</p>
      ) : products.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {products.map((product) => (
            <li key={product.slug}>
              <Link
                href={`/product/${product.slug}`}
                className="gp-card flex items-center gap-3 !p-3 transition-all hover:shadow-card-hover"
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.alt}
                    className="h-16 w-16 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-gp-muted text-ink-700">
                    <Icon name="image" className="h-5 w-5" />
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-gp-text">
                    {product.name}
                  </span>
                  <span className="mt-1 block text-sm font-bold text-ink-800">
                    {formatPrice(product.price)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {services.length > 0 ? (
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-gp-text-subtle">
            Services you started
          </p>
          <ul className="mt-3 space-y-2">
            {services.map((service) => (
              <li key={service.id}>
                <Link
                  href={`/services/track/${service.ref}`}
                  className="gp-card flex items-center justify-between gap-3 !p-4"
                >
                  <span className="min-w-0">
                    <span className="block font-semibold text-gp-text">
                      {service.ref}
                    </span>
                    <span className="mt-1 block text-xs capitalize text-gp-text-muted">
                      {service.serviceType.replace(/_/g, " ").toLowerCase()} ·{" "}
                      {formatDateTime(service.createdAt)}
                    </span>
                  </span>
                  <ShopStatusPill status={service.status} kind="service" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
