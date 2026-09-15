import type { MetadataRoute } from "next";
import { SITE_IDENTITY } from "@/app/config/site_identity";

export default function robots(): MetadataRoute.Robots {
  const base = SITE_IDENTITY.website;
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
