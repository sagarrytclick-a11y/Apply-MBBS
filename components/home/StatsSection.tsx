"use client";

import { Building2, BookOpen, HeartHandshake, Users } from "lucide-react";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { FadeIn } from "../ui/FadeIn";

const stats = [
  {
    value: SITE_IDENTITY.statistics.studentsCounselled,
    label: "Aspirants counselled",
    hint: "Domestic & overseas tracks",
    icon: Users,
  },
  {
    value: SITE_IDENTITY.statistics.partnerColleges,
    label: "Colleges in our network",
    hint: "Vetted institutional partners",
    icon: Building2,
  },
  {
    value: SITE_IDENTITY.statistics.yearsExperience,
    label: "Years helping families",
    hint: "Consistent admission support",
    icon: BookOpen,
  },
  {
    value: "95%",
    label: "Would refer us onward",
    hint: "Confidence earned by clarity",
    icon: HeartHandshake,
  },
];

export default function StatsSection() {
  return (
    <section className="he-section bg-background">
      <div className="he-container">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-body text-[11px] font-bold uppercase tracking-[0.16em] text-accent-deep">
              Proven by outcomes
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
              Numbers behind careful counselling
            </h2>
            <p className="mt-3 font-body text-sm leading-relaxed text-muted sm:text-[15px]">
              What happens when advice starts with your score, budget, and what
              the family needs to understand.
            </p>
          </div>
        </FadeIn>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <FadeIn key={stat.label} delay={i * 0.06}>
                <article className="stats-card group relative h-full overflow-hidden rounded-[20px] border border-border bg-white px-4 py-6 sm:px-5 sm:py-7">
                  <span
                    aria-hidden
                    className="absolute bottom-0 left-0 h-[3px] w-0 bg-accent transition-all duration-400 ease-out group-hover:w-full"
                  />

                  <div className="relative">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] border border-border bg-background text-accent-deep transition-all duration-300 group-hover:-translate-y-1 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>

                    <p className="mt-5 font-display text-3xl font-extrabold leading-none tracking-tight text-primary transition-colors duration-300 sm:text-4xl group-hover:text-accent-deep">
                      {stat.value}
                    </p>
                    <p className="mt-3 font-body text-sm font-bold text-primary">
                      {stat.label}
                    </p>
                    <p className="mt-1 font-body text-xs text-muted">
                      {stat.hint}
                    </p>
                  </div>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
