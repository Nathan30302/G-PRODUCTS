"use client";

import { useEffect } from "react";
import { pushRecentProduct } from "@/lib/recent-products";

/** Records a product view for the Recently Viewed rail on search. */
export function TrackProductView({ slug }: { slug: string }) {
  useEffect(() => {
    pushRecentProduct(slug);
  }, [slug]);

  return null;
}
