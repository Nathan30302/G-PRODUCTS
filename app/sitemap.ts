import type { MetadataRoute } from "next";
import { getAllCategories, getAllProducts } from "@/lib/queries";
import { getAllServiceOffers } from "@/lib/service-queries";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: `${base}/services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: `${base}/services/printing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: `${base}/search`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5
    },
    {
      url: `${base}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5
    },
    {
      url: `${base}/bundles`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7
    },
    {
      url: `${base}/orders/track`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5
    },
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6
    },
    {
      url: `${base}/delivery`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5
    },
    {
      url: `${base}/returns`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4
    },
    {
      url: `${base}/warranty`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4
    },
    {
      url: `${base}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3
    },
    {
      url: `${base}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3
    },
    {
      url: `${base}/terms/g-loans`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3
    },
    {
      url: `${base}/profile`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4
    },
    {
      url: `${base}/profile/customer/signup`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3
    }
  ];

  let categories: MetadataRoute.Sitemap = [];
  let products: MetadataRoute.Sitemap = [];
  let services: MetadataRoute.Sitemap = [];

  try {
    const [cats, items, offers] = await Promise.all([
      getAllCategories(),
      getAllProducts(),
      getAllServiceOffers()
    ]);

    categories = cats.map((c) => ({
      url: `${base}/category/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8
    }));

    const { catalogGroups } = await import("@/lib/catalog-taxonomy");
    const groups = catalogGroups
      .filter((g) => !g.href)
      .map((g) => ({
        url: `${base}/category/${g.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.85
      }));
    categories = [...groups, ...categories];

    products = items.map((p) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7
    }));

    services = offers.map((s) => ({
      url: `${base}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8
    }));
  } catch {
    // DB may be unavailable at build — still ship core URLs
  }

  return [...staticRoutes, ...categories, ...products, ...services];
}
