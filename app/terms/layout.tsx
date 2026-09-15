import type { Metadata } from "next";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Use",
  description: `Terms of use for ${SITE_IDENTITY.name} website and counselling services.`,
  path: "/terms",
});

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
