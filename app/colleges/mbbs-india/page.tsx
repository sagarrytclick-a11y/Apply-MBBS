"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Headphones,
  Landmark,
  MapPin,
  Users,
} from "lucide-react";
import { dataCache, CACHE_KEYS } from "@/lib/data-cache";
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
    .replace(/\s+/g, "-");
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
}

interface StateData {
  id: number;
  name: string;
  image: string;
  description: string;
  colleges: CollegeData[];
}

const MbbsIndiaPage: React.FC = () => {
  const { openPopup } = usePopup();
  const [states, setStates] = useState<StateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "Government" | "Private">("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const collegesPerPage = 12;
  const phoneTel = SITE_IDENTITY.contact.phone
    .split(",")[0]
    .trim()
    .replace(/[^0-9+]/g, "");

  useEffect(() => {
    try {
      const data = dataCache.get(CACHE_KEYS.MBBS_INDIA);
      setStates(data.states || []);
    } catch (err) {
      console.error("Data loading error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const allColleges = useMemo(
    () => shuffle(states.flatMap((s) => s.colleges), dailySeed() + 61),
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
          const matchesType =
            selectedType === "all" || college.type === selectedType;
          const matchesSearch =
            college.name.toLowerCase().includes(search.toLowerCase()) ||
            college.city.toLowerCase().includes(search.toLowerCase());
          return matchesState && matchesType && matchesSearch;
        }),
        dailySeed() + 61 + selectedState.length + selectedType.length
      ),
    [allColleges, selectedState, selectedType, search, states]
  );

  const totalPages = Math.ceil(filteredColleges.length / collegesPerPage) || 1;
  const currentColleges = filteredColleges.slice(
    (currentPage - 1) * collegesPerPage,
    currentPage * collegesPerPage
  );

  const govtCount = allColleges.filter((c) => c.type === "Government").length;
  const totalSeats = allColleges.reduce((acc, c) => acc + (c.seats || 0), 0);

  if (loading) return <CollegeGridSkeleton count={9} />;

  return (
    <div className="min-h-screen bg-background font-body">
      <PageHero
        surface="primary"
        pattern="grid"
        eyebrow="MBBS India"
        title={
          <>
            Shortlist your{" "}
            <span className="text-secondary">MBBS college in India</span>
          </>
        }
        description="Compare government and private medical colleges by fees, seats, rankings, and counselling routes — before you lock a preference."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MBBS India" },
        ]}
        image="https://i.pinimg.com/736x/20/b9/9e/20b99e9d8c89e14bc61214c2884b0aff.jpg"
        imageAlt="MBBS colleges in India"
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/contact">
            <Button size="lg" className="group">
              Plan my shortlist
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Button variant="secondary" size="lg" onClick={openPopup}>
            <Headphones className="h-4 w-4" />
            Talk to a counsellor
          </Button>
        </div>
      </PageHero>

      {/* Stats band */}
      <section className="border-b border-border bg-white">
        <div className="he-container py-5 sm:py-6">
          <div className="grid grid-cols-3 divide-x divide-border">
            {[
              { icon: Building2, value: `${allColleges.length}+`, label: "Colleges" },
              { icon: Users, value: `${totalSeats.toLocaleString()}+`, label: "Seats" },
              { icon: Landmark, value: `${govtCount}+`, label: "Government" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-center gap-2.5 px-2 sm:gap-3 sm:px-4">
                <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-accent/10 text-accent-deep sm:inline-flex">
                  <s.icon className="h-4 w-4" />
                </span>
                <div className="text-center sm:text-left">
                  <p className="font-display text-lg font-extrabold text-primary sm:text-2xl">
                    {s.value}
                  </p>
                  <p className="font-body text-[10px] font-semibold uppercase tracking-wide text-muted sm:text-xs">
                    {s.label}
                  </p>
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
                Explore colleges
              </p>
              <h2 className="font-display text-2xl font-extrabold text-primary sm:text-3xl">
                {selectedState
                  ? `MBBS in ${selectedState}`
                  : "Filter by ownership & state"}
              </h2>
            </div>
            <p className="font-body text-sm text-muted">
              {filteredColleges.length} colleges match
            </p>
          </div>

          <div className="sticky top-[6.5rem] z-30 mb-6 space-y-3 rounded-[16px] border border-border bg-white/95 p-3 shadow-[0_8px_28px_rgba(15,23,42,0.06)] backdrop-blur-md sm:p-4">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: "all", label: "All colleges" },
                  { id: "Government", label: "Government" },
                  { id: "Private", label: "Private" },
                ] as const
              ).map((t) => {
                const active = selectedType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSelectedType(t.id);
                      setCurrentPage(1);
                    }}
                    className={`rounded-full border px-4 py-2 font-body text-sm font-bold transition-colors ${
                      active
                        ? "border-accent bg-accent text-white"
                        : "border-border bg-surface text-text hover:border-accent/40"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            <CollegeFilterBar
              className="mb-0"
              search={search}
              onSearchChange={(v) => {
                setSearch(v);
                setCurrentPage(1);
              }}
              searchPlaceholder="Search college or city..."
              resultCount={filteredColleges.length}
              onReset={() => {
                setSearch("");
                setSelectedState("");
                setSelectedType("all");
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
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-surface text-primary hover:border-primary/30"
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
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-surface text-primary hover:border-primary/30"
                  }`}
                >
                  <MapPin className="h-3 w-3 opacity-70" />
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {filteredColleges.length === 0 ? (
            <div className="rounded-[16px] border border-dashed border-border bg-white py-16 text-center">
              <Building2 className="mx-auto mb-3 h-10 w-10 text-border" />
              <p className="font-body text-base font-semibold text-muted">
                Nothing matches this search — try another state or type.
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
                    type={college.type || "Medical"}
                    ranking={college.ranking}
                    fees={college.fees}
                    href={`/colleges/${collegeSlug(college.name)}`}
                    tone="india"
                  />
                ))}
              </div>
              <Pagination
                className="mt-10"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 360, behavior: "smooth" });
                }}
                summary={`Page ${currentPage} of ${totalPages} · ${filteredColleges.length} colleges`}
              />
            </>
          )}
        </div>
      </section>

      <PageCTA
        title="Stuck between colleges or states?"
        description="We’ll walk through NEET counselling steps, realistic shortlists, and paperwork for Indian MBBS seats."
        primaryLabel="Request counselling"
        primaryHref="/contact"
        secondaryLabel="Call us"
        secondaryHref={`tel:${phoneTel}`}
      />
    </div>
  );
};

export default MbbsIndiaPage;
