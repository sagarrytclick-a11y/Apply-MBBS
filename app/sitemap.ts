import type { MetadataRoute } from "next";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import {
  getAbroadCountries,
  getAllColleges,
  getBlogs,
  getMdMsStates,
  toCollegeSlug,
} from "@/lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_IDENTITY.website;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    {
      url: `${baseUrl}/neet-rank-predictor`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/colleges/mbbs-india`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/colleges/mbbs-abroad`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/colleges/md-ms`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/sitemap`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const countries: MetadataRoute.Sitemap = getAbroadCountries().map((c) => ({
    url: `${baseUrl}/country/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const mdStates: MetadataRoute.Sitemap = getMdMsStates().map((s) => ({
    url: `${baseUrl}/colleges/md-ms/${s.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const colleges: MetadataRoute.Sitemap = getAllColleges()
    .filter((c) => c.pathway !== "mdms")
    .map((c) => ({
      url: `${baseUrl}/colleges/${toCollegeSlug(c.name)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  // Deduplicate college URLs
  const seen = new Set<string>();
  const uniqueColleges = colleges.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });

  const blogs: MetadataRoute.Sitemap = getBlogs().map((b) => ({
    url: `${baseUrl}/blog/${b.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  return [...staticRoutes, ...countries, ...mdStates, ...uniqueColleges, ...blogs];
}
