"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Trophy,
  Building2,
  GraduationCap,
  Target,
  Info,
} from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PageCTA } from "@/components/ui/PageCTA";
import { Button } from "@/components/ui/Button";

interface RankEntry {
  minScore: number;
  maxScore: number;
  minRank: number;
  maxRank: number;
  label: string;
}

type CategoryId = "general" | "ews" | "obc" | "sc" | "st" | "pwbd";

interface CategoryOption {
  id: CategoryId;
  label: string;
  short: string;
  /**
   * Approx. share of candidates in this category.
   * Category rank ≈ AIR × poolShare (lower pool → better category rank).
   */
  poolShare: number;
  /**
   * How much farther AIR can still compete for reserved seats vs UR closing ranks.
   * Higher = reserved seats stay open at worse AIRs.
   */
  seatRelief: number;
  hint: string;
}

const categories: CategoryOption[] = [
  {
    id: "general",
    label: "General (UR)",
    short: "UR",
    poolShare: 1,
    seatRelief: 1,
    hint: "Unreserved All India and state quota cutoffs — typically the strictest closing ranks.",
  },
  {
    id: "ews",
    label: "EWS",
    short: "EWS",
    poolShare: 0.12,
    seatRelief: 1.15,
    hint: "Economically Weaker Section (10% reservation) — closing ranks usually softer than UR.",
  },
  {
    id: "obc",
    label: "OBC-NCL",
    short: "OBC",
    poolShare: 0.27,
    seatRelief: 1.35,
    hint: "Other Backward Classes (Non-Creamy Layer) — broader seat access than unreserved.",
  },
  {
    id: "sc",
    label: "SC",
    short: "SC",
    poolShare: 0.15,
    seatRelief: 2.1,
    hint: "Scheduled Caste — category ranks and closing AIRs sit well below UR levels.",
  },
  {
    id: "st",
    label: "ST",
    short: "ST",
    poolShare: 0.075,
    seatRelief: 2.4,
    hint: "Scheduled Tribe — often the lowest closing ranks among vertical categories.",
  },
  {
    id: "pwbd",
    label: "PwBD",
    short: "PwBD",
    poolShare: 0.04,
    seatRelief: 2.8,
    hint: "Persons with Benchmark Disability — horizontal reservation across quota streams.",
  },
];

const rankData: RankEntry[] = [
  { minScore: 720, maxScore: 720, minRank: 1, maxRank: 1, label: "AIR 1 — National topper band" },
  { minScore: 700, maxScore: 719, minRank: 2, maxRank: 800, label: "Within 800 — Elite government seats" },
  { minScore: 680, maxScore: 699, minRank: 801, maxRank: 5000, label: "Within 5K — AIIMS / leading government" },
  { minScore: 650, maxScore: 679, minRank: 5001, maxRank: 20000, label: "Within 20K — Strong government colleges" },
  { minScore: 630, maxScore: 649, minRank: 20001, maxRank: 45000, label: "Within 45K — Solid government options" },
  { minScore: 600, maxScore: 629, minRank: 45001, maxRank: 80000, label: "Within 80K — Mid government / leading private" },
  { minScore: 550, maxScore: 599, minRank: 80001, maxRank: 180000, label: "Within 1.8L — Private / deemed focus" },
  { minScore: 500, maxScore: 549, minRank: 180001, maxRank: 350000, label: "Within 3.5L — Private college range" },
  { minScore: 450, maxScore: 499, minRank: 350001, maxRank: 580000, label: "Within 5.8L — Private / state private" },
  { minScore: 400, maxScore: 449, minRank: 580001, maxRank: 900000, label: "Within 9L — Higher-fee private seats" },
  { minScore: 300, maxScore: 399, minRank: 900001, maxRank: 1600000, label: "Within 16L — Narrow Indian options" },
  { minScore: 0, maxScore: 299, minRank: 1600001, maxRank: 2400000, label: "Unlikely path for Indian MBBS seats" },
];

const collegeCategories = [
  {
    title: "Premier government colleges",
    rankRange: "AIR 1 – 20,000",
    icon: Trophy,
    colleges: [
      "AIIMS Delhi",
      "Maulana Azad Medical College",
      "SMS Medical College Jaipur",
      "Gandhi Medical College Bhopal",
      "King George's Medical University",
    ],
  },
  {
    title: "Mid government / leading private",
    rankRange: "AIR 20,000 – 1,80,000",
    icon: Building2,
    colleges: [
      "Hamdard Institute of Medical Sciences",
      "JSS Medical College Mysore",
      "Christian Medical College Vellore (non-NEET)",
      "Kasturba Medical College Manipal",
    ],
  },
  {
    title: "Private and deemed colleges",
    rankRange: "AIR 1,80,000+",
    icon: GraduationCap,
    colleges: [
      "DY Patil Medical College",
      "SRM Medical College",
      "Sharda University",
      "Teerthanker Mahaveer Medical College",
    ],
  },
];

