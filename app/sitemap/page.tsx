import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { PageHero } from "@/components/ui/PageHero";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Sitemap",
  description: `Browse all pages on ${SITE_IDENTITY.name} — colleges, countries, blogs, and more. ${SITE_IDENTITY.tagline}.`,
  path: "/sitemap",
  keywords: ["sitemap", SITE_IDENTITY.name, "MBBS pages"],
});

const sections = [
  {
    title: "Main Pages",
    links: [
      { name: "Home", href: "/" },
      { name: "About Us", href: "/about" },
      { name: "Contact Us", href: "/contact" },
      { name: "Blog", href: "/blog" },
      { name: "NEET Rank Predictor", href: "/neet-rank-predictor" },
    ],
  },
  {
    title: "Colleges & Courses",
    links: [
      { name: "MBBS in India", href: "/colleges/mbbs-india" },
      { name: "MBBS Abroad", href: "/colleges/mbbs-abroad" },
      { name: "MD / MS", href: "/colleges/md-ms" },
    ],
  },
  {
    title: "MBBS Abroad Countries",
    links: [
      { name: "MBBS in Russia", href: "/country/russia" },
      { name: "MBBS in Kazakhstan", href: "/country/kazakhstan" },
      { name: "MBBS in Kyrgyzstan", href: "/country/kyrgyzstan" },
      { name: "MBBS in Uzbekistan", href: "/country/uzbekistan" },
      { name: "MBBS in Bangladesh", href: "/country/bangladesh" },
      { name: "MBBS in Georgia", href: "/country/georgia" },
      { name: "MBBS in Nepal", href: "/country/nepal" },
      { name: "MBBS in Philippines", href: "/country/philippines" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms & Conditions", href: "/terms" },
      { name: "Sitemap", href: "/sitemap" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="bg-surface min-h-screen">
      <PageHero
        eyebrow="Site Navigation"
        title="Sitemap"
        description={`Find every important page on ${SITE_IDENTITY.name} in one place.`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Sitemap" },
        ]}
        align="center"
      />

      <section className="he-section">
        <div className="he-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sections.map((section) => (
              <div key={section.title} className="he-card p-6 bg-white">
                <h2 className="font-display text-lg font-extrabold text-primary mb-5 pb-3 border-b border-border">
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href + link.name}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-2 font-body text-sm text-muted hover:text-accent-deep transition-colors"
                      >
                        <FaArrowRight className="text-[10px] text-border group-hover:text-accent-deep group-hover:translate-x-0.5 transition-all" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
