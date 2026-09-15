"use client";

import React from "react";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { PageHero } from "@/components/ui/PageHero";

const PrivacyPage: React.FC = () => {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        title="Privacy Policy"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
        align="center"
      />

      <section className="he-section">
        <div className="he-container">
          <div className="mx-auto max-w-2xl text-left">
            <p className="font-body text-sm text-muted mb-8">
              Last updated: {lastUpdated}
            </p>

            <div className="space-y-8 font-body text-[15px] text-muted leading-relaxed">
              <p>
                At {SITE_IDENTITY.name}, we protect your personal information.
                This page explains what we collect and how we use it.
              </p>

              <div>
                <h2 className="font-display text-lg font-bold text-primary mb-2">
                  1. Information We Collect
                </h2>
                <p>
                  We may collect your name, email, phone number, address, NEET
                  score, academic details, enquiry messages, and payment
                  information when needed for our services.
                </p>
              </div>

              <div>
                <h2 className="font-display text-lg font-bold text-primary mb-2">
                  2. How We Use It
                </h2>
                <p>
                  We use your information for counselling, admission support,
                  updates, service improvement, and security.
                </p>
              </div>

              <div>
                <h2 className="font-display text-lg font-bold text-primary mb-2">
                  3. Data Sharing
                </h2>
                <p>
                  We do not sell your data. We may share details with partner
                  universities only for admission purposes, or if required by
                  law.
                </p>
              </div>

              <div>
                <h2 className="font-display text-lg font-bold text-primary mb-2">
                  4. Your Rights
                </h2>
                <p>
                  You can ask to view, correct, or delete your data, and you can
                  opt out of marketing messages.
                </p>
              </div>

              <div>
                <h2 className="font-display text-lg font-bold text-primary mb-2">
                  5. Cookies
                </h2>
                <p>
                  We use cookies to improve the website. You can turn them off
                  in your browser settings, but some features may not work.
                </p>
              </div>

              <div>
                <h2 className="font-display text-lg font-bold text-primary mb-2">
                  6. Contact
                </h2>
                <p>
                  Email:{" "}
                  <a
                    href={`mailto:${SITE_IDENTITY.contact.email}`}
                    className="text-primary font-semibold hover:underline"
                  >
                    {SITE_IDENTITY.contact.email}
                  </a>
                </p>
                <p>
                  Phone:{" "}
                  <a
                    href={`tel:${SITE_IDENTITY.contact.phone.replace(/[^0-9+]/g, "")}`}
                    className="text-primary font-semibold hover:underline"
                  >
                    {SITE_IDENTITY.contact.phone}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