interface PredictionResult {
  entry: RankEntry;
  airMin: number;
  airMax: number;
  categoryMin: number;
  categoryMax: number;
  effectiveAir: number;
  outlook: { title: string; detail: string };
}

function clampRank(n: number) {
  return Math.max(1, Math.round(n));
}

function buildPrediction(score: number, cat: CategoryOption): PredictionResult | null {
  const entry = rankData.find((r) => score >= r.minScore && score <= r.maxScore);
  if (!entry) return null;

  const airMin = entry.minRank;
  const airMax = entry.maxRank;
  const airMid = (airMin + airMax) / 2;

  // Category rank ≈ position among same-category candidates
  const categoryMin = clampRank(airMin * cat.poolShare);
  const categoryMax = Math.max(categoryMin, clampRank(airMax * cat.poolShare));

  // Seat competitiveness vs UR closing ranks (lower = better chance)
  const effectiveAir = clampRank(airMid / cat.seatRelief);

  let outlook: { title: string; detail: string };
  if (effectiveAir <= 20000) {
    outlook = {
      title: "Favourable government seat window",
      detail: `Under ${cat.short}, this score often contests strong government / AIIMS-track seats (state and AIQ cutoffs still decide). Est. ${cat.short} rank ~${formatRankPlain(categoryMin)}–${formatRankPlain(categoryMax)}.`,
    };
  } else if (effectiveAir <= 80000) {
    outlook = {
      title: "Competitive mid government / leading private",
      detail: `With ${cat.label}, plan for state-quota competition and stronger private choices than the same AIR under General (UR).`,
    };
  } else if (effectiveAir <= 350000) {
    outlook = {
      title: "Private / deemed as the primary plan",
      detail: `${cat.short} reservation may still unlock select government seats in some states — treat private / deemed as the dependable path.`,
    };
  } else if (effectiveAir <= 900000) {
    outlook = {
      title: "Thin government odds; price private carefully",
      detail: `Prioritise affordable private seats or abroad backups. Even with ${cat.short}, Indian MBBS inventory is scarce at this score.`,
    };
  } else {
    outlook = {
      title: "Seat outlook remains constrained",
      detail: `Weigh a reattempt, state-specific rules, or MBBS abroad counselling. ${cat.label} still needs a higher score for most Indian MBBS seats.`,
    };
  }

  return {
    entry,
    airMin,
    airMax,
    categoryMin,
    categoryMax,
    effectiveAir,
    outlook,
  };
}

function formatRankPlain(rank: number) {
  if (rank >= 100000) return `${(rank / 100000).toFixed(1)}L`;
  if (rank >= 1000) return `${(rank / 1000).toFixed(1)}K`;
  return String(rank);
}

function formatRank(rank: number) {
  if (rank >= 10000000) return `${(rank / 10000000).toFixed(1)} Cr`;
  if (rank >= 100000) return `${(rank / 100000).toFixed(1)} L`;
  if (rank >= 1000) return `${(rank / 1000).toFixed(1)}K`;
  return rank.toString();
}

