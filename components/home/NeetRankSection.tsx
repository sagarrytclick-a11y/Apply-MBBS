"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, TrendingUp, Landmark } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { Button } from "../ui/Button";
import { FadeIn } from "../ui/FadeIn";

const points = [
  {
    icon: BadgeCheck,
    title: "Official 2026 cutoffs",
    desc: "Category-wise qualifying marks straight from the NTA NEET UG 2026 result.",
  },
  {
    icon: TrendingUp,
    title: "Closing ranks",
    desc: "MCC All India Quota and AIIMS Round 1 closing ranks — college by college.",
  },
  {
    icon: Landmark,
    title: "Plan your shot",
    desc: "Compare your score against real cutoffs and shortlist seats you can actually win.",
  },
];

export default function NeetRankSection() {
  return (
    <section className="he-section bg-background">
      <div className="he-container">
        <FadeIn>
          <SectionHeader
            eyebrow="NEET toolkit"
            title={
              <>
                NEET UG 2026{" "}
                <span className="text-secondary">cutoffs, verified</span>
              </>
            }
            description="Accurate category-wise qualifying marks and closing ranks from official NTA and MCC data — no guesses."
            className="mb-8"
          />
        </FadeIn>

        <div className="grid gap-5 lg:grid-cols-12 items-stretch">
          <FadeIn className="lg:col-span-7" delay={0.05}>
            <div className="grid gap-4 sm:grid-cols-3 h-full">
              {points.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="he-card he-card-line group p-5 sm:p-6 h-full"
                  >
                    <Icon className="h-6 w-6 text-accent-deep" />
                    <h3 className="mt-4 font-display text-lg font-extrabold text-text">
                      {item.title}
                    </h3>
                    <p className="mt-2 font-body text-sm text-muted leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </FadeIn>

          <FadeIn className="lg:col-span-5" delay={0.1}>
            <div className="relative overflow-hidden rounded-[20px] border border-primary bg-primary p-6 sm:p-8 h-full flex flex-col justify-center shadow-[0_8px_28px_rgba(30,41,59,0.2)]">
              <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-accent/20 blur-3xl" />
              <p className="relative font-body text-[12px] font-bold uppercase tracking-[0.14em] text-accent mb-3">
                NEET UG 2026 · Updated Aug 2026
              </p>
              <h3 className="relative font-display text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                Know where your score actually sits
              </h3>
              <p className="relative mt-3 font-body text-sm text-white/75 leading-relaxed">
                See qualifying-mark ranges for every category, AIQ closing ranks,
                and AIIMS campus-by-campus cutoffs.
              </p>
              <Link href="/neet-rank-predictor" className="relative mt-6 inline-flex">
                <Button size="lg" className="group">
                  View NEET cutoffs
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}