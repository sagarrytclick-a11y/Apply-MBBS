import type { Metadata } from "next";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { buildPageMetadata, jsonLdScript } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "NEET UG 2026 Cutoffs | Qualifying Marks & Closing Ranks (India)",
  description: `Accurate NEET UG 2026 cutoffs: category-wise qualifying marks, All India Quota closing ranks, and AIIMS Round 1 category-wise cutoffs — compiled from official NTA and MCC data by ${SITE_IDENTITY.name}.`,
  path: "/neet-rank-predictor",
  keywords: [
    "NEET 2026 cutoff",
    "NEET rank predictor",
    "NEET closing rank 2026",
    "AIIMS NEET cutoff",
    "NEET qualifying marks 2026",
    "NEET score to rank",
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
      name: "NEET UG 2026 Cutoffs",
      item: `${SITE_IDENTITY.website}/neet-rank-predictor`,
    },
  ],
};

export default function NeetRankPredictorLayout({
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