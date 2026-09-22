"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";
import HeroSearch from "@/components/home/HeroSearch";

type Slide = {
  id: string;
  src: string;
  alt: string;
  badge: string;
  titleLine1: string;
  titleLine2: string;
  featuredLabel: string;
  featuredName: string;
  desc: string;
  primaryHref?: string;
  secondaryHref: string;
  secondaryLabel: string;
};

const SLIDES: Slide[] = [
  {
    id: "india",
    src: "/hero/hero-1.png",
    alt: "Female medical student in white coat with stethoscope",
    badge: "MBBS in India - Leading Colleges",
    titleLine1: "Study MBBS in",
    titleLine2: "India's Top Colleges",
    featuredLabel: "FEATURED COLLEGE (INDIA)",
    featuredName: "Maulana Azad Medical College, Delhi",
    desc: "Admission guidance for MBBS across India — counseling, college shortlisting, and documentation support.",
    secondaryHref: "/colleges/mbbs-india",
    secondaryLabel: "Explore States",
  },
  {
    id: "abroad",
    src: "/hero/hero-2.png",
    alt: "Healthcare professional guiding MBBS abroad",
    badge: "MBBS Abroad - Global Campuses",
    titleLine1: "Study MBBS",
    titleLine2: "Abroad with Confidence",
    featuredLabel: "FEATURED DESTINATION (ABROAD)",
    featuredName: "Kyrgyz State Medical Academy, Bishkek",
    desc: "Choose NMC-aligned universities abroad — fees, recognition, and return pathways compared for you.",
    secondaryHref: "/colleges/mbbs-abroad",
    secondaryLabel: "Explore Countries",
  },
  {
    id: "mdms",
    src: "/hero/hero-3.png",
    alt: "Medical students at international university",
    badge: "MD / MS - Specialisation Seats",
    titleLine1: "Secure Your",
    titleLine2: "MD / MS Seat",
    featuredLabel: "FEATURED COLLEGE (MD / MS)",
    featuredName: "King George's Medical University, Lucknow",
    desc: "Clear seat maps, state cut-offs, and quota guidance for PG specialisation across India.",
    secondaryHref: "/colleges/md-ms",
    secondaryLabel: "Explore Specialisations",
  },
];

