"use client";

import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { usePopup } from "@/contexts/PopupContext";
import { Button } from "../ui/Button";
import { FadeIn } from "../ui/FadeIn";

export default function CTASection() {
  const { openPopup } = usePopup();

  return (
    <section className="he-section bg-background">
      <div className="he-container">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[24px] bg-primary px-5 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14 text-center transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(30,41,59,0.2)]">
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
            <div className="relative z-10 mx-auto max-w-2xl flex flex-col items-center">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white animate-[pulse_2.5s_ease-in-out_infinite]">
                <Sparkles className="h-5 w-5" />
              </span>
              <p className="font-body text-sm font-semibold uppercase tracking-[0.04em] text-accent mb-3">
                Start here
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-white leading-tight">
                Shall we map your admission options?
              </h2>
              <p className="mt-4 font-body text-base sm:text-lg text-white/75 leading-relaxed">
                Build a medical education plan around your NEET score, budget, and
                preferred pathway — with counselling you can follow.
              </p>
              <div className="mt-8">
                <Button onClick={openPopup} size="lg" className="group">
                  Request counselling
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
