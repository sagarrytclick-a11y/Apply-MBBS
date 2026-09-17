"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaCheckCircle,
  FaUniversity,
  FaUserMd,
} from "react-icons/fa";
import { usePopup } from "@/contexts/PopupContext";
import { dailySeed, shuffle } from "@/lib/shuffle";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { StateDetailSkeleton } from "@/components/ui/Skeleton";

interface CollegeData {
  id: number;
  name: string;
  city: string;
  fees: string;
  seats: number;
  recognition: string;
  ranking: string;
  type: string;
  image: string;
  yearOfEstd?: string;
}

interface StateData {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string;
  colleges: CollegeData[];
}

interface MdMsData {
  states: StateData[];
}

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const mdSpecializations = [
  "General Medicine",
  "Pediatrics",
  "Dermatology",
  "Anesthesiology",
  "Radiology",
  "Pathology",
  "Psychiatry",
  "Pharmacology",
];

const msSpecializations = [
  "General Surgery",
  "Orthopedics",
  "Ophthalmology",
  "ENT",
  "Obstetrics and Gynecology",
  "Plastic Surgery",
];

export default function MdMsSlugPage() {
  const params = useParams();
  const router = useRouter();
  const { openPopup, updateFormData } = usePopup();

  const [stateData, setStateData] = useState<StateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const slug = String(params.slug || "");

        const res = await fetch("/md-ms.json");
        if (!res.ok) throw new Error("Failed to fetch MD/MS data");

        const data: MdMsData = await res.json();

        // College slugs now live at /colleges/[slug] — redirect old URLs
        for (const state of data.states || []) {
          const found = (state.colleges || []).find(
            (c) => toSlug(c.name) === slug
          );
          if (found) {
            router.replace(`/colleges/${slug}`);
            return;
          }
        }

        const foundState = (data.states || []).find(
          (s) =>
            s.slug === slug ||
            toSlug(s.name) === slug ||
            s.name.toLowerCase().replace(/\s+/g, "-") === slug
        );

        if (foundState) {
          setStateData(foundState);
          setLoading(false);
          return;
        }

        setError("State not found");
        setLoading(false);
      } catch {
        setError("Failed to load details");
        setLoading(false);
      }
    };

    load();
  }, [params.slug, router]);

  if (loading) {
    return <StateDetailSkeleton />;
  }

  if (error || !stateData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-4">
        <div className="he-card p-10 text-center max-w-lg w-full hover:transform-none">
          <h1 className="font-display text-3xl font-extrabold text-primary mb-4">
            Not Found
          </h1>
          <p className="font-body text-muted mb-8">
            {error || "Requested details do not exist"}
          </p>
          <Link href="/colleges/md-ms">
            <Button size="md">Back to MD/MS</Button>
          </Link>
        </div>
      </div>
    );
  }

  const govtColleges = shuffle(
    stateData.colleges.filter((c) => c.type === "Government"),
    dailySeed() + 91
  );
  const privateColleges = shuffle(
    stateData.colleges.filter((c) => c.type !== "Government"),
    dailySeed() + 92
  );
  const totalSeats = stateData.colleges.reduce(
    (acc, curr) => acc + (curr.seats || 0),
    0
  );

  const renderCollegeTable = (colleges: CollegeData[], emptyMessage?: string) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px] font-body">
        <thead>
          <tr className="bg-surface border-b border-border">
            <th className="py-5 px-6 sm:px-8 font-bold text-muted uppercase text-xs tracking-wide">
              College Name & Location
            </th>
            <th className="py-5 px-6 font-bold text-muted uppercase text-xs tracking-wide">
              Seats
            </th>
            <th className="py-5 px-6 font-bold text-muted uppercase text-xs tracking-wide text-right">
              Fee Structure
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {colleges.length > 0 ? (
            colleges.map((c) => (
              <tr
                key={c.id}
                className="hover:bg-surface/80 transition-colors group"
              >
                <td className="py-6 px-6 sm:px-8">
                  <Link
                    href={`/colleges/${toSlug(c.name)}`}
                    className="font-display font-bold text-primary text-base group-hover:text-secondary transition-colors"
                  >
                    {c.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-1 text-muted font-semibold text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {c.city}
                  </div>
                </td>
                <td className="py-6 px-6">
                  <div className="inline-flex items-center px-3 py-1.5 rounded-[10px] bg-surface border border-border text-primary font-bold text-sm">
                    {c.seats || "N/A"}
                  </div>
                </td>
                <td className="py-6 px-6 sm:px-8 text-right">
                  <div className="text-accent-deep font-display font-extrabold text-lg">
                    {c.fees}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="py-16 text-center text-muted font-semibold">
                {emptyMessage || "No colleges data available for this state."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-body">
      <PageHero
        eyebrow="Postgraduate Medical"
        title={
          <>
            MD / MS in <span className="text-accent">{stateData.name}</span>
          </>
        }
        description={stateData.description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MD/MS", href: "/colleges/md-ms" },
          { label: stateData.name },
        ]}
      >
        <div className="flex flex-wrap gap-4 sm:gap-6">
          <div className="flex items-center gap-3 rounded-[12px] border border-white/15 bg-white/5 px-4 py-3">
            <div className="w-10 h-10 rounded-[10px] bg-white/10 flex items-center justify-center border border-white/10">
              <FaUniversity className="text-accent" />
            </div>
            <div>
              <div className="font-display text-2xl font-extrabold text-white">
                {stateData.colleges.length}
              </div>
              <div className="text-xs text-white/60 font-bold uppercase tracking-wider">
                Colleges
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-[12px] border border-white/15 bg-white/5 px-4 py-3">
            <div className="w-10 h-10 rounded-[10px] bg-white/10 flex items-center justify-center border border-white/10">
              <FaUserMd className="text-accent" />
            </div>
            <div>
              <div className="font-display text-2xl font-extrabold text-white">
                {totalSeats}+
              </div>
              <div className="text-xs text-white/60 font-bold uppercase tracking-wider">
                Total Seats
              </div>
            </div>
          </div>
        </div>
      </PageHero>

      <section className="he-section he-container">
        <div className="space-y-8">
          <div className="he-card overflow-hidden hover:transform-none hover:shadow-[var(--shadow-soft)]">
            <div className="p-6 sm:p-8 border-b border-border flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                  Government Institutions
                </h2>
                <p className="font-body text-muted mt-2">
                  Top-ranked state and central government medical colleges.
                </p>
              </div>
              <Button
                size="md"
                onClick={() => {
                  updateFormData({
                    courseInterest: `MD/MS Govt - ${stateData.name}`,
                  });
                  openPopup();
                }}
              >
                Get Guidance
              </Button>
            </div>
            {renderCollegeTable(govtColleges)}
          </div>

          <div className="he-card overflow-hidden hover:transform-none hover:shadow-[var(--shadow-soft)]">
            <div className="p-6 sm:p-8 border-b border-border flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                  Private Universities
                </h2>
                <p className="font-body text-muted mt-2">
                  Leading private medical colleges with clinical excellence.
                </p>
              </div>
              <Button
                variant="accent"
                size="md"
                onClick={() => {
                  updateFormData({
                    courseInterest: `MD/MS Private - ${stateData.name}`,
                  });
                  openPopup();
                }}
              >
                Get Guidance
              </Button>
            </div>
            {renderCollegeTable(
              privateColleges,
              "No private colleges data available for this state."
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 pt-10">
          <div className="lg:col-span-1 he-card bg-primary p-8 sm:p-10 text-white flex flex-col justify-center hover:transform-none hover:border-primary hover:shadow-[var(--shadow-lift)]">
            <h3 className="font-display text-3xl font-extrabold mb-4 leading-tight">
              Available Clinical Courses
            </h3>
            <p className="font-body text-white/70 leading-relaxed mb-8">
              Explore MD and MS specializations available in {stateData.name}.
            </p>
            <Button className="w-full mt-auto" size="lg" onClick={() => openPopup()}>
              Get Guidance
            </Button>
          </div>

          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
            <div className="he-card p-8 hover:transform-none hover:shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-accent/15 rounded-[12px] flex items-center justify-center">
                  <FaUserMd className="text-accent-deep text-xl" />
                </div>
                <h4 className="font-display text-xl font-extrabold text-primary">
                  MD Courses
                </h4>
              </div>
              <ul className="space-y-3">
                {mdSpecializations.map((spec) => (
                  <li
                    key={spec}
                    className="flex items-center gap-3 text-muted font-semibold text-sm"
                  >
                    <FaCheckCircle className="text-accent-deep flex-shrink-0" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="he-card p-8 hover:transform-none hover:shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-[12px] flex items-center justify-center">
                  <FaUniversity className="text-primary text-xl" />
                </div>
                <h4 className="font-display text-xl font-extrabold text-primary">
                  MS Courses
                </h4>
              </div>
              <ul className="space-y-3">
                {msSpecializations.map((spec) => (
                  <li
                    key={spec}
                    className="flex items-center gap-3 text-muted font-semibold text-sm"
                  >
                    <FaCheckCircle className="text-accent-deep flex-shrink-0" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
