"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { Button } from "../ui/Button";
import { FadeIn } from "../ui/FadeIn";
import { CollegeMediaCard } from "../ui/CollegeMediaCard";
import { dailySeed, shuffle } from "@/lib/shuffle";

interface College {
  id: number;
  name: string;
  city: string;
  fees: string;
  type: string;
  image: string;
  ranking?: string;
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function FeaturedColleges() {
  const [colleges, setColleges] = useState<College[]>([]);

  useEffect(() => {
    fetch("/mbbs-india.json")
      .then((r) => r.json())
      .then((data) => {
        const list: College[] = [];
        const seen = new Set<string>();
        for (const state of data.states || []) {
          for (const college of state.colleges || []) {
            if (seen.has(college.name)) continue;
            seen.add(college.name);
            list.push(college);
          }
        }
        setColleges(shuffle(list, dailySeed() + 31).slice(0, 6));
      })
      .catch(() => setColleges([]));
  }, []);

  return (
    <section className="he-section bg-surface border-y border-border">
      <div className="he-container">
        <FadeIn>
          <div className="mb-8">
            <SectionHeader
              eyebrow="Spotlight campuses"
              title={
                <>
                  Colleges that deserve{" "}
                  <span className="text-secondary">a second look</span>
                </>
              }
              description="A hand-picked slice of our India list — open the full directory for filters, states, and deeper comparison."
            />
          </div>
        </FadeIn>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {colleges.map((college, i) => (
            <FadeIn key={college.id} delay={Math.min(i * 0.06, 0.3)}>
              <CollegeMediaCard
                name={college.name}
                city={college.city}
                image={college.image}
                type={college.type || "Medical"}
                ranking={college.ranking}
                fees={college.fees}
                href={`/colleges/${slugify(college.name)}`}
              />
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.15}>
          <div className="mt-8 flex justify-center">
            <Link href="/colleges/mbbs-india">
              <Button variant="secondary" className="group">
                See the full India list
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
