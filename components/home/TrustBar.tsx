"use client";

import React from "react";
import { ShieldCheck, Award, Users, BookOpenCheck } from "lucide-react";
import { FadeIn } from "../ui/FadeIn";

const items = [
  { icon: ShieldCheck, label: "Recognition-aware advice" },
  { icon: Award, label: "Over 15 years in admissions" },
  { icon: Users, label: "Parents included by default" },
  { icon: BookOpenCheck, label: "Application-ready paperwork" },
];

export default function TrustBar() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="he-container py-4 sm:py-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map(({ icon: Icon, label }, i) => (
            <FadeIn key={label} delay={i * 0.06}>
              <div className="group flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-border bg-white text-primary shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-accent group-hover:shadow-[0_6px_16px_rgba(21,128,61,0.3)]">
                  <Icon className="h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110" />
                </span>
                <p className="font-body text-sm font-bold text-text leading-snug transition-colors duration-300 group-hover:text-primary">
                  {label}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