export default function HeroSection() {
  const [slide, setSlide] = useState(0);
  const [typed, setTyped] = useState("");
  const [tick, setTick] = useState(0);

  const active = SLIDES[slide];

  const goNext = useCallback(() => {
    setSlide((p) => (p + 1) % SLIDES.length);
    setTick((t) => t + 1);
  }, []);

  const goPrev = useCallback(() => {
    setSlide((p) => (p - 1 + SLIDES.length) % SLIDES.length);
    setTick((t) => t + 1);
  }, []);

  // auto rotate
  useEffect(() => {
    const id = window.setInterval(() => {
      setSlide((p) => (p + 1) % SLIDES.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, [tick]);

  // typewriter for featured college name
  useEffect(() => {
    setTyped("");
    let i = 0;
    const full = active.featuredName;
    const iv = window.setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) window.clearInterval(iv);
    }, 32);
    return () => window.clearInterval(iv);
  }, [active.featuredName, slide]);

  return (
    <section className="relative isolate overflow-hidden bg-primary font-body">
      {/* Background: Forest Emerald — matches site theme (primary + accent) */}
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#0f172a_0%,#14532d_52%,#052e16_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 opacity-[0.55]"
        style={{
          background:
            "radial-gradient(ellipse 75% 68% at 55% 38%, rgba(34,197,94,0.22), transparent 58%), radial-gradient(ellipse 60% 50% at 86% 70%, rgba(21,128,61,0.45), transparent 60%)",
        }}
        aria-hidden
      />

      {/* Globe watermark - big faded globe on right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[12%] top-1/2 hidden h-[780px] w-[780px] -translate-y-1/2 opacity-[0.14] lg:block"
      >
        <div className="absolute inset-0 rounded-full border-[1.5px] border-white/20" />
        <div className="absolute inset-[10%] rounded-full border border-white/10" />
        <div className="absolute inset-[20%] rounded-full border border-white/10" />
        {/* latitude lines */}
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/15" />
        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/15" />
        <div className="absolute left-1/2 top-1/2 h-[88%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/12" />
        <div className="absolute left-1/2 top-1/2 h-[62%] w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/12" />
        {/* dots for locations */}
        <span className="absolute left-[48%] top-[32%] h-1.5 w-1.5 rounded-full bg-white/80" />
        <span className="absolute left-[62%] top-[46%] h-1 w-1 rounded-full bg-white/60" />
        <span className="absolute left-[38%] top-[58%] h-1 w-1 rounded-full bg-white/50" />
        {/* soft fill */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.18),transparent_55%)]" />
      </div>

      {/* ECG / heartbeat line at bottom — soft emerald tint */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[90px] opacity-[0.22] lg:block">
        <svg viewBox="0 0 1200 90" preserveAspectRatio="none" className="h-full w-full">
          <path
            d="M0 55 H 520 L 545 55 L 555 18 L 568 82 L 582 8 L 595 70 L 608 55 H 720 L 735 55 L 742 30 L 752 75 L 762 20 L 772 55 H 880 L 895 55 L 902 35 L 910 68 L 920 55 H 1200"
            fill="none"
            stroke="rgba(134,239,172,0.95)"
            strokeWidth="1.2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Layout: image left, content right */}
      <div className="relative mx-auto flex min-h-[520px] max-w-[1360px] flex-col lg:min-h-[540px] lg:flex-row">
        {/* LEFT - image — soft feathered, not square */}
        <div className="relative order-1 h-[320px] w-full shrink-0 sm:h-[360px] lg:order-1 lg:h-auto lg:w-[52%]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.src}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 overflow-hidden lg:rounded-r-[28px] lg:rounded-bl-[20px]"
              style={{
                // Feather the image edges — right and bottom softly dissolve
                maskImage:
                  "linear-gradient(to right, black 68%, transparent 100%), linear-gradient(to bottom, black 84%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, black 68%, transparent 100%), linear-gradient(to bottom, black 84%, transparent 100%)",
                maskComposite: "intersect",
                WebkitMaskComposite: "source-in",
              }}
            >
              <Image
                src={active.src}
                alt={active.alt}
                fill
                priority={slide === 0}
                sizes="(max-width: 1024px) 100vw, 52vw"
                className="object-cover object-[center_18%] lg:object-[center_16%]"
              />
              {/* Deep emerald veil — makes white coat pop and removes hard box */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-primary/55 lg:to-primary/70" aria-hidden />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/0 to-transparent opacity-60 lg:from-primary/40" aria-hidden />
              {/* Subtle inner glow on edge */}
              <div className="absolute inset-0 hidden rounded-r-[28px] shadow-[inset_-1px_0_0_rgba(255,255,255,0.12)] lg:block" aria-hidden />
            </motion.div>
          </AnimatePresence>
          {/* Soft outer glow behind image — removes square cut feel on desktop */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden -z-10 blur-[18px] lg:block"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 40% 50%, rgba(34,197,94,0.14), transparent 70%)",
            }}
          />
        </div>

        {/* RIGHT - content */}
        <div className="relative order-2 flex w-full flex-1 flex-col justify-center px-5 py-8 sm:px-8 sm:py-10 lg:w-[48%] lg:px-10 lg:py-12 xl:pl-14 xl:pr-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* badge — accent-tinted */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-accent-soft" />
                <span className="font-body text-[11px] font-semibold tracking-wide text-white sm:text-xs">
                  {active.badge}
                </span>
              </div>

              {/* heading — second line uses theme accent-soft */}
              <h1 className="mt-4 font-display text-[30px] font-extrabold leading-[0.98] tracking-tight sm:text-[38px] lg:text-[42px] xl:text-[46px]">
                <span className="block text-white">{active.titleLine1}</span>
                <span className="block text-accent-soft">{active.titleLine2}</span>
              </h1>

              {/* featured college glass card with typewriter */}
              <div className="mt-5 rounded-[14px] border border-white/15 bg-white/[0.08] px-4 py-4 backdrop-blur-md sm:px-5 sm:py-4">
                <p className="font-body text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">
                  {active.featuredLabel}
                </p>
                <p className="mt-1.5 font-body text-[15px] font-bold leading-snug text-white sm:text-[17px]">
                  {typed}
                  <span className="ml-0.5 inline-block h-[1.05em] w-[2px] -translate-y-px animate-pulse bg-accent-bright align-middle" aria-hidden />
                </p>
              </div>

              <p className="mt-4 max-w-[38ch] font-body text-[13px] leading-relaxed text-white/80 sm:text-[14px]">
                {active.desc}
              </p>

              {/* CTAs — search opens overlay (replaces Get Expert Counselling) */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <HeroSearch variant="hero" />

                <Link
                  href={active.secondaryHref}
                  className="inline-flex h-[46px] items-center justify-center rounded-[10px] border border-white/70 bg-white/0 px-6 font-body text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-primary sm:h-[48px]"
                >
                  {active.secondaryLabel}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </div>

      {/* Bottom controls — prev / dots / next (theme, centered below content) */}
      <div className="relative z-10 flex items-center justify-center gap-3 px-5 pb-7 pt-3 sm:pb-8">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous slide"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white hover:text-primary sm:h-10 sm:w-10"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
        </button>

        <div className="flex items-center gap-2 px-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setSlide(i);
                setTick((t) => t + 1);
              }}
              aria-label={`Go to ${s.badge}`}
              aria-current={i === slide}
              className={`h-1.5 rounded-full transition-all ${
                i === slide ? "w-8 bg-accent-bright" : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next slide"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white hover:text-primary sm:h-10 sm:w-10"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
