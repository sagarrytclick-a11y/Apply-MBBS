import type { Metadata } from "next";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { getCountryBySlug } from "@/lib/catalog";
import { buildPageMetadata, jsonLdScript } from "@/lib/seo";

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const country = getCountryBySlug(slug);

  if (!country) {
    return buildPageMetadata({
      title: "Country Not Found",
      description: "The requested MBBS destination could not be found.",
      path: `/country/${slug}`,
      noIndex: true,
    });
  }

  const title = `MBBS in ${country.name} 2026 | Fees, Colleges & Admission`;
  const description =
    country.description ||
    `Explore NMC-aware MBBS colleges in ${country.name}. Compare fees, seats, and admission guidance with ${SITE_IDENTITY.name}.`;

  return buildPageMetadata({
    title,
    description,
    path: `/country/${slug}`,
    keywords: [
      `MBBS in ${country.name}`,
      `${country.name} medical colleges`,
      `study MBBS ${country.name}`,
      "MBBS abroad",
      SITE_IDENTITY.name,
    ],
    image: country.image,
  });
}

export default async function CountryLayout({ children, params }: Props) {
  const { slug } = await params;
  const country = getCountryBySlug(slug);
  const pageUrl = `${SITE_IDENTITY.website}/country/${slug}`;

  const breadcrumb = {
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
      {
        "@type": "ListItem",
        position: 3,
        name: country?.name || slug,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }}
      />
      {children}
    </>
  );
}
