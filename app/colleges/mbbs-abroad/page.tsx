"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Globe2,
  Headphones,
  Plane,
  University,
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
  seats?: number;
  recognition: string;
  ranking: string;
  type: string;
  image: string;
  duration?: string;
  medium?: string;
}

interface CountryData {
  id: number;
  name: string;
  flag: string;
  image: string;
  description?: string;
  universities?: number;
  courses?: string;
  colleges?: CollegeData[];
}

const MbbsAbroadPage: React.FC = () => {
  const { openPopup } = usePopup();
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [canSlideLeft, setCanSlideLeft] = useState(false);
  const [canSlideRight, setCanSlideRight] = useState(false);
  const countrySlideRef = useRef<HTMLDivElement>(null);

  const collegesPerPage = 12;
  const phoneTel = SITE_IDENTITY.contact.phone
    .split(",")[0]
    .trim()
    .replace(/[^0-9+]/g, "");

  const updateCountrySlide = useCallback(() => {
    const el = countrySlideRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanSlideLeft(el.scrollLeft > 4);
    setCanSlideRight(max > 4 && el.scrollLeft < max - 4);
  }, []);

  const slideCountries = (dir: -1 | 1) => {
    const el = countrySlideRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(320, el.clientWidth * 0.7), behavior: "smooth" });
  };

  useEffect(() => {
    try {
      const data = dataCache.get(CACHE_KEYS.MBBS_ABROAD);
      setCountries(data.countries || []);
    } catch (error) {
      console.error("Data loading error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const el = countrySlideRef.current;
    if (!el || loading) return;
    updateCountrySlide();
    el.addEventListener("scroll", updateCountrySlide, { passive: true });
    const ro = new ResizeObserver(updateCountrySlide);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateCountrySlide);
      ro.disconnect();
    };
  }, [loading, countries, updateCountrySlide]);

  const allColleges = useMemo(
    () =>
      shuffle(
        countries.flatMap((country) => country.colleges || []),
        dailySeed() + 71
      ),
    [countries]
  );

  const filteredColleges = useMemo(
    () =>
      shuffle(
        allColleges.filter((college) => {
          const matchCountry =
            !selectedCountry ||
            countries.find(
              (country) =>
                country.name === selectedCountry &&
                country.colleges?.some((c) => c.id === college.id)
            );
          const matchSearch =
            college.name.toLowerCase().includes(search.toLowerCase()) ||
            college.city.toLowerCase().includes(search.toLowerCase());
          return matchCountry && matchSearch;
        }),
        dailySeed() + 71 + selectedCountry.length
      ),
    [allColleges, selectedCountry, search, countries]
  );

  const totalPages = Math.ceil(filteredColleges.length / collegesPerPage) || 1;
  const currentColleges = filteredColleges.slice(
    (currentPage - 1) * collegesPerPage,
    currentPage * collegesPerPage
  );

  if (loading) return <CollegeGridSkeleton count={9} />;

  return (
    <div className="min-h-screen bg-background font-body">
      <PageHero
        surface="primary"
        pattern="grid"
        eyebrow="MBBS Abroad"
        title={
          <>
            Pursue MBBS{" "}
            <span className="text-secondary">at universities abroad</span>
          </>
        }
        description="Explore NMC- and WHO-aligned medical schools overseas — weigh countries, tuition, and English-medium programmes side by side."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MBBS Abroad" },
        ]}
        image="https://i.pinimg.com/736x/13/d5/14/13d5143d220f85f4748b4273236b596a.jpg"
        imageAlt="MBBS universities abroad"
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/contact">
            <Button size="lg" className="group">
              Ask about abroad
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Button variant="secondary" size="lg" onClick={openPopup}>
            <Headphones className="h-4 w-4" />
            Get a country fit
          </Button>
        </div>
      </PageHero>

      {/* Destination summary + country chips */}
      <section className="border-y border-border bg-[#f0fdf4]">
        <div className="he-container py-5 sm:py-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-body text-[11px] font-bold uppercase tracking-[0.14em] text-accent-deep">
                Where to study
              </p>
              <h2 className="mt-1 font-display text-xl font-extrabold text-primary sm:text-2xl">
                Choose a destination, then a campus
              </h2>
            </div>
            <div className="flex gap-4 font-body text-xs font-semibold text-muted sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <Globe2 className="h-3.5 w-3.5 text-accent-deep" />
                {countries.length}+ countries
              </span>
              <span className="inline-flex items-center gap-1.5">
                <University className="h-3.5 w-3.5 text-accent-deep" />
                {allColleges.length}+ universities
              </span>
            </div>
          </div>

          <div className="relative">
            {canSlideLeft && (
              <button
                type="button"
                aria-label="Slide countries left"
                onClick={() => slideCountries(-1)}
                className="absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-primary shadow-[0_4px_14px_rgba(15,23,42,0.12)] transition-colors hover:border-accent hover:text-accent"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            {canSlideRight && (
              <button
                type="button"
                aria-label="Slide countries right"
                onClick={() => slideCountries(1)}
                className="absolute right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-primary shadow-[0_4px_14px_rgba(15,23,42,0.12)] transition-colors hover:border-accent hover:text-accent"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
            <div
              ref={countrySlideRef}
              className="-mx-1 flex touch-pan-x gap-3 overflow-x-auto scroll-smooth px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <button
                type="button"
                onClick={() => {
                  setSelectedCountry("");
                  setCurrentPage(1);
                }}
                className={`flex h-[96px] w-[104px] shrink-0 flex-col items-center justify-center rounded-[14px] border-2 transition-colors ${
                  selectedCountry === ""
                    ? "border-accent bg-white shadow-[0_8px_24px_rgba(21,128,61,0.12)]"
                    : "border-transparent bg-white/70 hover:border-accent/30 hover:bg-white"
                }`}
              >
                <Plane className="h-5 w-5 text-accent-deep" />
                <span className="mt-2 font-body text-xs font-bold text-primary">
                  All
                </span>
              </button>
              {countries.map((c) => {
                const active = selectedCountry === c.name;
                const count = c.colleges?.length ?? 0;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedCountry(c.name);
                      setCurrentPage(1);
                    }}
                    className={`relative h-[96px] w-[124px] shrink-0 overflow-hidden rounded-[14px] border-2 text-left transition-colors ${
                      active
                        ? "border-accent shadow-[0_8px_24px_rgba(21,128,61,0.14)]"
                        : "border-transparent hover:border-accent/35"
                    }`}
                  >
                    <Image
                      src={c.image || c.flag}
                      alt={`${c.name} medical universities`}
                      fill
                      sizes="124px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
                    <div className="absolute inset-x-0 bottom-0 p-2.5">
                      <p className="font-body text-xs font-bold text-white drop-shadow">
                        {c.name}
                      </p>
                      <p className="font-body text-[10px] text-white/80">
                        {count} universities
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="he-section">
        <div className="he-container">
          <div className="mb-5 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-1.5 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-accent-deep">
                Overseas campuses
              </p>
              <h2 className="font-display text-2xl font-extrabold text-primary sm:text-3xl">
                {selectedCountry
                  ? `Universities in ${selectedCountry}`
                  : "Browse overseas universities"}
              </h2>
            </div>
            <p className="font-body text-sm text-muted">
              {filteredColleges.length} universities
            </p>
          </div>

          <div className="mb-6 rounded-[16px] border border-border bg-white p-3 shadow-[0_8px_28px_rgba(15,23,42,0.06)] sm:p-4">
            <CollegeFilterBar
              className="mb-0"
              search={search}
              onSearchChange={(v) => {
                setSearch(v);
                setCurrentPage(1);
              }}
              searchPlaceholder="Search university or city..."
              resultCount={filteredColleges.length}
              onReset={() => {
                setSearch("");
                setSelectedCountry("");
                setCurrentPage(1);
              }}
              selects={[
                {
                  id: "abroad-country",
                  label: "Country",
                  value: selectedCountry,
                  onChange: (v) => {
                    setSelectedCountry(v);
                    setCurrentPage(1);
                  },
                  options: [
                    { value: "", label: "All countries" },
                    ...countries.map((c) => ({
                      value: c.name,
                      label: c.name,
                    })),
                  ],
                },
              ]}
            />
          </div>

          {filteredColleges.length === 0 ? (
            <div className="rounded-[16px] border border-dashed border-border bg-white py-16 text-center">
              <Globe2 className="mx-auto mb-3 h-10 w-10 text-border" />
              <p className="font-body text-base font-semibold text-muted">
                No campuses match — adjust the country or search terms.
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
                    type={college.type || "Abroad"}
                    ranking={college.ranking}
                    fees={college.fees}
                    href={`/colleges/${collegeSlug(college.name)}`}
                    tone="abroad"
                  />
                ))}
              </div>
              <Pagination
                className="mt-10"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 420, behavior: "smooth" });
                }}
                summary={`Page ${currentPage} of ${totalPages} · ${filteredColleges.length} universities`}
              />
            </>
          )}
        </div>
      </section>

      <section className="border-t border-border bg-white he-section">
        <div className="he-container">
          <h2 className="mb-6 text-center font-display text-2xl font-extrabold text-primary sm:text-3xl">
            Why aspirants choose overseas MBBS
          </h2>
          <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
            {[
              "Recognised pathways for practice & licensing",
              "Total cost often below private India MBBS",
              "English-medium teaching at many campuses",
              "Merit-led admissions — no donation seats",
            ].map((text) => (
              <div
                key={text}
                className="flex items-start gap-3 rounded-[12px] border border-border border-l-4 border-l-accent bg-surface/50 px-4 py-3.5"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-deep" />
                <span className="font-body text-sm font-semibold text-text">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PageCTA
        title="Unsure which country matches your profile?"
        description="Tell us your NEET score and budget — we’ll build an abroad shortlist that actually fits."
        primaryLabel="Request counselling"
        primaryHref="/contact"
        secondaryLabel="Call us"
        secondaryHref={`tel:${phoneTel}`}
      />
    </div>
  );
};

export default MbbsAbroadPage;
