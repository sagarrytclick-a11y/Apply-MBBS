"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, GraduationCap, Globe2, Stethoscope } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { FadeIn } from "../ui/FadeIn";

const offerings = [
  {
    title: "MBBS across India",
    desc: "State counselling maps, cut-off context, and seat support for government and private colleges.",
    href: "/colleges/mbbs-india",
    badge: "India",
    icon: GraduationCap,
  },
  {
    title: "MBBS beyond India",
    desc: "Side-by-side looks at fees, teaching language, timelines, and destinations reviewed for recognition.",
    href: "/colleges/mbbs-abroad",
    badge: "Abroad",
    icon: Globe2,
  },
  {
    title: "MD / MS specialisation",
    desc: "Postgraduate seat planning across major Indian states with transparent availability context.",
    href: "/colleges/md-ms",
    badge: "PG",
    icon: Stethoscope,
  },
];

export default function OfferingsSection() {
  return (
    <section className="he-section bg-surface border-y border-border">
      <div className="he-container">
        <FadeIn>
          <SectionHeader
            eyebrow="Admission tracks"
            title={
              <>
                Pick the pathway that matches{" "}
                <span className="text-secondary">your score and ambition</span>
              </>
            }
            description="Three structured routes — each counselled with the same careful method, whether you stay in India or look overseas."
            className="mb-8"
          />
        </FadeIn>

        <div className="grid gap-5 md:grid-cols-3">
          {offerings.map((item, i) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.href} delay={i * 0.08}>
                <Link
                  href={item.href}
                  className="he-card he-card-fill group block h-full p-6 sm:p-7"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="he-fill-icon flex h-11 w-11 items-center justify-center rounded-[12px] bg-primary/10 text-primary transition-colors duration-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="he-fill-badge rounded-full bg-accent/15 px-2.5 py-1 font-body text-[10px] font-bold tracking-wide uppercase text-accent-deep transition-colors duration-300">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="he-fill-title mt-5 font-display text-2xl font-bold text-text transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="he-fill-desc mt-3 font-body text-sm text-muted leading-relaxed transition-colors duration-300">
                    {item.desc}
                  </p>
                  <span className="he-fill-link mt-6 inline-flex items-center gap-1.5 font-body text-sm font-bold text-primary transition-colors duration-300">
                    View pathway
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
