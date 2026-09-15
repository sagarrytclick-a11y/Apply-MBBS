import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import HeroSection from "@/components/HeroSection";
import UniversityExplorer from "@/components/home/UniversityExplorer";
import TrustBar from "@/components/home/TrustBar";
import BrandLogosSlider from "@/components/home/BrandLogosSlider";
import StatsSection from "@/components/home/StatsSection";
import OfferingsSection from "@/components/home/OfferingsSection";
import ProcessSection from "@/components/home/ProcessSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CTASection from "@/components/home/CTASection";
import FAQPreview from "@/components/home/FAQPreview";

const TestimonialsSection = dynamic(() => import("@/components/TestimonialSection"));
const BlogTeaser = dynamic(() => import("@/components/home/BlogTeaser"));

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_IDENTITY.name} | ${SITE_IDENTITY.tagline}`,
  },
  description: `${SITE_IDENTITY.name} — ${SITE_IDENTITY.tagline}. Plan MBBS in India or abroad, MD/MS routes, and NEET counselling with clear college shortlists and fee guidance.`,
  keywords: [
    SITE_IDENTITY.name,
    SITE_IDENTITY.tagline,
    "MBBS admission",
    "NEET counselling",
    "MBBS abroad",
    "MD MS admission",
  ],
  alternates: {
    canonical: SITE_IDENTITY.website,
  },
  openGraph: {
    title: `${SITE_IDENTITY.name} | ${SITE_IDENTITY.tagline}`,
    description: `${SITE_IDENTITY.name} — ${SITE_IDENTITY.tagline}. MBBS India, abroad, and MD/MS guidance.`,
    url: SITE_IDENTITY.website,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_IDENTITY.name} | ${SITE_IDENTITY.tagline}`,
    description: SITE_IDENTITY.tagline,
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_IDENTITY.website },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can you guide MBBS seats in India as well as abroad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We build shortlists around your NEET score, budget, and preferred pathway — covering Indian government and private seats plus abroad colleges reviewed with NMC context in mind.",
      },
    },
    {
      "@type": "Question",
      name: "Does the introductory counselling session cost anything?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Your first counselling call is complimentary. We outline workable college options before you decide on any application route.",
      },
    },
    {
      "@type": "Question",
      name: "Which cities do you operate from?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `We run two official offices — Noida (${SITE_IDENTITY.offices[0].full}) and Bhopal (${SITE_IDENTITY.offices[1].full}).`,
      },
    },
    {
      "@type": "Question",
      name: "Are parents welcome on the counselling call?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — and we recommend it. Fees, deadlines, and hostel details land better when students and parents hear one shared plan together.",
      },
    },
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="home-stack">
        <HeroSection />
        <TrustBar />
        <BrandLogosSlider />
        <WhyChooseUs />
        <Suspense fallback={null}>
          <UniversityExplorer />
        </Suspense>
        <StatsSection />
        <OfferingsSection />
        <ProcessSection />
        <TestimonialsSection />
        <BlogTeaser />
        <CTASection />
        <FAQPreview />
      </div>
    </div>
  );
}
