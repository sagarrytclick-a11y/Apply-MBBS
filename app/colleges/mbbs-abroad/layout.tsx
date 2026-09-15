import type { Metadata } from "next";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { buildPageMetadata, jsonLdScript } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "MBBS Abroad 2026 | Russia, Kyrgyzstan, Kazakhstan & More",
  description: `Study MBBS abroad at medical universities in Russia, Kyrgyzstan, Kazakhstan, Nepal, Bangladesh & more. Affordable fees and admission guidance by ${SITE_IDENTITY.name}.`,
  path: "/colleges/mbbs-abroad",
  keywords: [
    "MBBS abroad",
    "MBBS in Russia",
    "MBBS in Kyrgyzstan",
    "MBBS in Kazakhstan",
    "NMC approved universities",
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
      name: "MBBS Abroad",
      item: `${SITE_IDENTITY.website}/colleges/mbbs-abroad`,
    },
  ],
};

export default function MbbsAbroadLayout({
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
