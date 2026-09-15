import type { Metadata } from "next";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { buildPageMetadata, jsonLdScript } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "NEET Rank Predictor 2026 | Estimate Your Rank by Category",
  description: `Predict your NEET rank from your score and category (UR, EWS, OBC, SC, ST, PwBD). Check estimated AIR, category rank, and college outlook with ${SITE_IDENTITY.name}.`,
  path: "/neet-rank-predictor",
  keywords: [
    "NEET rank predictor",
    "NEET 2026 rank",
    "NEET category rank",
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
      name: "NEET Rank Predictor",
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
