import type { Metadata } from "next";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { buildPageMetadata, jsonLdScript } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Blog & Guides | MBBS Admission Tips",
  description: `Read MBBS admission guides, NEET counselling tips, and study-abroad insights from ${SITE_IDENTITY.name}.`,
  path: "/blog",
  keywords: ["MBBS blog", "NEET tips", "MBBS abroad guide", SITE_IDENTITY.name],
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_IDENTITY.website },
    {
      "@type": "ListItem",
      position: 2,
      name: "Blog",
      item: `${SITE_IDENTITY.website}/blog`,
    },
  ],
};

export default function BlogLayout({
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
