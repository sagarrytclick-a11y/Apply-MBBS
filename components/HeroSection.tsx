"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { usePopup } from "@/contexts/PopupContext";
import HeroSearch from "@/components/home/HeroSearch";

const SLIDES = [
  {
    src: "/hero/hero-1.png",
    alt: "Medical students in white coats preparing for MBBS admissions",
    section: "MBBS India",
    caption: "State counselling, cut-offs, and fee maps you can trust",
  },
  {
    src: "/hero/hero-2.png",
    alt: "Healthcare professional ready to guide your medical career",
    section: "MBBS Abroad",
    caption: "Destinations reviewed with recognition and return pathways",
  },
  {
    src: "/hero/hero-3.png",
    alt: "Medical students training at an international university campus",
    section: "MD / MS",
    caption: "Specialisation routes with seat and state clarity",
  },
] as const;

const HEADLINES = [
  "Study Medicine in India",
  "Pursue MBBS Overseas",
  "Plan Your MD / MS Seat",
  "Navigate NEET Counselling",
] as const;

const QUICK_LINKS = [
  { label: "MBBS India", href: "/colleges/mbbs-india" },
  { label: "MBBS Abroad", href: "/colleges/mbbs-abroad" },
  { label: "MD / MS", href: "/colleges/md-ms" },
  { label: "Estimate your rank", href: "/neet-rank-predictor" },
] as const;

export default function HeroSection() {
  const { openPopup } = usePopup();
  const [slide, setSlide] = useState(0);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [tick, setTick] = useState(0);

  const goPrev = useCallback(() => {
    setSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    setTick((t) => t + 1);
  }, []);

  const goNext = useCallback(() => {
    setSlide((prev) => (prev + 1) % SLIDES.length);
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, [tick]);

  useEffect(() => {
    const full = HEADLINES[headlineIndex];
    const delay = deleting ? 36 : typed === full ? 1600 : 72;

    const id = window.setTimeout(() => {
      if (!deleting && typed === full) {
        setDeleting(true);
        return;
      }
      if (deleting && typed === "") {
        setDeleting(false);
        setHeadlineIndex((prev) => (prev + 1) % HEADLINES.length);
        return;
      }
      const next = deleting
        ? full.slice(0, Math.max(0, typed.length - 1))
        : full.slice(0, typed.length + 1);
      setTyped(next);
    }, delay);

    return () => window.clearTimeout(id);
  }, [typed, deleting, headlineIndex]);

  const active = SLIDES[slide];

  return (
    <section className="relative z-30 isolate min-h-[min(72vh,640px)] overflow-hidden bg-primary sm:min-h-[min(58vh,520px)] sm:overflow-visible">
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={active.src}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
          <Image
              src={active.src}
              alt={active.alt}
              fill
              priority={slide === 0}
              sizes="100vw"
              quality={75}
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.72)_0%,rgba(15,23,42,0.55)_42%,rgba(15,23,42,0.78)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(21,128,61,0.2),transparent_58%)]" />
      </div>

      <div className="he-container relative z-10 flex min-h-[min(72vh,640px)] flex-col items-center justify-center px-4 py-14 text-center sm:min-h-[min(58vh,520px)] sm:py-14">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-[2.35rem]"
        >
          {SITE_IDENTITY.name}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-3 max-w-3xl font-display text-[1.75rem] font-extrabold leading-[1.12] tracking-tight text-white sm:text-4xl md:text-[2.75rem]"
        >
          <span className="sr-only">MBBS India, abroad, and MD/MS counselling</span>
          <span aria-hidden className="inline-flex min-h-[1.15em] items-center justify-center">
            {typed}
            <span className="ml-1 inline-block h-[0.85em] w-[3px] animate-pulse rounded-full bg-accent" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-3 max-w-xl font-body text-sm leading-relaxed text-white/80 sm:text-[15px]"
        >
          {SITE_IDENTITY.tagline}. Look up institutes by name, city, or track —
          then review fees and pathways for India or overseas study.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16 }}
          className="relative z-40 mt-6 w-full max-w-xl sm:mt-7 sm:max-w-2xl"
        >
          <HeroSearch />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="mt-5 flex flex-wrap items-center justify-center gap-2"
        >
          {QUICK_LINKS.map((link, i) => (
            <span key={link.href} className="inline-flex items-center gap-2">
              {i > 0 && (
                <span className="text-white/30" aria-hidden>
                  ·
                </span>
              )}
              <Link
                href={link.href}
                className="font-body text-xs font-semibold text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline sm:text-[13px]"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="mt-5"
        >
          <button
            type="button"
            onClick={openPopup}
            className="inline-flex h-12 items-center gap-2 rounded-[12px] bg-white px-6 font-body text-sm font-extrabold text-primary transition-transform hover:-translate-y-0.5 hover:bg-white/95"
          >
            Talk to a counsellor
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>

        <div
          className="mt-7 flex items-center gap-3"
          aria-label="Hero image slides"
        >
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous slide"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors hover:border-accent hover:bg-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>

          <div className="flex items-center gap-2">
            {SLIDES.map((item, index) => (
              <button
                key={item.src}
                type="button"
                aria-label={`Show ${item.section}`}
                aria-current={index === slide}
                onClick={() => {
                  setSlide(index);
                  setTick((t) => t + 1);
                }}
                className={`h-2 rounded-full transition-all ${
                  index === slide
                    ? "w-7 bg-accent"
                    : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next slide"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors hover:border-accent hover:bg-accent"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-3 z-20 sm:bottom-5 sm:left-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.section}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="inline-flex max-w-[min(100vw-5.5rem,320px)] items-center gap-2 rounded-full border border-white/20 bg-white/95 px-3 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-md sm:gap-2.5 sm:px-3.5 sm:py-2"
          >
            <p className="truncate font-body text-[10px] font-bold uppercase tracking-[0.12em] text-accent-deep sm:text-[11px]">
              {active.section}
            </p>
            <span className="h-3 w-px shrink-0 bg-border" aria-hidden />
            <p className="shrink-0 font-body text-[10px] font-semibold tabular-nums text-muted sm:text-[11px]">
              {String(slide + 1).padStart(2, "0")} /{" "}
              {String(SLIDES.length).padStart(2, "0")}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
