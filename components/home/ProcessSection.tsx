"use client";

import React from "react";
import { ArrowDown } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { FadeIn } from "../ui/FadeIn";

const steps = [
  {
    n: "1",
    title: "Tell us where you stand",
    desc: "Share your NEET score, budget, and preferred track — MBBS India, overseas, or MD/MS — by form, phone, or WhatsApp.",
  },
  {
    n: "2",
    title: "Review a workable shortlist",
    desc: "We place realistic colleges side by side with fees, recognition, city, and timelines so families can compare calmly.",
  },
  {
    n: "3",
    title: "Submit with a checklist",
    desc: "Forms, documents, and counselling rounds move in order. Nothing advances until you approve the next action.",
  },
  {
    n: "4",
    title: "Lock the seat and stay supported",
    desc: "From allotment and reporting to visa and travel abroad, we remain reachable until your following step is clear.",
  },
];

function CurvedArrow({ bendUp, id }: { bendUp: boolean; id: string }) {
  const path = bendUp
    ? "M6 46 C 45 8, 95 8, 128 38"
    : "M6 10 C 45 48, 95 48, 128 16";

  return (
    <svg
      viewBox="0 0 140 56"
      fill="none"
      className="h-12 w-full overflow-visible sm:h-14"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <marker
          id={id}
          markerWidth="16"
          markerHeight="16"
          refX="12"
          refY="8"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path
            d="M1 1.5 L14 8 L1 14.5 Z"
            fill="#15803d"
            stroke="#15803d"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </marker>
      </defs>
      <path
        d={path}
        stroke="#15803d"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeDasharray="8 6"
        markerEnd={`url(#${id})`}
      />
      <circle cx="6" cy={bendUp ? 46 : 10} r="4" fill="#15803d" />
    </svg>
  );
}

export default function ProcessSection() {
  return (
    <section className="he-section bg-[#f0fdf4]">
      <div className="he-container">
        <FadeIn>
          <SectionHeader
            eyebrow="Our method"
            title={
              <>
                From first conversation to{" "}
                <span className="text-secondary">confirmed seat</span>
              </>
            }
            description="A straightforward counselling sequence — share your score, approve the shortlist, then we guide applications and what comes next."
            className="mb-10 sm:mb-14"
            align="center"
          />
        </FadeIn>

        {/* Desktop / tablet — arrows in separate overlay (not clipped by FadeIn) */}
        <div className="relative hidden md:block">
          <div
            className="pointer-events-none absolute inset-x-0 top-3 z-[3] grid h-14 grid-cols-4 gap-3 lg:top-4 lg:gap-5"
            aria-hidden
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="relative col-span-1"
                style={{ gridColumn: `${i + 1} / span 1` }}
              >
                <div className="absolute left-[58%] right-[-42%] top-0 lg:left-[55%] lg:right-[-45%]">
                  <CurvedArrow bendUp={i % 2 === 0} id={`process-arr-${i}`} />
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-[2] grid grid-cols-4 gap-3 lg:gap-5">
            {steps.map((step, i) => (
              <FadeIn key={step.n} delay={i * 0.08} className="overflow-visible">
                <div className="relative flex h-full flex-col items-center text-center">
                  <div className="relative z-[2] mb-5 flex h-[76px] w-[76px] items-center justify-center lg:h-[88px] lg:w-[88px]">
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full border border-accent/20"
                    />
                    <span
                      aria-hidden
                      className="absolute inset-[7px] rounded-full border-2 border-accent/35"
                    />
                    <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white font-display text-xl font-extrabold text-accent shadow-[0_8px_22px_rgba(21,128,61,0.2)] lg:h-14 lg:w-14 lg:text-2xl">
                      {step.n}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-extrabold text-primary lg:text-xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-muted">
                    {step.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Mobile — dashed line + visible down arrow */}
        <div className="md:hidden">
          {steps.map((step, i) => (
            <FadeIn key={step.n} delay={i * 0.05}>
              <div className="relative flex gap-4 pb-10 last:pb-0">
                {i < steps.length - 1 ? (
                  <span
                    aria-hidden
                    className="absolute left-[23px] top-[52px] flex h-[calc(100%-44px)] w-0 flex-col items-center"
                  >
                    <span className="w-0 flex-1 border-l-2 border-dashed border-accent" />
                    <ArrowDown
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                      strokeWidth={2.75}
                    />
                  </span>
                ) : null}

                <div className="relative z-[1] flex h-12 w-12 shrink-0 items-center justify-center">
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full border border-accent/25"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-1 rounded-full border border-accent/40"
                  />
                  <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white font-display text-base font-extrabold text-accent shadow-sm">
                    {step.n}
                  </span>
                </div>

                <div className="pt-1">
                  <h3 className="font-display text-lg font-extrabold text-primary">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 font-body text-sm leading-relaxed text-muted">
                    {step.desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
