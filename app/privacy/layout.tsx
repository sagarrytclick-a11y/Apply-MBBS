import type { Metadata } from "next";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE_IDENTITY.name}. Learn how we collect, use, and protect your personal information.`,
  path: "/privacy",
});

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
