import type { Metadata } from "next";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { getCollegeBySlug } from "@/lib/catalog";
import { buildPageMetadata, jsonLdScript } from "@/lib/seo";

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const college = getCollegeBySlug(slug);

  if (!college) {
    return buildPageMetadata({
      title: "College Not Found",
      description: "The requested college page could not be found.",
      path: `/colleges/${slug}`,
      noIndex: true,
    });
  }

  const title = `${college.name} | Fees, Seats & Admission ${new Date().getFullYear()}`;
  const description =
    college.description ||
    `${college.name} in ${college.city}${college.region ? `, ${college.region}` : ""}. Fees: ${college.fees || "N/A"}. Recognition: ${college.recognition || "See details"}. Guidance by ${SITE_IDENTITY.name}.`;

  return buildPageMetadata({
    title,
    description: description.slice(0, 160),
    path: `/colleges/${slug}`,
    keywords: [
      college.name,
      `MBBS ${college.city}`,
      college.region,
      college.type || "Medical College",
      SITE_IDENTITY.name,
    ].filter(Boolean) as string[],
    image: college.image,
  });
}

export default async function CollegeSlugLayout({ children, params }: Props) {
  const { slug } = await params;
  const college = getCollegeBySlug(slug);
  const pageUrl = `${SITE_IDENTITY.website}/colleges/${slug}`;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_IDENTITY.website },
      {
        "@type": "ListItem",
        position: 2,
        name: college?.pathway === "abroad" ? "MBBS Abroad" : "MBBS India",
        item:
          college?.pathway === "abroad"
            ? `${SITE_IDENTITY.website}/colleges/mbbs-abroad`
            : `${SITE_IDENTITY.website}/colleges/mbbs-india`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: college?.name || slug,
        item: pageUrl,
      },
    ],
  };

  const collegeJsonLd = college
    ? {
        "@context": "https://schema.org",
        "@type": "CollegeOrUniversity",
        name: college.name,
        url: pageUrl,
        image: college.image,
        address: {
          "@type": "PostalAddress",
          addressLocality: college.city,
          addressCountry: college.pathway === "abroad" ? undefined : "IN",
        },
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }}
      />
      {collegeJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(collegeJsonLd) }}
        />
      )}
      {children}
    </>
  );
}
