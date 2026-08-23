import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/cart",
          "/checkout",
          "/profile/account",
          "/profile/customer/login",
          "/services/track/"
        ]
      }
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base.replace(/^https?:\/\//, "")
  };
}
