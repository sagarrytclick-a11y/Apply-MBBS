import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { PopupProvider } from "@/contexts/PopupContext";
import LayoutWrapper from "@/components/LayoutWrapper";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { absoluteUrl, jsonLdScript } from "@/lib/seo";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

const body = Bricolage_Grotesque({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const siteUrl = SITE_IDENTITY.website;
const phone = SITE_IDENTITY.contact.phone.split(",")[0].trim().replace(/\s/g, "");
const defaultTitle = `${SITE_IDENTITY.name} | ${SITE_IDENTITY.tagline}`;
const defaultDescription = `${SITE_IDENTITY.name} — ${SITE_IDENTITY.tagline}. Expert counselling for MBBS in India & abroad, MD/MS pathways, and NEET guidance from Noida & Bhopal.`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#15803D" },
    { media: "(prefers-color-scheme: dark)", color: "#14532d" },
  ],
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${SITE_IDENTITY.name}`,
  },
  description: defaultDescription,
  applicationName: SITE_IDENTITY.name,
  keywords: [
    SITE_IDENTITY.name,
    SITE_IDENTITY.tagline,
    "Apply MBBS",
    "MBBS admission consultants",
    "MBBS in India",
    "MBBS abroad",
    "NEET counseling",
    "NEET counselling",
    "medical college admission",
    "MBBS in Russia",
    "MBBS in Kyrgyzstan",
    "MBBS in Kazakhstan",
    "study medicine abroad",
    "Noida MBBS consultant",
    "Bhopal MBBS consultant",
    "NEET UG counseling",
    "NEET PG counseling",
    "MD MS admission India",
  ],
  authors: [{ name: SITE_IDENTITY.name, url: siteUrl }],
  creator: SITE_IDENTITY.name,
  publisher: SITE_IDENTITY.name,
  category: "education",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: SITE_IDENTITY.name,
    title: defaultTitle,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: SITE_IDENTITY.tagline,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48 64x64" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  other: {
    "geo.region": "IN-UP",
    "geo.placename": "Noida",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": `${siteUrl}/#organization`,
    name: SITE_IDENTITY.name,
    legalName: SITE_IDENTITY.name,
    alternateName: ["ApplyMBBS", "Apply MBBS Counselling"],
    description: defaultDescription,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(SITE_IDENTITY.logo.primary),
      width: 294,
      height: 220,
    },
    image: absoluteUrl(SITE_IDENTITY.logo.primary),
    email: SITE_IDENTITY.contact.email,
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_IDENTITY.address.full,
      addressLocality: SITE_IDENTITY.address.city,
      addressRegion: "Uttar Pradesh",
      postalCode: SITE_IDENTITY.address.pincode,
      addressCountry: "IN",
    },
    hasMap: SITE_IDENTITY.contact.googleMapsUrl,
    location: SITE_IDENTITY.offices.map((office) => ({
      "@type": "Place",
      name: office.label,
      address: {
        "@type": "PostalAddress",
        streetAddress: office.full,
        addressLocality: office.city,
        addressRegion: office.state,
        postalCode: office.pincode,
        addressCountry: "IN",
      },
    })),
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: phone,
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
      },
    ],
    sameAs: [
      SITE_IDENTITY.social.instagram,
      SITE_IDENTITY.social.facebook,
      SITE_IDENTITY.social.linkedin,
      SITE_IDENTITY.social.youtube,
      SITE_IDENTITY.social.twitter,
    ].filter(Boolean),
    areaServed: ["IN", "RU", "KZ", "KG", "NP", "BD", "GE", "UZ"],
    foundingDate: "2010",
    slogan: SITE_IDENTITY.tagline,
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "10:00",
      closes: "20:00",
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: SITE_IDENTITY.name,
    description: SITE_IDENTITY.tagline,
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/colleges/mbbs-india?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang="en-IN"
      className={`${display.variable} ${body.variable} h-full antialiased font-body`}
    >
      <head>
        <link rel="dns-prefetch" href="https://i.pinimg.com" />
        <link rel="preconnect" href="https://i.pinimg.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
      </head>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(websiteJsonLd) }}
        />
        <PopupProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </PopupProvider>
      </body>
    </html>
  );
}
