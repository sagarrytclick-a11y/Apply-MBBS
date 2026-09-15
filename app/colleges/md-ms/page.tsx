"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  Headphones,
  MapPin,
  Stethoscope,
} from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { PageCTA } from "@/components/ui/PageCTA";
import { Button } from "@/components/ui/Button";
import { CollegeFilterBar } from "@/components/ui/CollegeFilterBar";
import { CollegeMediaCard } from "@/components/ui/CollegeMediaCard";
import { Pagination } from "@/components/ui/Pagination";
import { CollegeGridSkeleton } from "@/components/ui/Skeleton";
import { usePopup } from "@/contexts/PopupContext";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { dailySeed, shuffle } from "@/lib/shuffle";

function collegeSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

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
  admissionProcess?: string;
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

const formatSeats = (num: number) => {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
  return `${num}+`;
};

const MdMsPage: React.FC = () => {
  const { openPopup } = usePopup();
  const [states, setStates] = useState<StateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const collegesPerPage = 12;
  const phoneTel = SITE_IDENTITY.contact.phone
    .split(",")[0]
    .trim()
    .replace(/[^0-9+]/g, "");

  useEffect(() => {
    const loadData = async () => {
      try {
        let data: MdMsData | null = null;
        try {
          const res = await fetch("/md-ms.json");
          if (res.ok) data = await res.json();
        } catch {
          // fallback empty
        }
        setStates(data?.states || []);
      } catch (err) {
        console.error("Data loading error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const allColleges = useMemo(
    () => shuffle(states.flatMap((s) => s.colleges), dailySeed() + 81),
    [states]
  );

  const filteredColleges = useMemo(
    () =>
      shuffle(
        allColleges.filter((college) => {
          const matchesState =
            selectedState === "" ||
            states.find(
              (s) =>
                s.name === selectedState &&
                s.colleges.some((c) => c.id === college.id)
            );
          const matchesSearch =
            college.name.toLowerCase().includes(search.toLowerCase()) ||
            college.city.toLowerCase().includes(search.toLowerCase());
          return matchesState && matchesSearch;
        }),
        dailySeed() + 81 + selectedState.length
      ),
    [allColleges, selectedState, search, states]
  );

  const totalPages = Math.ceil(filteredColleges.length / collegesPerPage) || 1;
  const currentColleges = filteredColleges.slice(
    (currentPage - 1) * collegesPerPage,
    currentPage * collegesPerPage
  );

  const totalSeats = allColleges.reduce((acc, c) => acc + (c.seats || 0), 0);

  if (loading) return <CollegeGridSkeleton count={9} />;

  return (
    <div className="min-h-screen bg-background font-body">
      <PageHero
        surface="primary"
        pattern="grid"
        eyebrow="NEET PG · MD / MS"
        title={
          <>
            MD & MS seats with{" "}
            <span className="text-secondary">sharper shortlists</span>
          </>
        }
        description="Browse postgraduate medical colleges across India — fees, seat context, and counselling-led guidance for NEET PG aspirants."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MD/MS" },
        ]}
        image="https://i.pinimg.com/736x/7c/cb/9f/7ccb9f3dc555f4784c8fb0d0d25eabc8.jpg"
        imageAlt="MD MS colleges in India"
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/contact">
            <Button size="lg" className="group">
              NEET PG help
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Button variant="secondary" size="lg" onClick={openPopup}>
            <Headphones className="h-4 w-4" />
            Speak with PG counsellor
          </Button>
        </div>
      </PageHero>

      {/* PG focus strip — distinct from UG pages */}
      <section className="border-y border-border bg-primary text-white">
        <div className="he-container py-5 sm:py-6">
          <div className="grid gap-4 sm:grid-cols-3 sm:divide-x sm:divide-white/15">
            {[
              {
                icon: GraduationCap,
                value: `${states.length}+`,
                label: "States listed",
              },
              {
                icon: Stethoscope,
                value: `${allColleges.length}+`,
                label: "MD/MS colleges",
              },
              {
                icon: MapPin,
                value: formatSeats(totalSeats),
                label: "PG seats shown",
              },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`flex items-center gap-3 ${i > 0 ? "sm:pl-6" : ""}`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-accent text-white">
                  <s.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-display text-xl font-extrabold text-white sm:text-2xl">
                    {s.value}
                  </p>
                  <p className="font-body text-xs text-white/65">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="he-section">
        <div className="he-container">
          <div className="mb-5 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-1.5 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-accent-deep">
                Postgraduate directory
              </p>
              <h2 className="font-display text-2xl font-extrabold text-primary sm:text-3xl">
                {selectedState
                  ? `MD/MS in ${selectedState}`
                  : "Leading MD/MS colleges"}
              </h2>
            </div>
            <p className="font-body text-sm text-muted">
              {filteredColleges.length} colleges match
            </p>
          </div>

          {/* Compact sticky filters — no empty sidebar column */}
          <div className="sticky top-[6.5rem] z-30 mb-6 space-y-3 rounded-[16px] border border-border bg-white/95 p-3 shadow-[0_8px_28px_rgba(15,23,42,0.06)] backdrop-blur-md sm:p-4">
            <CollegeFilterBar
              className="mb-0"
              search={search}
              onSearchChange={(v) => {
                setSearch(v);
                setCurrentPage(1);
              }}
              searchPlaceholder="Search PG college or city..."
              resultCount={filteredColleges.length}
              onReset={() => {
                setSearch("");
                setSelectedState("");
                setCurrentPage(1);
              }}
              selects={[]}
            />
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                type="button"
                onClick={() => {
                  setSelectedState("");
                  setCurrentPage(1);
                }}
                className={`shrink-0 rounded-[10px] border px-3.5 py-2 font-body text-xs font-bold transition-colors ${
                  selectedState === ""
                    ? "border-accent bg-accent text-white"
                    : "border-border bg-surface text-primary hover:border-accent/40"
                }`}
              >
                All states · {allColleges.length}
              </button>
              {states.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSelectedState(s.name);
                    setCurrentPage(1);
                  }}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-[10px] border px-3.5 py-2 font-body text-xs font-bold transition-colors ${
                    selectedState === s.name
                      ? "border-accent bg-accent text-white"
                      : "border-border bg-surface text-primary hover:border-accent/40"
                  }`}
                >
                  <MapPin className="h-3 w-3 opacity-70" />
                  {s.name}
                  <span
                    className={
                      selectedState === s.name ? "text-white/80" : "text-muted"
                    }
                  >
                    {s.colleges.length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {filteredColleges.length === 0 ? (
            <div className="rounded-[16px] border border-dashed border-border bg-white py-16 text-center">
              <GraduationCap className="mx-auto mb-3 h-10 w-10 text-border" />
              <p className="font-body text-base font-semibold text-muted">
                No MD/MS colleges match — widen your state or search.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {currentColleges.map((college) => (
                  <CollegeMediaCard
                    key={college.id}
                    name={college.name}
                    city={college.city}
                    image={college.image}
                    type={college.type || "MD/MS"}
                    ranking={college.ranking}
                    fees={college.fees}
                    href={`/colleges/${collegeSlug(college.name)}`}
                    fallbackImage="/fallback-college.jpg"
                    tone="pg"
                  />
                ))}
              </div>
              <Pagination
                className="mt-10"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 380, behavior: "smooth" });
                }}
                summary={`Page ${currentPage} of ${totalPages} · ${filteredColleges.length} colleges`}
              />
            </>
          )}
        </div>
      </section>

      <section className="border-t border-border bg-surface he-section">
        <div className="he-container mx-auto max-w-3xl text-center">
          <Stethoscope className="mx-auto h-8 w-8 text-accent-deep" />
          <h2 className="mt-3 font-display text-2xl font-extrabold text-primary sm:text-3xl">
            NEET PG calls for a separate playbook
          </h2>
          <p className="mt-2 font-body text-sm leading-relaxed text-muted sm:text-[15px]">
            Choice filling, state quotas, and branch preference weigh heavier
            than UG. Work with a counsellor who handles MD/MS pathways every day.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={openPopup}>
              Schedule PG counselling
            </Button>
            <Link href="/neet-rank-predictor">
              <Button variant="secondary" size="lg">
                Try NEET UG predictor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PageCTA
        title="Planning your MD/MS counselling round?"
        description="Choice-filling strategy, documents, and a candid seat view against your NEET PG rank."
        primaryLabel="Request counselling"
        primaryHref="/contact"
        secondaryLabel="Call a counsellor"
        secondaryHref={`tel:${phoneTel}`}
      />
    </div>
  );
};

export default MdMsPage;
