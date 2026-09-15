import type { Metadata } from "next";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { buildPageMetadata, jsonLdScript } from "@/lib/seo";

const pageUrl = `${SITE_IDENTITY.website}/about`;

export const metadata: Metadata = buildPageMetadata({
  title: "About Us | MBBS Admission Consultants in Noida",
  description: `Learn about ${SITE_IDENTITY.name} — ${SITE_IDENTITY.tagline}. Noida & Bhopal counselling with ${SITE_IDENTITY.statistics.yearsExperience} years of experience and ${SITE_IDENTITY.statistics.studentsCounselled} students guided.`,
  path: "/about",
  keywords: [
    `About ${SITE_IDENTITY.name}`,
    "MBBS admission consultants Noida",
    "NEET counselling Noida",
    "MBBS abroad consultants",
    "medical admission guidance India",
  ],
});

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_IDENTITY.website },
    { "@type": "ListItem", position: 2, name: "About Us", item: pageUrl },
  ],
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: `About ${SITE_IDENTITY.name}`,
  url: pageUrl,
  description: `${SITE_IDENTITY.name} — ${SITE_IDENTITY.tagline}. MBBS admission counselling in Noida for India and abroad.`,
  mainEntity: {
    "@type": "EducationalOrganization",
    name: SITE_IDENTITY.name,
    url: SITE_IDENTITY.website,
    email: SITE_IDENTITY.contact.email,
    telephone: SITE_IDENTITY.contact.phone.split(",")[0].trim(),
    slogan: SITE_IDENTITY.tagline,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_IDENTITY.address.full,
      addressLocality: SITE_IDENTITY.address.city,
      addressRegion: "Uttar Pradesh",
      postalCode: SITE_IDENTITY.address.pincode,
      addressCountry: "IN",
    },
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(aboutJsonLd) }}
      />
      {children}
    </>
  );
}