const NeetRankPredictorPage: React.FC = () => {
  const [score, setScore] = useState("");
  const [categoryId, setCategoryId] = useState<CategoryId>("general");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const category = categories.find((c) => c.id === categoryId) || categories[0];

  const prediction = useMemo(() => {
    if (!submitted) return null;
    const numScore = parseInt(score, 10);
    if (isNaN(numScore) || numScore < 0 || numScore > 720) return null;
    return buildPrediction(numScore, category);
  }, [submitted, score, category]);

  const handlePredict = () => {
    const numScore = parseInt(score, 10);
    if (isNaN(numScore) || numScore < 0 || numScore > 720) {
      setError("Score must be a number from 0 to 720.");
      setSubmitted(false);
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <div className="bg-background min-h-screen">
      <PageHero
        surface="surface"
        align="left"
        eyebrow="NEET 2026 · Free estimator"
        title={
          <>
            Marks to rank —{" "}
            <span className="text-secondary">quick estimate</span>
          </>
        }
        description="Add your NEET UG score and category to see an approximate All India Rank, category rank, and seat outlook. Indicative only — cutoffs shift every year."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "NEET Rank Predictor" },
        ]}
      />

      <section className="he-section pt-8 sm:pt-10">
        <div className="he-container">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-8 lg:items-start">
            {/* Input panel */}
            <div className="lg:col-span-5">
              <div className="rounded-[20px] border border-border bg-white p-5 sm:p-6 lg:sticky lg:top-24">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-accent/12 text-accent-deep">
                    <Target className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-display text-lg font-extrabold text-primary sm:text-xl">
                      Enter marks
                    </h2>
                    <p className="font-body text-xs text-muted">
                      Change category to refresh the outlook
                    </p>
                  </div>
                </div>

                <label className="mb-1.5 block font-body text-sm font-semibold text-text">
                  NEET marks (maximum 720)
                </label>
                <input
                  type="number"
                  min="0"
                  max="720"
                  value={score}
                  onChange={(e) => {
                    setScore(e.target.value);
                    setSubmitted(false);
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handlePredict()}
                  placeholder="e.g. 650"
                  className="h-14 w-full rounded-[14px] border border-border bg-surface px-4 text-center font-display text-2xl font-extrabold text-primary outline-none transition-colors placeholder:font-body placeholder:text-base placeholder:font-medium placeholder:text-muted/50 focus:border-accent focus:bg-white"
                />

                <p className="mb-2 mt-5 font-body text-sm font-semibold text-text">
                  Reservation category
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((c) => {
                    const active = categoryId === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategoryId(c.id)}
                        className={`rounded-full border px-3 py-1.5 font-body text-xs font-bold transition-colors ${
                          active
                            ? "border-accent bg-accent text-white"
                            : "border-border bg-surface text-text hover:border-accent/40 hover:bg-white"
                        }`}
                      >
                        {c.short}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2.5 font-body text-xs leading-relaxed text-muted">
                  <span className="font-semibold text-text">{category.label}.</span>{" "}
                  {category.hint}
                </p>

                <Button
                  onClick={handlePredict}
                  size="lg"
                  className="mt-5 w-full group"
                >
                  Estimate my rank
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>

                {error && (
                  <p className="mt-3 font-body text-sm text-error">{error}</p>
                )}
              </div>
            </div>

            {/* Results panel */}
            <div className="lg:col-span-7">
              {!prediction ? (
                <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-[20px] border border-dashed border-border bg-white/70 px-6 py-12 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent-deep">
                    <Target className="h-5 w-5" />
                  </span>
                  <p className="mt-4 font-display text-lg font-extrabold text-primary">
                    Results show up here
                  </p>
                  <p className="mt-1.5 max-w-sm font-body text-sm text-muted">
                    Type a score from 0–720 and run Estimate. Use category chips to compare reservation impact.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[16px] border border-border bg-white p-5">
                      <p className="font-body text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                        Approx. AIR
                      </p>
                      <p className="mt-2 font-display text-3xl font-extrabold leading-none text-primary sm:text-4xl">
                        {formatRank(prediction.airMin)}
                        <span className="mx-1.5 text-lg text-muted">–</span>
                        {formatRank(prediction.airMax)}
                      </p>
                      <p className="mt-2 font-body text-xs text-muted">
                        Based on marks · identical across categories
                      </p>
                    </div>
                    <div className="rounded-[16px] border border-accent/35 bg-accent/8 p-5">
                      <p className="font-body text-[11px] font-bold uppercase tracking-[0.14em] text-accent-deep">
                        Approx. {category.short} rank
                      </p>
                      <p className="mt-2 font-display text-3xl font-extrabold leading-none text-accent-deep sm:text-4xl">
                        {formatRank(prediction.categoryMin)}
                        <span className="mx-1.5 text-lg text-muted">–</span>
                        {formatRank(prediction.categoryMax)}
                      </p>
                      <p className="mt-2 font-body text-xs text-muted">
                        Recalculates for {category.label}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 rounded-[16px] border border-border bg-white px-5 py-4">
                    <div>
                      <p className="font-body text-[11px] font-semibold uppercase tracking-wide text-muted">
                        Marks
                      </p>
                      <p className="font-display text-xl font-extrabold text-primary">
                        {score}
                        <span className="text-sm font-bold text-muted">/720</span>
                      </p>
                    </div>
                    <div className="h-8 w-px bg-border" />
                    <div>
                      <p className="font-body text-[11px] font-semibold uppercase tracking-wide text-muted">
                        Category
                      </p>
                      <p className="font-display text-lg font-extrabold text-primary">
                        {category.label}
                      </p>
                    </div>
                    <div className="h-8 w-px bg-border hidden sm:block" />
                    <div className="min-w-0 flex-1">
                      <p className="font-body text-[11px] font-semibold uppercase tracking-wide text-muted">
                        Score band
                      </p>
                      <p className="truncate font-body text-sm font-semibold text-text">
                        {prediction.entry.label}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[16px] border-l-4 border-l-accent border border-border bg-white p-5">
                    <p className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-accent-deep">
                      Counselling outlook
                    </p>
                    <p className="mt-1.5 font-display text-lg font-extrabold text-primary">
                      {prediction.outlook.title}
                    </p>
                    <p className="mt-1.5 font-body text-sm leading-relaxed text-muted">
                      {prediction.outlook.detail}
                    </p>
                  </div>

                  <div className="flex items-start gap-2 px-1">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-deep" />
                    <p className="font-body text-xs leading-relaxed text-muted">
                      Indicative figures only. Final ranks depend on paper difficulty, candidate volume, and counselling rounds.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="he-section border-y border-border bg-white">
        <div className="he-container">
          <SectionHeader
            eyebrow="Reference table"
            title={
              <>
                Marks vs rank{" "}
                <span className="text-secondary">bands</span>
              </>
            }
            description="Drawn from recent NEET UG patterns. The category-rank column follows the chip selected above."
            className="mb-7"
          />

          <div className="overflow-hidden rounded-[16px] border border-border">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm font-body">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="px-4 py-3 text-left font-body text-[11px] font-bold uppercase tracking-[0.12em] text-muted sm:px-5">
                      Marks
                    </th>
                    <th className="px-4 py-3 text-left font-body text-[11px] font-bold uppercase tracking-[0.12em] text-muted sm:px-5">
                      Approx. AIR
                    </th>
                    <th className="px-4 py-3 text-left font-body text-[11px] font-bold uppercase tracking-[0.12em] text-muted sm:px-5">
                      Approx. {category.short}
                    </th>
                    <th className="px-4 py-3 text-left font-body text-[11px] font-bold uppercase tracking-[0.12em] text-muted sm:px-5">
                      What it suggests
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rankData.map((row, i) => {
                    const numScore = parseInt(score, 10);
                    const isActive =
                      submitted &&
                      !isNaN(numScore) &&
                      numScore >= row.minScore &&
                      numScore <= row.maxScore;
                    const catMin = clampRank(row.minRank * category.poolShare);
                    const catMax = Math.max(
                      catMin,
                      clampRank(row.maxRank * category.poolShare)
                    );
                    return (
                      <tr
                        key={`${row.minScore}-${row.maxScore}`}
                        className={`border-b border-border last:border-0 transition-colors ${
                          isActive
                            ? "bg-accent/12"
                            : i % 2 === 0
                              ? "bg-white"
                              : "bg-surface/40"
                        }`}
                      >
                        <td className="whitespace-nowrap px-4 py-3 font-bold text-primary sm:px-5">
                          {row.minScore === row.maxScore
                            ? row.minScore
                            : `${row.minScore} – ${row.maxScore}`}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-semibold text-primary sm:px-5">
                          {formatRank(row.minRank)} – {formatRank(row.maxRank)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-semibold text-accent-deep sm:px-5">
                          {formatRank(catMin)} – {formatRank(catMax)}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted sm:px-5 sm:text-sm">
                          {row.label}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="he-section">
        <div className="he-container">
          <SectionHeader
            eyebrow="College bands"
            title={
              <>
                Ranks and the colleges{" "}
                <span className="text-secondary">they often map to</span>
              </>
            }
            description="Illustrative institutes discussed in each AIR band. Reserved categories may reach stronger seats at the same AIR — verify during counselling."
            className="mb-7"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collegeCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.title}
                  className="h-full rounded-[16px] border border-border border-l-4 border-l-accent bg-white p-5 sm:p-6"
                >
                  <Icon className="h-5 w-5 text-accent-deep" />
                  <h3 className="mt-3 font-display text-lg font-extrabold text-primary">
                    {cat.title}
                  </h3>
                  <p className="mt-1 font-body text-xs font-bold text-accent-deep">
                    {cat.rankRange}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {cat.colleges.map((c) => (
                      <li key={c} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-deep" />
                        <span className="font-body text-sm leading-snug text-muted">
                          {c}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <PageCTA
        title="Need a counsellor for NEET rounds?"
        description="Get help with college shortlisting, counselling registration, and admission paperwork."
        primaryLabel="Talk to a counsellor"
        primaryHref="/contact"
        secondaryLabel="View MBBS colleges"
        secondaryHref="/colleges/mbbs-india"
      />
    </div>
  );
};

export default NeetRankPredictorPage;
