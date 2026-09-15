"use client";

import React from "react";
import { Lock, Mail, Phone, ShieldCheck } from "lucide-react";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { PageHero } from "@/components/ui/PageHero";

const sections = [
  {
    title: "Information We Collect",
    body: `We may collect your name, email, phone number, address, NEET score, academic details, enquiry messages, and payment information when needed for our services.`,
  },
  {
    title: "How We Use It",
    body: `We use your information for counselling, admission support, updates, service improvement, and security.`,
  },
  {
    title: "Data Sharing",
    body: `We do not sell your data. We may share details with partner universities only for admission purposes, or if required by law.`,
  },
  {
    title: "Your Rights",
    body: `You can ask to view, correct, or delete your data, and you can opt out of marketing messages.`,
  },
  {
    title: "Cookies",
    body: `We use cookies to improve the website. You can turn them off in your browser settings, but some features may not work.`,
  },
];

const PrivacyPage: React.FC = () => {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const phoneTel = SITE_IDENTITY.contact.phone.replace(/[^0-9+]/g, "");

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        surface="primary"
        pattern="grid"
        align="center"
        eyebrow="Legal"
        title={
          <>
            Privacy{" "}
            <span className="text-secondary">Policy</span>
          </>
        }
        description={`How ${SITE_IDENTITY.name} collects, uses, and protects your personal information.`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
      />

      <section className="he-section">
        <div className="he-container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex flex-col items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-accent/12 text-accent-deep">
                <Lock className="h-5 w-5" />
              </span>
              <p className="rounded-full border border-accent/25 bg-accent/8 px-3.5 py-1.5 font-body text-xs font-bold text-accent-deep">
                Last updated: {lastUpdated}
              </p>
            </div>

            <div className="rounded-[20px] border border-[#d8e8dc] bg-white p-5 text-left shadow-[0_8px_28px_rgba(15,23,42,0.04)] sm:p-8">
              <p className="text-center font-body text-[15px] leading-relaxed text-muted">
                At{" "}
                <span className="font-semibold text-accent-deep">
                  {SITE_IDENTITY.name}
                </span>
                , we protect your personal information. This page explains what
                we collect and how we use it.
              </p>

              <div className="mt-8 space-y-5">
                {sections.map((section, i) => (
                  <article
                    key={section.title}
                    className="rounded-[16px] border border-[#e6f0e9] bg-[#f7fbf8] p-4 text-center sm:p-5"
                  >
                    <div className="mb-2 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-3">
                      <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-accent text-[12px] font-extrabold text-white">
                        {i + 1}
                      </span>
                      <h2 className="font-display text-lg font-extrabold text-primary">
                        {section.title}
                      </h2>
                    </div>
                    <p className="font-body text-[15px] leading-relaxed text-muted">
                      {section.body}
                    </p>
                  </article>
                ))}
              </div>

              <div className="mt-6 rounded-[16px] border border-accent/25 bg-gradient-to-br from-accent/10 to-accent/5 p-5 text-center">
                <div className="mb-3 flex items-center justify-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent-deep" />
                  <h2 className="font-display text-lg font-extrabold text-primary">
                    6. Contact
                  </h2>
                </div>
                <div className="space-y-2 font-body text-[15px]">
                  <p className="flex flex-wrap items-center justify-center gap-2 text-muted">
                    <Mail className="h-4 w-4 text-accent-deep" />
                    Email:{" "}
                    <a
                      href={`mailto:${SITE_IDENTITY.contact.email}`}
                      className="font-semibold text-accent-deep hover:underline"
                    >
                      {SITE_IDENTITY.contact.email}
                    </a>
                  </p>
                  <p className="flex flex-wrap items-center justify-center gap-2 text-muted">
                    <Phone className="h-4 w-4 text-accent-deep" />
                    Phone:{" "}
                    <a
                      href={`tel:${phoneTel}`}
                      className="font-semibold text-accent-deep hover:underline"
                    >
                      {SITE_IDENTITY.contact.phone}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
