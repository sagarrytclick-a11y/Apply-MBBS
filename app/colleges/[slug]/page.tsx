"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { usePopup } from "@/contexts/PopupContext";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  MapPin,
  Users,
  BookOpen,
  FileText,
  CheckCircle2,
  TrendingUp,
  IndianRupee,
  Info,
  Calendar,
  Building2,
  ChevronRight,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CollegeDetailSkeleton } from "@/components/ui/Skeleton";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { dailySeed, shuffle } from "@/lib/shuffle";

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
  placements?: string;
  entranceExams?: string[];
  academicHighlights?: string[];
  detailedFees?: {
    tuitionFee: string;
    hostelFee: string;
    otherFees: string;
  };
  documentsRequired?: string[];
}

const CollegeSlugPage: React.FC = () => {
  const params = useParams();
  const [college, setCollege] = useState<CollegeData | null>(null);
  const [collegeType, setCollegeType] = useState<"india" | "abroad" | "mdms">(
    "india"
  );
  const [relatedColleges, setRelatedColleges] = useState<CollegeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "fees" | "admission" | "placement" | "documents"
  >("overview");
  const { openPopup, updateFormData } = usePopup();

  useEffect(() => {
    if (loading || !college) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(
              entry.target.id as
                | "overview"
                | "fees"
                | "admission"
                | "placement"
                | "documents"
            );
          }
        });
      },
      { rootMargin: "-140px 0px -55% 0px", threshold: 0 }
    );

    const timeoutId = setTimeout(() => {
      ["overview", "fees", "admission", "placement", "documents"].forEach(
        (id) => {
          const el = document.getElementById(id);
          if (el) observer.observe(el);
        }
      );
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [loading, college]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    const offset = 140;
    const top =
      element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchCollegeBySlug = async () => {
      try {
        setLoading(true);
        const slug = params.slug as string;

        const [indiaResponse, abroadResponse, mdMsResponse] = await Promise.all([
          fetch("/mbbs-india.json"),
          fetch("/mbbs-abroad.json"),
          fetch("/md-ms.json"),
        ]);

        if (!indiaResponse.ok && !abroadResponse.ok && !mdMsResponse.ok) {
          throw new Error("Failed to fetch college data");
        }

        const toSlug = (name: string) =>
          name
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");

        if (indiaResponse.ok) {
          const indiaData = await indiaResponse.json();
          for (const state of indiaData.states) {
            const found = state.colleges.find(
              (c: CollegeData) => toSlug(c.name) === slug
            );
            if (found) {
              setCollege(found);
              setCollegeType("india");
              setRelatedColleges(
                shuffle(
                  state.colleges.filter(
                    (c: CollegeData) => c.id !== found.id
                  ) as CollegeData[],
                  dailySeed() + Number(found.id)
                ).slice(0, 6)
              );
              setLoading(false);
              return;
            }
          }
        }

        if (abroadResponse.ok) {
          const abroadData = await abroadResponse.json();
          for (const country of abroadData.countries) {
            if (!country.colleges) continue;
            const found = country.colleges.find(
              (c: CollegeData) => toSlug(c.name) === slug
            );
            if (found) {
              setCollege(found);
              setCollegeType("abroad");
              setRelatedColleges(
                shuffle(
                  country.colleges.filter(
                    (c: CollegeData) => c.id !== found.id
                  ) as CollegeData[],
                  dailySeed() + Number(found.id)
                ).slice(0, 6)
              );
              setLoading(false);
              return;
            }
          }
        }

        if (mdMsResponse.ok) {
          const mdMsData = await mdMsResponse.json();
          for (const state of mdMsData.states || []) {
            const found = (state.colleges || []).find(
              (c: CollegeData) => toSlug(c.name) === slug
            );
            if (found) {
              setCollege(found);
              setCollegeType("mdms");
              setRelatedColleges(
                shuffle(
                  ((state.colleges || []).filter(
                    (c: CollegeData) => c.id !== found.id
                  ) as CollegeData[]),
                  dailySeed() + Number(found.id)
                ).slice(0, 6)
              );
              setLoading(false);
              return;
            }
          }
        }

        setError("College not found");
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load college details"
        );
        setLoading(false);
      }
    };

    fetchCollegeBySlug();
  }, [params.slug]);

  if (loading) {
    return <CollegeDetailSkeleton />;
  }

  if (error || !college) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="he-card p-10 text-center max-w-lg w-full hover:transform-none">
          <h1 className="font-display text-2xl font-extrabold text-primary mb-4">
            College Not Found
          </h1>
          <p className="font-body text-muted mb-8">
            {error || "The requested college could not be found."}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/colleges/mbbs-india">
              <Button size="md">Browse India Colleges</Button>
            </Link>
            <Link href="/colleges/mbbs-abroad">
              <Button variant="accent" size="md">
                Browse Abroad Colleges
              </Button>
            </Link>
            <Link href="/colleges/md-ms">
              <Button variant="secondary" size="md">
                Browse MD/MS
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getCollegeSlug = (collegeName: string) =>
    collegeName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  /** Compact fee line for narrow sidebar — prefer Total / 1st Yr when present */
  const shortenFeeLabel = (fees?: string) => {
    if (!fees?.trim()) return "";
    const raw = fees.trim();
    const totalMatch = raw.match(/Total:\s*([^|]+)/i);
    if (totalMatch) return `Total ${totalMatch[1].trim()}`;
    const firstYr = raw.match(/1st\s*Yr:\s*([^|]+)/i);
    if (firstYr) return `1st yr ${firstYr[1].trim()}`;
    if (raw.length <= 36) return raw;
    return `${raw.slice(0, 34).trim()}…`;
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "fees", label: "Fees", icon: IndianRupee },
    { id: "admission", label: "Admission", icon: GraduationCap },
    { id: "placement", label: "Career", icon: TrendingUp },
    { id: "documents", label: "Documents", icon: FileText },
  ] as const;

  const pathwayLabel =
    collegeType === "india"
      ? "MBBS India"
      : collegeType === "abroad"
        ? "MBBS Abroad"
        : "MD / MS";
  const pathwayHref =
    collegeType === "india"
      ? "/colleges/mbbs-india"
      : collegeType === "abroad"
        ? "/colleges/mbbs-abroad"
        : "/colleges/md-ms";

  const feeRows = [
    {
      label: "Tuition fee (annual)",
      value: college.detailedFees?.tuitionFee || college.fees,
      note: "As published for the current cycle",
    },
    {
      label: "Hostel & mess",
      value: college.detailedFees?.hostelFee || "As per campus allotment",
      note: "May vary by room type",
    },
    {
      label: "University / misc. charges",
      value: college.detailedFees?.otherFees || "As per university norms",
      note: "Exam, lab, library, etc.",
    },
  ];

  const overviewCopy =
    collegeType === "india"
      ? `${college.name} is a ${String(college.type || "medical").toLowerCase()} medical college in ${college.city}. Recognition: ${college.recognition}. Ranking reference: ${college.ranking}. The MBBS intake listed here is ${college.seats} seats — use this page for fees, admission steps, and documents before counselling.`
      : collegeType === "abroad"
        ? `${college.name} is a medical university option for students exploring MBBS abroad, based in ${college.city}. Recognition listed: ${college.recognition}. Ranking reference: ${college.ranking}. Seat intake shown: ${college.seats}. Confirm current fees, eligibility, and visa steps with a counsellor before you apply.`
        : `${college.name} offers postgraduate medical (MD/MS) programmes in ${college.city}. Recognition: ${college.recognition}. Ranking reference: ${college.ranking}. Listed PG intake: ${college.seats} seats — use this page for fees, NEET PG admission steps, and documents before counselling.`;

  const admissionSteps =
    collegeType === "india"
      ? [
          {
            step: "Qualify NEET UG",
            desc: "Meet the eligibility percentile for your category.",
          },
          {
            step: "Register for counselling",
            desc: "MCC for All India Quota and/or your state counselling portal.",
          },
          {
            step: "Choice filling & locking",
            desc: "Prioritise colleges carefully before each round closes.",
          },
          {
            step: "Seat allotment",
            desc: "Check result and download the allotment letter.",
          },
          {
            step: "Report & pay fees",
            desc: "Complete document verification and fee payment at the college.",
          },
        ]
      : collegeType === "mdms"
        ? [
            {
              step: "Qualify NEET PG",
              desc: "Meet the eligibility percentile for your category and branch.",
            },
            {
              step: "Register for counselling",
              desc: "MCC and/or state NEET PG counselling portals.",
            },
            {
              step: "Choice filling & locking",
              desc: "Prioritise colleges and specialisations carefully each round.",
            },
            {
              step: "Seat allotment",
              desc: "Check result and download the allotment letter.",
            },
            {
              step: "Report & pay fees",
              desc: "Complete document verification and fee payment at the college.",
            },
          ]
        : [
            {
              step: "Shortlist universities",
              desc: "Compare fees, recognition, language of instruction, and city.",
            },
            {
              step: "Check eligibility",
              desc: "NEET status, academics, and passport readiness.",
            },
            {
              step: "Apply & get offer",
              desc: "Submit documents and receive the admission / invitation letter.",
            },
            {
              step: "Pay tuition (as guided)",
              desc: "Follow university fee schedule — avoid unofficial channels.",
            },
            {
              step: "Visa & travel",
              desc: "Complete embassy process, then fly with reporting documents.",
            },
          ];

  const docs =
    college.documentsRequired || [
      "NEET UG admit card",
      "NEET UG scorecard / rank letter",
      "Class 10 certificate & marksheet",
      "Class 12 certificate & marksheet",
      "Photo ID (Aadhaar / PAN / passport)",
      "Passport-size photographs",
      "Provisional allotment letter",
      "Category certificate (if applicable)",
      "Migration certificate",
      "Transfer certificate",
    ];

  const highlights =
    college.academicHighlights || [
      "Clinical teaching hospital exposure",
      "Standard curriculum as per NMC norms",
      "Faculty-led practical training",
      "Library and lab facilities",
    ];

  const phonePrimary = SITE_IDENTITY.contact.phone.split(",")[0].trim();
  const phoneTel = phonePrimary.replace(/[^0-9+]/g, "");

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Simple college hero — clear text + photo */}
      <section className="border-b border-border bg-white">
        <div className="he-container py-8 sm:py-10 lg:py-12">
          <nav
            aria-label="Breadcrumb"
            className="mb-5 flex flex-wrap items-center gap-1.5 font-body text-xs text-muted"
          >
            <Link href="/" className="hover:text-accent-deep">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={pathwayHref} className="hover:text-accent-deep">
              {pathwayLabel}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="max-w-[200px] truncate text-primary sm:max-w-md">
              {college.name}
            </span>
          </nav>

          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">
              <p className="font-body text-[11px] font-bold uppercase tracking-[0.14em] text-accent-deep">
                {pathwayLabel}
              </p>
              <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-primary sm:text-3xl lg:text-4xl lg:leading-[1.15]">
                {college.name}
              </h1>
              <p className="mt-3 font-body text-sm text-muted sm:text-[15px]">
                {college.city} · {college.type || "Medical college"} ·{" "}
                {college.recognition}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-[10px] border border-border bg-background px-3 py-1.5 font-body text-xs font-semibold text-primary">
                  {college.seats} seats
                </span>
                <span className="rounded-[10px] border border-border bg-background px-3 py-1.5 font-body text-xs font-semibold text-primary">
                  Fees: {college.fees}
                </span>
                <span className="rounded-[10px] bg-accent px-3 py-1.5 font-body text-xs font-bold text-white">
                  {college.ranking}
                </span>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={() => {
                    updateFormData({
                      courseInterest: `${college.name} - ${pathwayLabel}`,
                    });
                    openPopup();
                  }}
                >
                  Get free counselling
                </Button>
                <a href={`tel:${phoneTel}`}>
                  <Button variant="secondary" size="lg">
                    <Phone className="h-4 w-4" />
                    Call now
                  </Button>
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] border border-border bg-background shadow-[var(--shadow-soft)]">
                <Image
                  src={college.image || "/medical.webp"}
                  alt={college.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Quick facts — plain row, no floating overlay */}
          <div className="mt-8 grid grid-cols-2 gap-3 border-t border-border pt-6 sm:grid-cols-4 sm:gap-4">
            {[
              { label: "Annual fees", value: college.fees, icon: IndianRupee },
              { label: "Seats", value: String(college.seats), icon: Users },
              { label: "Type", value: college.type || "—", icon: Building2 },
              { label: "City", value: college.city, icon: MapPin },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-accent/10 text-accent-deep">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-body text-[10px] font-bold uppercase tracking-wider text-muted">
                      {item.label}
                    </p>
                    <p className="mt-0.5 truncate font-display text-sm font-extrabold text-primary">
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-[72px] z-40 border-b border-border bg-white/95 backdrop-blur-md">
        <div className="he-container">
          <nav
            aria-label="College sections"
            className="flex gap-1 overflow-x-auto no-scrollbar py-2"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => scrollToSection(tab.id)}
                  className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-3.5 py-2.5 font-body text-sm font-semibold transition-colors ${
                    active
                      ? "border-accent text-accent-deep"
                      : "border-transparent text-muted hover:text-primary"
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="he-section he-container !pt-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-12">
            {/* Overview — editorial, no heavy card shell */}
            <section id="overview" className="scroll-mt-36">
              <p className="font-body text-[11px] font-bold uppercase tracking-[0.16em] text-accent-deep">
                Overview
              </p>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-primary sm:text-3xl">
                Campus snapshot
              </h2>
              <p className="mt-4 max-w-3xl font-body text-[15px] leading-relaxed text-muted">
                {overviewCopy}
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-display text-base font-bold text-primary">
                    What stands out
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 border-l-[3px] border-accent/40 pl-3 font-body text-sm text-text"
                      >
                        <CheckCircle2
                          size={16}
                          className="mt-0.5 shrink-0 text-accent"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[18px] bg-accent p-5 text-white sm:p-6">
                  <h3 className="font-display text-base font-bold">Quick facts</h3>
                  <dl className="mt-4 space-y-3 font-body text-sm">
                    {[
                      ["Seats", String(college.seats)],
                      ["Type", college.type || "—"],
                      ["City", college.city],
                      ["Recognition", college.recognition],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="flex items-center justify-between gap-3 border-b border-white/15 pb-2 last:border-0 last:pb-0"
                      >
                        <dt className="text-white/75">{k}</dt>
                        <dd className="text-right font-semibold">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </section>

            {/* Fees — tile cards instead of dark table */}
            <section id="fees" className="scroll-mt-36">
              <p className="font-body text-[11px] font-bold uppercase tracking-[0.16em] text-accent-deep">
                Fees
              </p>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-primary sm:text-3xl">
                Indicative fee bands
              </h2>
              <p className="mt-2 max-w-2xl font-body text-sm text-muted leading-relaxed">
                Ballpark yearly costs. Final payable amount moves with counselling
                round, quota, and hostel allotment — always verify on campus.
                allotment, category, hostel choice, and university circulars.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {feeRows.map((row) => (
                  <div
                    key={row.label}
                    className="rounded-[16px] border border-border bg-white p-5 shadow-[var(--shadow-soft)]"
                  >
                    <p className="font-body text-[11px] font-bold uppercase tracking-wide text-muted">
                      {row.label}
                    </p>
                    <p className="mt-2 font-display text-lg font-extrabold text-primary">
                      {row.value}
                    </p>
                    <p className="mt-1.5 font-body text-xs text-muted">{row.note}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-accent/20 bg-[#f0fdf4] px-5 py-4">
                <div>
                  <p className="font-body text-[11px] font-bold uppercase tracking-wide text-accent-deep">
                    Indicative annual total
                  </p>
                  <p className="mt-1 font-display text-xl font-extrabold text-primary">
                    {college.fees}
                  </p>
                </div>
                <p className="max-w-xs font-body text-xs text-muted">
                  Refundable deposits and one-time charges may be extra at
                  reporting.
                </p>
              </div>
            </section>

            {/* Admission — horizontal timeline feel */}
            <section id="admission" className="scroll-mt-36">
              <p className="font-body text-[11px] font-bold uppercase tracking-[0.16em] text-accent-deep">
                Admission
              </p>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-primary sm:text-3xl">
                How admission works
              </h2>
              <p className="mt-4 max-w-3xl font-body text-[15px] leading-relaxed text-muted">
                {college.admissionProcess ||
                  (collegeType === "india"
                    ? "MBBS seats are filled through NEET UG followed by MCC (AIQ) and/or state counselling. Seat allotment depends on rank, category, and choices filled."
                    : collegeType === "abroad"
                      ? "Admission typically requires NEET qualification (as applicable), university offer, document verification, fee payment, and visa processing for the destination country."
                      : "MD/MS seats are typically filled through NEET PG followed by MCC and/or state counselling. Allotment depends on rank, category, and preferred specialisation.")}
              </p>

              <ol className="mt-8 space-y-0">
                {admissionSteps.map((item, idx) => (
                  <li key={item.step} className="relative flex gap-4 pb-8 last:pb-0">
                    {idx < admissionSteps.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-px bg-border"
                      />
                    )}
                    <span className="relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent font-display text-xs font-bold text-white">
                      {idx + 1}
                    </span>
                    <div className="pt-0.5">
                      <p className="font-display text-sm font-bold text-primary">
                        {item.step}
                      </p>
                      <p className="mt-1 font-body text-sm text-muted">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-2 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[16px] border border-border bg-white p-5">
                  <h3 className="flex items-center gap-2 font-display text-sm font-bold text-primary">
                    <Calendar size={16} className="text-accent" />
                    Entrance
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(
                      college.entranceExams ||
                      (collegeType === "mdms" ? ["NEET PG"] : ["NEET UG"])
                    ).map((exam) => (
                      <span
                        key={exam}
                        className="rounded-[8px] bg-accent/10 px-2.5 py-1 font-body text-xs font-semibold text-accent-deep"
                      >
                        {exam}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-[16px] border border-border bg-white p-5">
                  <h3 className="flex items-center gap-2 font-display text-sm font-bold text-primary">
                    <Users size={16} className="text-accent" />
                    Eligibility (indicative)
                  </h3>
                  <p className="mt-3 font-body text-sm text-muted leading-relaxed">
                    Age 17+, Class 12 PCB with category-wise minimum marks, and
                    a valid NEET score where required for the pathway.
                  </p>
                </div>
              </div>
            </section>

            {/* Career */}
            <section id="placement" className="scroll-mt-36">
              <p className="font-body text-[11px] font-bold uppercase tracking-[0.16em] text-accent-deep">
                Career
              </p>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-primary sm:text-3xl">
                After the course
              </h2>
              <p className="mt-4 max-w-3xl font-body text-[15px] leading-relaxed text-muted">
                {college.placements ||
                  "Graduates typically complete internship, then prepare for NEET PG / INI-CET or licensing pathways. Outcomes vary by student performance, specialisation choice, and counselling year."}
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[16px] border-l-4 border-l-accent border border-border bg-white p-5">
                  <h3 className="font-display text-sm font-bold text-primary">
                    Internship
                  </h3>
                  <p className="mt-2 font-body text-sm text-muted leading-relaxed">
                    Compulsory rotatory internship in the affiliated teaching
                    hospital covers core clinical departments and bedside
                    training.
                  </p>
                </div>
                <div className="rounded-[16px] border-l-4 border-l-accent-bright border border-border bg-white p-5">
                  <h3 className="font-display text-sm font-bold text-primary">
                    PG & practice
                  </h3>
                  <p className="mt-2 font-body text-sm text-muted leading-relaxed">
                    Many students aim for MD/MS via NEET PG. Abroad graduates
                    should plan licensing (e.g. FMGE/NExT) early if returning to
                    India.
                  </p>
                </div>
              </div>
            </section>

            {/* Documents */}
            <section id="documents" className="scroll-mt-36">
              <p className="font-body text-[11px] font-bold uppercase tracking-[0.16em] text-accent-deep">
                Documents
              </p>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-primary sm:text-3xl">
                Documents checklist
              </h2>
              <p className="mt-2 font-body text-sm text-muted">
                Carry originals plus photocopies when reporting. Exact list can
                vary by college / counselling authority.
              </p>

              <ul className="mt-6 columns-1 gap-x-8 sm:columns-2">
                {docs.map((doc) => (
                  <li
                    key={doc}
                    className="mb-2.5 flex break-inside-avoid items-center gap-2.5 font-body text-sm text-text"
                  >
                    <CheckCircle2 size={15} className="shrink-0 text-accent" />
                    {doc}
                  </li>
                ))}
              </ul>

              <p className="mt-6 rounded-[14px] border border-error/20 bg-error/5 px-4 py-3 font-body text-sm text-error">
                Missing originals at reporting can lead to seat cancellation —
                verify the official list before you travel.
              </p>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-5">
            <div className="sticky top-[132px] space-y-5">
              <div className="overflow-hidden rounded-[20px] border border-border bg-white shadow-[var(--shadow-soft)]">
                <div className="border-b border-border bg-[#f0fdf4] p-5">
                  <p className="font-body text-[11px] font-bold uppercase tracking-[0.14em] text-accent-deep">
                    Counselling
                  </p>
                  <h3 className="mt-1 font-display text-lg font-extrabold text-primary">
                    Need a second opinion on this campus?
                  </h3>
                  <p className="mt-2 font-body text-sm text-muted leading-relaxed">
                    Fees, cut-offs, and reporting timelines for {college.name} —
                    guided by {SITE_IDENTITY.name}.
                  </p>
                  <Button
                    className="mt-4 w-full"
                    size="lg"
                    onClick={() => {
                      updateFormData({
                        courseInterest: `${college.name} - ${pathwayLabel}`,
                      });
                      openPopup();
                    }}
                  >
                    Ask a counsellor
                  </Button>
                </div>
                <div className="p-5">
                  <dl className="space-y-3 font-body text-sm">
                    {[
                      ["Fees", college.fees],
                      ["Seats", String(college.seats)],
                      ["Type", college.type || "—"],
                      ["City", college.city],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between gap-3">
                        <dt className="text-muted">{k}</dt>
                        <dd className="text-right font-semibold text-primary">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-5 border-t border-border pt-4">
                    <p className="mb-2 font-body text-[10px] font-bold uppercase tracking-wider text-muted">
                      Explore
                    </p>
                    <div className="space-y-1">
                      <Link
                        href="/colleges/mbbs-india"
                        className="flex items-center gap-2 rounded-[10px] px-2 py-2 font-body text-sm text-muted transition-colors hover:bg-background hover:text-primary"
                      >
                        <BookOpen size={15} className="text-accent" />
                        MBBS India colleges
                      </Link>
                      <Link
                        href="/colleges/mbbs-abroad"
                        className="flex items-center gap-2 rounded-[10px] px-2 py-2 font-body text-sm text-muted transition-colors hover:bg-background hover:text-primary"
                      >
                        <MapPin size={15} className="text-accent" />
                        MBBS abroad
                      </Link>
                      <Link
                        href="/colleges/md-ms"
                        className="flex items-center gap-2 rounded-[10px] px-2 py-2 font-body text-sm text-muted transition-colors hover:bg-background hover:text-primary"
                      >
                        <GraduationCap size={15} className="text-accent" />
                        MD / MS colleges
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {relatedColleges.length > 0 && (
                <div className="rounded-[20px] border border-border bg-white p-5 shadow-[var(--shadow-soft)]">
                  <h3 className="mb-4 flex items-center gap-2 font-display text-base font-extrabold text-primary">
                    <Building2 size={18} className="text-accent" />
                    Similar colleges
                  </h3>
                  <div className="space-y-3">
                    {relatedColleges.map((related) => {
                      const feeShort = shortenFeeLabel(related.fees);
                      return (
                        <Link
                          key={related.id}
                          href={`/colleges/${getCollegeSlug(related.name)}`}
                          className="block rounded-[12px] border border-border/70 bg-surface/40 px-3 py-3 transition-colors hover:border-accent/35 hover:bg-white"
                        >
                          <p className="font-display text-sm font-bold leading-snug text-primary line-clamp-2">
                            {related.name}
                          </p>
                          <p className="mt-1.5 inline-flex items-center gap-1 font-body text-xs text-muted">
                            <MapPin size={11} className="shrink-0 text-accent-deep" />
                            <span className="truncate">{related.city}</span>
                          </p>
                          {feeShort ? (
                            <p
                              className="mt-2 rounded-[8px] bg-accent/10 px-2.5 py-1.5 font-body text-[11px] font-bold leading-snug text-accent-deep"
                              title={related.fees}
                            >
                              {feeShort}
                            </p>
                          ) : null}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CollegeSlugPage;
