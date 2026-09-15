import type { MetadataRoute } from "next";
import { SITE_IDENTITY } from "@/app/config/site_identity";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_IDENTITY.name} — MBBS Admission Counselling`,
    short_name: SITE_IDENTITY.shortName,
    description: SITE_IDENTITY.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#15803D",
    icons: [
      { src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/favicon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
