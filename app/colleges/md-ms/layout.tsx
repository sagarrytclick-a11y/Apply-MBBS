import type { Metadata } from "next";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { buildPageMetadata, jsonLdScript } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "MD MS in India 2026 | Colleges & NEET PG",
  description: `Explore MD & MS colleges in India for postgraduate medical education. Specializations, NEET PG cutoffs, and admission guidance by ${SITE_IDENTITY.name}.`,
  path: "/colleges/md-ms",
  keywords: [
    "MD MS colleges India",
    "NEET PG counselling",
    "postgraduate medical colleges",
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
      name: "MD/MS",
      item: `${SITE_IDENTITY.website}/colleges/md-ms`,
    },
  ],
};

export default function MdMsLayout({
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
