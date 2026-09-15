"use client";

import React from "react";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { PageHero } from "@/components/ui/PageHero";

const TermsPage: React.FC = () => {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        title="Terms and Conditions"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Terms and Conditions" },
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
                By using {SITE_IDENTITY.name}, you agree to these terms. If you
                do not agree, please do not use our website or services.
              </p>

              <div>
                <h2 className="font-display text-lg font-bold text-primary mb-2">
                  1. Our Services
                </h2>
                <p>
                  We help students with MBBS admission guidance in India and
                  abroad. Admission depends on eligibility, NEET score,
                  documents, and seat availability. Fees may change based on the
                  course or college you choose.
                </p>
              </div>

              <div>
                <h2 className="font-display text-lg font-bold text-primary mb-2">
                  2. Your Responsibility
                </h2>
                <p>
                  Please share correct details and valid documents. Do not misuse
                  our website, forms, or counselling services.
                </p>
              </div>

              <div>
                <h2 className="font-display text-lg font-bold text-primary mb-2">
                  3. Payments and Refunds
                </h2>
                <p>
                  Payments should be made on time as agreed. Processing fees are
                  usually non-refundable once work starts. For cancellation,
                  write to us. Refunds follow our company policy.
                </p>
              </div>

              <div>
                <h2 className="font-display text-lg font-bold text-primary mb-2">
                  4. Website Information
                </h2>
                <p>
                  Content on this site is for guidance only. College fees,
                  rankings, and rules can change. Always confirm details with the
                  university. {SITE_IDENTITY.name} is not responsible for
                  third-party changes.
                </p>
              </div>

              <div>
                <h2 className="font-display text-lg font-bold text-primary mb-2">
                  5. Privacy
                </h2>
                <p>
                  We keep your data safe and do not sell it. We may share details
                  only with partner universities for admission support.
                </p>
              </div>

              <div>
                <h2 className="font-display text-lg font-bold text-primary mb-2">
                  6. Content Ownership
                </h2>
                <p>
                  All content on this website belongs to {SITE_IDENTITY.name}.
                  Copying or using it without permission is not allowed.
                </p>
              </div>

              <div>
                <h2 className="font-display text-lg font-bold text-primary mb-2">
                  7. Contact
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

export default TermsPage;
