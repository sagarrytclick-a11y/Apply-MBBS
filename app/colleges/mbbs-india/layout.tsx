import type { Metadata } from "next";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { buildPageMetadata, jsonLdScript } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "MBBS in India 2026 | Colleges, Fees & NEET Cutoffs",
  description: `Explore top MBBS colleges in India. Government & private medical colleges, fees, NEET cutoffs, and admission counselling by ${SITE_IDENTITY.name}.`,
  path: "/colleges/mbbs-india",
  keywords: [
    "MBBS in India",
    "MBBS colleges India",
    "NEET cutoffs",
    "government medical colleges",
    SITE_IDENTITY.name,
  ],
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_IDENTITY.website },
    {
      "@type": "ListItem",
      position: 2,
      name: "MBBS India",
      item: `${SITE_IDENTITY.website}/colleges/mbbs-india`,
    },
  ],
};

export default function MbbsIndiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      {children}
    </>
  );
}
