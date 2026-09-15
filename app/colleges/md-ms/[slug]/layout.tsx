import type { Metadata } from "next";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { getMdMsStateBySlug } from "@/lib/catalog";
import { buildPageMetadata, jsonLdScript } from "@/lib/seo";

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const state = getMdMsStateBySlug(slug);

  if (!state) {
    return buildPageMetadata({
      title: "MD/MS State Not Found",
      description: "The requested MD/MS listing could not be found.",
      path: `/colleges/md-ms/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `MD/MS Colleges in ${state.name} | Fees & Seats`,
    description:
      state.description ||
      `Explore MD/MS colleges in ${state.name}. Compare fees, seats, and admission guidance with ${SITE_IDENTITY.name}.`,
    path: `/colleges/md-ms/${slug}`,
    keywords: [
      `MD MS ${state.name}`,
      `NEET PG ${state.name}`,
      "MD MS colleges India",
      SITE_IDENTITY.name,
    ],
    image: state.image,
  });
}

export default async function MdMsSlugLayout({ children, params }: Props) {
  const { slug } = await params;
  const state = getMdMsStateBySlug(slug);
  const pageUrl = `${SITE_IDENTITY.website}/colleges/md-ms/${slug}`;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_IDENTITY.website },
      {
        "@type": "ListItem",
        position: 2,
        name: "MD / MS",
        item: `${SITE_IDENTITY.website}/colleges/md-ms`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: state?.name || slug,
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
