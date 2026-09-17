import type { Metadata } from "next";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  jsonLdScript,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Compare Medical Colleges 2026 | MBBS & MD/MS Side by Side",
  description: `Compare up to 3 medical colleges side by side — MBBS India, MBBS Abroad, and MD/MS. Check fees, NRI fees, seats, recognition, ranking, and admission process with ${SITE_IDENTITY.name}.`,
  path: "/colleges/compare",
  keywords: [
    "compare medical colleges",
    "compare MBBS colleges",
    "MBBS college comparison India",
    "compare MBBS abroad colleges",
    "MD MS college compare",
    "medical college fees comparison",
    "compare medical college seats",
    "NRI fees medical college",
    "best medical college comparison tool",
    SITE_IDENTITY.name,
  ],
});

const jsonLd = [
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Compare Colleges", path: "/colleges/compare" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Medical College Compare Tool",
    description:
      "Compare MBBS India, MBBS Abroad, and MD/MS colleges side by side on fees, seats, recognition, rankings, and admission process.",
    url: absoluteUrl("/colleges/compare"),
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    provider: {
      "@type": "Organization",
      name: SITE_IDENTITY.name,
      url: SITE_IDENTITY.website,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How many medical colleges can I compare at once?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can compare up to 3 colleges at a time from MBBS India, MBBS Abroad, and MD/MS catalogues.",
        },
      },
      {
        "@type": "Question",
        name: "What details can I compare between medical colleges?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Compare pathway, location, college type, fees, NRI fees, seats, recognition, ranking, and admission process side by side.",
        },
      },
      {
        "@type": "Question",
        name: "Can I share my college comparison?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Your selected colleges stay in the page URL so you can copy and share the comparison link.",
        },
      },
    ],
  },
];

export default function CompareLayout({
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
