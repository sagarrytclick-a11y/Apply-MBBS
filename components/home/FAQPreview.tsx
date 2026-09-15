"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { FadeIn } from "../ui/FadeIn";

const faqs = [
  {
    q: "Can you guide MBBS seats in India as well as abroad?",
    a: "Yes. We build shortlists around your NEET score, budget, and preferred pathway — covering Indian government and private seats plus abroad colleges reviewed with NMC context in mind.",
  },
  {
    q: "Does the introductory counselling session cost anything?",
    a: "No. Your first counselling call is complimentary. We outline workable college options before you decide on any application route.",
  },
  {
    q: "How do you confirm a college is recognised?",
    a: "We review publicly available recognition sources (including NMC and related listings where they apply) and walk you through what that means for practising or returning later.",
  },
  {
    q: "Are parents welcome on the counselling call?",
    a: "Yes — and we recommend it. Fees, deadlines, and hostel details land better when students and parents hear one shared plan together.",
  },
];

export default function FAQPreview() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="he-section bg-surface border-t border-border scroll-mt-24">
      <div className="he-container">
        <FadeIn>
          <SectionHeader
            eyebrow="Common doubts"
            title={
              <>
                Honest replies before{" "}
                <span className="text-secondary">you commit</span>
              </>
            }
            description="Questions families raise most during MBBS and MD/MS admission season."
            className="mb-4"
          />
        </FadeIn>

        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <FadeIn key={item.q} delay={i * 0.05}>
                <div
                  className={`overflow-hidden rounded-[16px] border bg-background transition-all duration-300 ${
                    isOpen
                      ? "border-accent/50 bg-white shadow-[0_8px_24px_rgba(30,41,59,0.08)]"
                      : "border-border hover:border-primary/20"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-body text-sm sm:text-base font-bold text-text">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-primary transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-accent-deep" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 font-body text-sm text-muted leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
