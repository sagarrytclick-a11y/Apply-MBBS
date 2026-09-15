"use client";

import React from "react";
import { FileText, Mail, Phone, Shield } from "lucide-react";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { PageHero } from "@/components/ui/PageHero";

const sections = [
  {
    title: "Our Services",
    body: `We help students with MBBS admission guidance in India and abroad. Admission depends on eligibility, NEET score, documents, and seat availability. Fees may change based on the course or college you choose.`,
  },
  {
    title: "Your Responsibility",
    body: `Please share correct details and valid documents. Do not misuse our website, forms, or counselling services.`,
  },
  {
    title: "Payments and Refunds",
    body: `Payments should be made on time as agreed. Processing fees are usually non-refundable once work starts. For cancellation, write to us. Refunds follow our company policy.`,
  },
  {
    title: "Website Information",
    body: `Content on this site is for guidance only. College fees, rankings, and rules can change. Always confirm details with the university. ${SITE_IDENTITY.name} is not responsible for third-party changes.`,
  },
  {
    title: "Privacy",
    body: `We keep your data safe and do not sell it. We may share details only with partner universities for admission support.`,
  },
  {
    title: "Content Ownership",
    body: `All content on this website belongs to ${SITE_IDENTITY.name}. Copying or using it without permission is not allowed.`,
  },
];

const TermsPage: React.FC = () => {
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
            Terms &{" "}
            <span className="text-secondary">Conditions</span>
          </>
        }
        description={`Rules for using ${SITE_IDENTITY.name} website and counselling services.`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Terms and Conditions" },
        ]}
      />

      <section className="he-section">
        <div className="he-container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex flex-col items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-accent/12 text-accent-deep">
                <FileText className="h-5 w-5" />
              </span>
              <p className="rounded-full border border-accent/25 bg-accent/8 px-3.5 py-1.5 font-body text-xs font-bold text-accent-deep">
                Last updated: {lastUpdated}
              </p>
            </div>

            <div className="rounded-[20px] border border-[#d8e8dc] bg-white p-5 text-left shadow-[0_8px_28px_rgba(15,23,42,0.04)] sm:p-8">
              <p className="text-center font-body text-[15px] leading-relaxed text-muted">
                By using{" "}
                <span className="font-semibold text-accent-deep">
                  {SITE_IDENTITY.name}
                </span>
                , you agree to these terms. If you do not agree, please do not
                use our website or services.
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
                  <Shield className="h-4 w-4 text-accent-deep" />
                  <h2 className="font-display text-lg font-extrabold text-primary">
                    7. Contact
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

export default TermsPage;
