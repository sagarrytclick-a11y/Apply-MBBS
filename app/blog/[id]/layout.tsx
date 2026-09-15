import type { Metadata } from "next";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { getBlogById } from "@/lib/catalog";
import { buildPageMetadata, jsonLdScript } from "@/lib/seo";

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const blog = getBlogById(Number(id));

  if (!blog) {
    return buildPageMetadata({
      title: "Article Not Found",
      description: "This blog article could not be found.",
      path: `/blog/${id}`,
      noIndex: true,
    });
  }

  return {
    ...buildPageMetadata({
      title: blog.title,
      description: blog.description,
      path: `/blog/${blog.id}`,
      keywords: blog.tags,
      image: blog.image,
      type: "article",
    }),
    authors: [{ name: blog.author }],
  };
}

export default async function BlogPostLayout({ children, params }: Props) {
  const { id } = await params;
  const blog = getBlogById(Number(id));
  const pageUrl = `${SITE_IDENTITY.website}/blog/${id}`;

  const breadcrumb = {
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
      {
        "@type": "ListItem",
        position: 3,
        name: blog?.title || "Article",
        item: pageUrl,
      },
    ],
  };

  const articleJsonLd = blog
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: blog.title,
        description: blog.description,
        image: blog.image,
        datePublished: blog.date,
        author: {
          "@type": "Person",
          name: blog.author,
        },
        publisher: {
          "@type": "Organization",
          name: SITE_IDENTITY.name,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_IDENTITY.website}${SITE_IDENTITY.logo.primary}`,
          },
        },
        mainEntityOfPage: pageUrl,
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }}
      />
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(articleJsonLd) }}
        />
      )}
      {children}
    </>
  );
}
