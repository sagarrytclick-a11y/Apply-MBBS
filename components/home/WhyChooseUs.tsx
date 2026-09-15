"use client";

import {
  BadgeCheck,
  Compass,
  FileCheck2,
  Handshake,
  MessageSquareHeart,
  ShieldCheck,
} from "lucide-react";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { FadeIn } from "../ui/FadeIn";
import { usePopup } from "@/contexts/PopupContext";

const benefits = [
  {
    icon: Compass,
    title: "Score-led shortlists",
    desc: "Options filtered by NEET performance, budget, and preference — not glossy marketing claims.",
  },
  {
    icon: MessageSquareHeart,
    title: "Sessions families can follow",
    desc: "Plain talk on tuition, recognition, hostel life, and deadlines so parents leave with answers.",
  },
  {
    icon: FileCheck2,
    title: "Paperwork that stays on track",
    desc: "Structured checklists and reviews keep applications from stalling over missing documents.",
  },
  {
    icon: ShieldCheck,
    title: "Recognition explained",
    desc: "India and overseas routes discussed with NMC context and what it means for your pathway home.",
  },
  {
    icon: BadgeCheck,
    title: "Costs shown upfront",
    desc: "Tuition, hostel, and lesser-known expenses laid out before you lock any decision.",
  },
  {
    icon: Handshake,
    title: "Support past the offer letter",
    desc: "We stay involved through seat confirmation, travel planning, and the first weeks after joining.",
  },
];

export default function WhyChooseUs() {
  const { openPopup } = usePopup();

  return (
    <section className="he-section relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(21,128,61,0.1),transparent_55%)]"
      />

      <div className="he-container relative">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-body text-[11px] font-bold uppercase tracking-[0.16em] text-accent-deep">
              What sets us apart
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
              How {SITE_IDENTITY.name} earns family trust
            </h2>
            <p className="mt-3 font-body text-sm leading-relaxed text-muted sm:text-[15px]">
              Steady guidance for MBBS in India, overseas medicine, and MD/MS —
              built on realistic shortlists and fee honesty.
            </p>
          </div>
        </FadeIn>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <FadeIn key={b.title} delay={i * 0.05}>
                <div className="group h-full rounded-[20px] border border-border bg-white p-6 transition-colors hover:border-accent/40 hover:bg-accent/[0.03]">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] bg-accent/10 text-accent-deep transition-colors group-hover:bg-accent group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-extrabold text-primary">
                    {b.title}
                  </h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-muted">
                    {b.desc}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={0.2}>
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={openPopup}
              className="inline-flex h-12 items-center rounded-[12px] bg-accent px-6 font-body text-sm font-extrabold text-white shadow-[0_8px_24px_rgba(21,128,61,0.3)] transition-all hover:-translate-y-0.5 hover:bg-accent-deep"
            >
              Book a free session
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
