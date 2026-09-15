"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FaGraduationCap,
  FaUniversity,
  FaGlobeAsia,
  FaMoneyBillWave,
  FaCheckCircle,
} from "react-icons/fa";
import { usePopup } from "@/contexts/PopupContext";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { CollegeMediaCard } from "@/components/ui/CollegeMediaCard";
import { Pagination } from "@/components/ui/Pagination";
import { CountryDetailSkeleton } from "@/components/ui/Skeleton";
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

interface CountryData {
  id: number;
  name: string;
  flag: string;
  image: string;
  description: string;
  universities: number;
  courses: string;
  colleges?: CollegeData[];
}

interface MbbsAbroadData {
  countries: CountryData[];
}

const CountrySlugPage: React.FC = () => {
  const params = useParams();
  const { openPopup, updateFormData } = usePopup();

  const [country, setCountry] = useState<CountryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const collegesPerPage = 6;

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setLoading(true);

        const response = await fetch("/mbbs-abroad.json");

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data: MbbsAbroadData = await response.json();

        const slug = params.slug as string;

        const foundCountry = data.countries.find((item) => {
          const generatedSlug = item.name
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, "")
            .replace(/\s+/g, "-");

          return generatedSlug === slug;
        });

        if (!foundCountry) {
          setError("Country not found");
        } else {
          setCountry(foundCountry);
        }
      } catch (err) {
        setError("Failed to load country");
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [params.slug]);

  if (loading) {
    return <CountryDetailSkeleton />;
  }

  if (error || !country) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-4">
        <div className="he-card p-10 text-center max-w-lg w-full hover:transform-none">
          <h1 className="font-display text-3xl font-extrabold text-primary mb-4">
            Country Not Found
          </h1>
          <p className="font-body text-muted mb-8">
            {error || "Requested country does not exist"}
          </p>
          <Link href="/colleges/mbbs-abroad">
            <Button size="md">Back to Countries</Button>
          </Link>
        </div>
      </div>
    );
  }

  const shuffledColleges = shuffle(country.colleges || [], dailySeed() + (country.id || 0));
  const totalPages = Math.ceil(shuffledColleges.length / collegesPerPage);
  const indexOfLastCollege = currentPage * collegesPerPage;
  const indexOfFirstCollege = indexOfLastCollege - collegesPerPage;
  const currentColleges = shuffledColleges.slice(indexOfFirstCollege, indexOfLastCollege);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-surface font-body">
      <PageHero
        eyebrow="MBBS abroad destination"
        title={
          <>
            Medicine in <span className="text-accent">{country.name}</span>
          </>
        }
        description={country.description}
        image={country.flag}
        imageAlt={`${country.name} flag`}
        imageSide="right"
        imageSize="sm"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MBBS Abroad", href: "/colleges/mbbs-abroad" },
          { label: country.name },
        ]}
      >
        <span className="inline-flex bg-white/10 border border-white/20 text-white px-4 py-1.5 rounded-[10px] text-sm font-semibold">
          Recognition-aware options
        </span>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {[
            {
              icon: FaUniversity,
              value: String(country.colleges?.length || 0),
              label: "Listed colleges",
            },
            {
              icon: FaGraduationCap,
              value: String(country.universities),
              label: "Campuses tracked",
            },
            {
              icon: FaGlobeAsia,
              value: "WHO · NMC",
              label: "Alignment focus",
            },
            {
              icon: FaMoneyBillWave,
              value: "Budget-led",
              label: "Fee planning",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-[12px] border border-white/15 bg-white/5 p-4"
            >
              <stat.icon className="text-accent text-lg mb-2" />
              <h3 className="font-display text-lg sm:text-xl font-extrabold text-white truncate">
                {stat.value}
              </h3>
              <p className="font-body text-xs text-white/65 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </PageHero>

      {/* Colleges */}
      <section className="he-section he-container">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="font-body text-accent-deep font-bold uppercase tracking-wider text-xs sm:text-sm mb-2">
              University shortlist
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary">
              Medical schools in {country.name}
            </h2>
          </div>

          <Button
            size="md"
            onClick={() => {
              updateFormData({
                courseInterest: `MBBS in ${country.name}`,
              });
              openPopup();
            }}
          >
            Plan this country
          </Button>
        </div>

        {country.colleges && country.colleges.length > 0 ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                paginate(page);
              }}
            />
          </>
        ) : (
          <div className="he-card p-12 text-center hover:transform-none">
            <h3 className="font-display text-3xl font-extrabold text-primary mb-4">
              Listing coming soon
            </h3>
            <p className="font-body text-muted mb-8 max-w-2xl mx-auto">
              We’re adding campuses for this destination. Browse other abroad pathways meanwhile.
            </p>
            <Link href="/colleges/mbbs-abroad">
              <Button size="md">See other destinations</Button>
            </Link>
          </div>
        )}
      </section>

      {/* Why study */}
      <section className="he-section bg-white border-t border-border">
        <div className="he-container">
          <div className="text-center mb-10">
            <p className="font-body text-accent-deep font-bold uppercase tracking-wider text-xs sm:text-sm mb-3">
              Why this destination
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary">
              What students weigh for {country.name}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="he-card p-8 hover:transform-none hover:shadow-[var(--shadow-soft)]">
              <h3 className="font-display text-2xl font-extrabold text-primary mb-4">
                Classroom & clinical exposure
              </h3>
              <p className="font-body text-muted leading-relaxed mb-6">
                Universities in {country.name} are often chosen for structured MBBS teaching,
                hospital postings, and English-medium pathways that Indian students can plan around.
              </p>
              <div className="space-y-3">
                {[
                  "Degree pathways with global visibility",
                  "Faculty-led clinical teaching",
                  "Campus labs and hospital tie-ups",
                  "English-medium cohorts common",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 text-text font-body"
                  >
                    <FaCheckCircle className="text-accent-deep mt-1 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[var(--radius-xl)] border border-primary bg-primary p-8 text-white shadow-[var(--shadow-soft)]">
              <h3 className="font-display text-2xl font-extrabold text-white mb-4">
                Cost vs private India
              </h3>
              <p className="font-body text-white/75 leading-relaxed mb-6">
                Many families shortlist {country.name} when private Indian fees stretch the
                budget — then we compare living costs, hostels, and total years carefully.
              </p>
              <div className="space-y-3">
                {[
                  "Transparent tuition bands",
                  "Living-cost planning support",
                  "Scholarship checks where available",
                  "FMGE / licensing roadmap discussed early",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 font-body text-white"
                  >
                    <FaCheckCircle className="text-accent mt-1 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <Button
                className="mt-8"
                size="lg"
                onClick={() => openPopup()}
              >
                Get a country plan
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CountrySlugPage;
