"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { FadeIn } from "../ui/FadeIn";

const destinations = [
  {
    name: "Russia",
    slug: "russia",
    image: "https://i.pinimg.com/1200x/29/2d/e2/292de231f2d4bb8572813423294bae60.jpg",
    note: "WHO-listed · English & bilingual tracks",
  },
  {
    name: "Georgia",
    slug: "georgia",
    image: "https://i.pinimg.com/1200x/db/8a/4a/db8a4aa1c8deabf44d9c894cdd6e29f9.jpg",
    note: "European-style training · Steady campuses",
  },
  {
    name: "Kazakhstan",
    slug: "kazakhstan",
    image: "https://i.pinimg.com/1200x/16/01/a1/1601a122fa2792080fd1e57c50abc8ab.jpg",
    note: "Budget-friendly · Large Indian peer group",
  },
  {
    name: "Uzbekistan",
    slug: "uzbekistan",
    image: "https://i.pinimg.com/736x/b4/5d/c9/b45dc94da00ddd4883ae6e3c789227ca.jpg",
    note: "Newer campuses · Rising FMGE results",
  },
];

export default function DestinationsSection() {
  return (
    <section className="he-section bg-background">
      <div className="he-container">
        <FadeIn>
          <SectionHeader
            eyebrow="Overseas options"
            title={
              <>
                Destinations we brief{" "}
                <span className="text-secondary">with real detail</span>
              </>
            }
            description="Recognition, fees, teaching language, and day-to-day living — the factors that matter after the brochure."
            className="mb-8"
          />
        </FadeIn>

        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {destinations.map((d, i) => (
            <FadeIn key={d.slug} delay={i * 0.07}>
              <Link href={`/country/${d.slug}`} className="he-card he-card-photo group overflow-hidden block">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={d.image}
                    alt={`MBBS in ${d.name}`}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/88 via-primary/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-1 transition-transform duration-500 group-hover:translate-y-0">
                    <h3 className="font-display text-base font-bold text-white sm:text-xl">{d.name}</h3>
                    <p className="mt-1 hidden max-h-0 overflow-hidden font-body text-xs text-white/85 opacity-0 transition-all duration-500 sm:block group-hover:max-h-12 group-hover:opacity-100">
                      {d.note}
                    </p>
                    <span className="mt-1.5 inline-flex items-center gap-1 font-body text-[11px] font-bold text-accent sm:mt-2 sm:text-xs">
                      Explore
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2}>
          <div className="mt-8 text-center">
            <Link
              href="/colleges/mbbs-abroad"
              className="group inline-flex items-center gap-1.5 font-body text-sm font-bold text-primary hover:text-secondary transition-colors"
            >
              Browse every abroad pathway
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
