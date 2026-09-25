"use client";

import React, { useMemo, useState } from "react";
import {
  BadgeCheck,
  ClipboardList,
  Landmark,
  Users,
  CalendarClock,
  Info,
  Calculator,
  Gauge,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PageCTA } from "@/components/ui/PageCTA";

type QualifyingRow = {
  category: string;
  percentile: string;
  range: string;
  qualifiers: string;
};

const qualifying2026: QualifyingRow[] = [
  { category: "UR / EWS", percentile: "50th", range: "715 – 213", qualifiers: "9,96,935" },
  { category: "OBC-NCL", percentile: "40th", range: "212 – 177", qualifiers: "81,111" },
  { category: "SC", percentile: "40th", range: "212 – 177", qualifiers: "29,947" },
  { category: "ST", percentile: "40th", range: "212 – 177", qualifiers: "12,452" },
  { category: "UR / EWS – PwBD", percentile: "45th", range: "212 – 194", qualifiers: "480" },
  { category: "OBC – PwBD", percentile: "40th", range: "193 – 177", qualifiers: "185" },
  { category: "SC – PwBD", percentile: "40th", range: "193 – 177", qualifiers: "64" },
  { category: "ST – PwBD", percentile: "40th", range: "191 – 178", qualifiers: "11" },
];

const aiqClosing2026 = [
  { category: "General (UR)", closing: "22,342" },
  { category: "OBC-NCL", closing: "23,075" },
  { category: "EWS", closing: "27,179" },
  { category: "SC", closing: "1,04,921" },
  { category: "ST", closing: "1,32,111" },
];

type AIIMSRow = {
  campus: string;
  gen: number;
  ews: number;
  obc: number;
  sc: number;
  st: number;
};

const aiimsClosing2026: AIIMSRow[] = [
  { campus: "AIIMS New Delhi", gen: 51, ews: 292, obc: 192, sc: 793, st: 987 },
  { campus: "AIIMS Jodhpur", gen: 343, ews: 879, obc: 714, sc: 3941, st: 4457 },
  { campus: "AIIMS Rishikesh", gen: 537, ews: 1089, obc: 979, sc: 6429, st: 8532 },
  { campus: "AIIMS Bhopal", gen: 567, ews: 1220, obc: 1084, sc: 7782, st: 8673 },
  { campus: "AIIMS Bhubaneswar", gen: 664, ews: 1660, obc: 1233, sc: 5396, st: 10926 },
  { campus: "AIIMS Nagpur", gen: 792, ews: 1839, obc: 1350, sc: 8360, st: 13431 },
  { campus: "AIIMS Raipur", gen: 1008, ews: 2323, obc: 1683, sc: 12796, st: 16950 },
  { campus: "AIIMS Mangalagiri", gen: 1314, ews: 3021, obc: 2079, sc: 16901, st: 21776 },
  { campus: "AIIMS Patna", gen: 1593, ews: 2675, obc: 2054, sc: 16709, st: 24984 },
  { campus: "AIIMS Bathinda", gen: 1630, ews: 2910, obc: 2190, sc: 18819, st: 26664 },
  { campus: "AIIMS Bibinagar", gen: 1705, ews: 3180, obc: 2592, sc: 17543, st: 28792 },
  { campus: "AIIMS Rajkot", gen: 2039, ews: 2889, obc: 2892, sc: 20222, st: 31646 },
  { campus: "AIIMS Gorakhpur", gen: 2114, ews: 3085, obc: 2443, sc: 19159, st: 33950 },
  { campus: "AIIMS Kalyani", gen: 2188, ews: 3955, obc: 3049, sc: 18440, st: 37522 },
  { campus: "AIIMS Bilaspur", gen: 2260, ews: 3287, obc: 2786, sc: 20129, st: 30805 },
  { campus: "AIIMS Rae Bareli", gen: 2634, ews: 3586, obc: 3160, sc: 22455, st: 35875 },
  { campus: "AIIMS Deoghar", gen: 3090, ews: 4569, obc: 3771, sc: 25371, st: 40599 },
  { campus: "AIIMS Guwahati", gen: 2997, ews: 4802, obc: 3823, sc: 27539, st: 37116 },
  { campus: "AIIMS Vijaypur", gen: 3327, ews: 4748, obc: 3834, sc: 27322, st: 34696 },
  { campus: "AIIMS Madurai", gen: 3421, ews: 5416, obc: 4281, sc: 27253, st: 44940 },
];

const topGovt2025 = [
  { name: "Maulana Azad Medical College (MAMC), New Delhi", opening: 54, closing: 103 },
  { name: "VMMC & Safdarjung Hospital, New Delhi", opening: 49, closing: 132 },
  { name: "JIPMER, Puducherry", opening: 50, closing: 258 },
  { name: "Madras Medical College, Chennai", opening: 260, closing: 695 },
  { name: "Seth GS Medical College, Mumbai", opening: 96, closing: 868 },
  { name: "Lady Hardinge Medical College, New Delhi", opening: 278, closing: 1128 },
  { name: "Institute of Medical Sciences, BHU Varanasi", opening: 235, closing: 1165 },
  { name: "Aligarh Muslim University (JN Medical College)", opening: 779, closing: 3971 },
];

const indicativeBands = [
  {
    category: "General (UR)",
    band: "610 – 630+",
    note: "Realistic planning window for most government MBBS seats under AIQ",
  },
  { category: "EWS", band: "585 – 615+", note: "EWS glasses usually sit a notch below UR" },
  { category: "OBC-NCL", band: "590 – 615+", note: "Reserved seats open at slightly softer marks" },
  { category: "SC", band: "520 – 570+", note: "Broad window across state and AIQ seats" },
  { category: "ST", band: "490 – 540+", note: "Often the lowest qualifying bar among vertical categories" },
];

const formatAIR = (n: number) => n.toLocaleString("en-IN");

const appeared2026 = 1999895;

const scoreRankAnchors: ReadonlyArray<readonly [number, number]> = [
  [715, 1], [710, 4], [700, 19], [681, 253], [660, 883], [653, 1277],
  [641, 2100], [631, 3318], [622, 4667], [615, 6151], [608, 7700], [600, 10469],
  [590, 13608], [584, 17600], [575, 20000], [566, 25600], [560, 29500],
  [549, 37500], [542, 44000], [535, 50000], [525, 59000], [510, 77000],
  [501, 88420], [500, 90000], [493, 100000], [483, 114000], [474, 127000],
  [460, 150000], [451, 165000], [444, 178000], [436, 192000], [433, 200000],
  [428, 210452], [419, 229000], [413, 242973], [410, 250000], [405, 260000],
  [400, 270000], [389, 300000], [372, 347000], [371, 350000], [360, 384276],
  [355, 400000], [340, 450000], [332, 475000], [325, 500000], [312, 550000],
  [299, 600000], [287, 650000], [275, 700000], [264, 750000], [253, 800000],
  [242, 850000], [232, 900000], [222, 950000], [213, 995000], [202, 1050000],
  [193, 1100000], [185, 1150000], [176, 1200000], [167, 1250000], [159, 1300000],
  [150, 1350000], [143, 1400000], [135, 1450000], [126, 1500000], [119, 1550000],
  [110, 1600000], [102, 1650000], [94, 1700000], [85, 1750000], [76, 1800000],
  [66, 1850000], [54, 1900000], [38, 1950000],
];

function estimateRank(score: number): number {
  if (score >= 715) return 1;
  if (score <= 0 || score < scoreRankAnchors[scoreRankAnchors.length - 1][0]) {
    return Math.round(appeared2026 * (1 - 0.015));
  }
  for (let i = 1; i < scoreRankAnchors.length; i += 1) {
    const [hiScore, hiRank] = scoreRankAnchors[i - 1];
    const [loScore, loRank] = scoreRankAnchors[i];
    if (score <= hiScore && score > loScore) {
      const t = (hiScore - score) / (hiScore - loScore);
      return Math.round(hiRank + t * (loRank - hiRank));
    }
  }
  return Math.round(appeared2026 * (1 - 0.015));
}

function rankInsight(rank: number): string {
  if (rank <= 19) return "Top-20 band — AIIMS Delhi and JIPMER are very realistic.";
  if (rank <= 1492) return "Within the top ~1,500 — strong AIQ and top government college chances.";
  if (rank <= 10160) return "Within 600+ bracket — AIQ government MBBS and premier state seats in play.";
  if (rank <= 45200) return "State-quota government MBBS and good deemed seats likely with planning.";
  if (rank <= 90000) return "Reserved-category government seats, private MBBS or strong BDS options.";
  if (rank <= 165000) return "Mostly private MBBS seats and government BDS / AYUSH depending on quota.";
  if (rank <= 270000) return "Private MBBS at selective colleges, or allied (BDS/AYUSH) pathways.";
  if (rank <= 400000) return "Below typical government MBBS closing — consider BDS, AYUSH or private seats.";
  if (rank <= 995000) return "Qualifying zone — government MBBS unlikely at AIR; explore category quota & state options.";
  return "Outside realistic MBBS range — allied health, BDS or retake-planning stage.";
}

const categoryCutoffs = [
  { id: "ur", label: "UR / EWS", cutoff: 213 },
  { id: "obc", label: "OBC-NCL", cutoff: 177 },
  { id: "sc", label: "SC", cutoff: 177 },
  { id: "st", label: "ST", cutoff: 177 },
];

const ScoreRankEstimator: React.FC = () => {
  const [score, setScore] = useState(600);
  const [category, setCategory] = useState("ur");

  const cat = categoryCutoffs.find((c) => c.id === category) ?? categoryCutoffs[0];

  const result = useMemo(() => {
    if (score >= 720) return { rank: 1, qualified: true };
    if (score <= 0) return null;
    const rank = estimateRank(score);
    return { rank, qualified: score >= cat.cutoff };
  }, [score, cat.cutoff]);

  const percentile = result
    ? Math.max(0.01, Math.min(99.9999, (1 - result.rank / appeared2026) * 100))
    : 0;
  const bandLo = result ? Math.max(1, Math.round(result.rank * 0.9)) : 0;
  const bandHi = result ? Math.round(result.rank * 1.1) : 0;

  const handleInput = (v: string) => {
    if (v === "") {
      setScore(0);
      return;
    }
    const n = Number(v);
    if (!Number.isNaN(n)) setScore(Math.max(0, Math.min(720, Math.round(n))));
  };

  return (
    <section className="he-section border-y border-border bg-white">
      <div className="he-container">
        <SectionHeader
          eyebrow="Score → rank tool"
          title={
            <>
              Estimate your <span className="text-secondary">AIR from Marks</span>
            </>
          }
          description="Enter your Re-NEET 2026 score to estimate your All India Rank. Anchored to the official NTA score distribution (19 at 700+, 1,492 at 650+, 10,160 at 600+, 90,780 at 500+) and 2026 marks-vs-rank data."
          className="mb-7"
        />

        <div className="grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="rounded-[16px] border border-border bg-background p-5 sm:p-6">
              <label
                htmlFor="score"
                className="flex items-center gap-2 font-body text-xs font-bold uppercase tracking-[0.12em] text-muted"
              >
                <Calculator className="h-4 w-4 text-accent-deep" />
                Your NEET score (out of 720)
              </label>
              <input
                id="score"
                type="number"
                min={0}
                max={720}
                value={score === 0 ? "" : score}
                onChange={(e) => handleInput(e.target.value)}
                placeholder="e.g. 545"
                className="mt-3 w-full rounded-[12px] border border-border bg-white px-4 py-3 font-display text-2xl font-extrabold text-primary outline-none transition-colors placeholder:font-body placeholder:text-sm placeholder:font-normal placeholder:text-muted focus:border-accent"
              />
              <input
                type="range"
                min={0}
                max={720}
                step={1}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="mt-4 w-full accent-accent"
                aria-label="Score slider"
              />

              <p className="mt-5 font-body text-xs font-bold uppercase tracking-[0.12em] text-muted">
                Category
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {categoryCutoffs.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`rounded-[10px] px-3.5 py-2 font-body text-xs font-bold transition-colors ${
                      category === c.id
                        ? "bg-gradient-to-r from-accent to-accent-deep text-white shadow-[0_4px_12px_rgba(21,128,61,0.28)]"
                        : "border border-border bg-white text-text hover:border-accent/40"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-[16px] border border-primary bg-primary p-5 sm:p-7">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/25 blur-3xl" />
              {result ? (
                result.qualified ? (
                  <div className="relative">
                    <p className="flex items-center gap-2 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                      <Gauge className="h-4 w-4" />
                      Estimated AIR
                    </p>
                    <div className="mt-1 flex flex-wrap items-end gap-x-3 gap-y-1">
                      <span className="font-display text-4xl font-extrabold text-white sm:text-5xl">
                        {formatAIR(result.rank)}
                      </span>
                      <span className="mb-1.5 font-body text-sm font-semibold text-white/70">
                        typical band {formatAIR(bandLo)} – {formatAIR(bandHi)}
                      </span>
                    </div>
                    <p className="mt-1 font-body text-xs text-white/70">
                      Approx. percentile ≈ {percentile.toFixed(2)} · other categories
                      rank separately in counselling
                    </p>

                    {
                      <p className="mt-4 inline-block rounded-[10px] bg-white/10 px-3 py-2 font-body text-sm leading-relaxed text-white/90 ring-1 ring-white/20">
                        {rankInsight(result.rank)}
                      </p>
                    }

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-[10px] border border-white/15 px-3 py-1.5 font-body text-[11px] font-semibold text-white/80">
                        AIIMS Delhi closed at AIR 51
                      </span>
                      <span className="rounded-[10px] border border-white/15 px-3 py-1.5 font-body text-[11px] font-semibold text-white/80">
                        AIQ MBBS (UR) closed at AIR 22,342
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-accent">
                      Not qualifying
                    </p>
                    <p className="mt-2 font-display text-2xl font-extrabold text-white sm:text-3xl">
                      {score} <span className="text-white/60">is below the</span>{" "}
                      {cat.cutoff}
                      <span className="text-white/60"> cutoff for {cat.label}.</span>
                    </p>
                    <p className="mt-2 font-body text-sm text-white/75">
                      You need at least {cat.cutoff} marks (40th–50th percentile
                      depending on category) to qualify for NEET UG 2026 counselling.
                    </p>
                  </div>
                )
              ) : (
                <p className="relative font-body text-sm text-white/70">
                  Enter a score between 0 and 720 to estimate your rank.
                </p>
              )}
            </div>

            <p className="mt-3 flex items-start gap-2 font-body text-xs leading-relaxed text-muted">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-deep" />
              Estimate only — the official AIR also depends on tie-breaking rules
              (age, fewer wrong answers, etc.). Use it to plan, then confirm with your
              NTA scorecard and MCC counselling.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const stats = [
  { icon: Users, value: "19,99,895", label: "Candidates appeared (2026)" },
  { icon: BadgeCheck, value: "11,21,185", label: "Qualified for counselling" },
  { icon: Landmark, value: "22,342", label: "AIQ MBBS closing AIR (UR)" },
  { icon: CalendarClock, value: "29,945", label: "Seats allotted in Round 1" },
];

const NeetCutoffPage: React.FC = () => {
  return (
    <div className="bg-background min-h-screen font-body">
      <ScoreRankEstimator />

      {/* Stats band */}
      <section className="border-b border-border bg-white">
        <div className="he-container py-5 sm:py-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-2.5 sm:gap-3">
                  <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-accent/10 text-accent-deep sm:inline-flex">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-display text-lg font-extrabold text-primary sm:text-2xl">
                      {s.value}
                    </p>
                    <p className="font-body text-[10px] font-semibold uppercase tracking-wide text-muted sm:text-xs">
                      {s.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Qualifying cutoffs */}
      <section className="he-section">
        <div className="he-container">
          <SectionHeader
            eyebrow="Qualifying cutoff — 2026"
            title={
              <>
                NEET UG 2026 category-wise{" "}
                <span className="text-secondary">qualifying marks</span>
              </>
            }
            description="Released by NTA on 16 July 2026 alongside the Re-NEET result. Scoring within (or above) your category range makes you eligible for counselling."
            className="mb-7"
          />

          <div className="overflow-hidden rounded-[16px] border border-border">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm font-body">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="px-4 py-3 text-left font-body text-[11px] font-bold uppercase tracking-[0.12em] text-muted sm:px-5">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left font-body text-[11px] font-bold uppercase tracking-[0.12em] text-muted sm:px-5">
                      Percentile
                    </th>
                    <th className="px-4 py-3 text-left font-body text-[11px] font-bold uppercase tracking-[0.12em] text-muted sm:px-5">
                      Marks range
                    </th>
                    <th className="px-4 py-3 text-left font-body text-[11px] font-bold uppercase tracking-[0.12em] text-muted sm:px-5">
                      Qualified
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {qualifying2026.map((row, i) => (
                    <tr
                      key={row.category}
                      className={`border-b border-border last:border-0 ${
                        i % 2 === 0 ? "bg-white" : "bg-surface/40"
                      }`}
                    >
                      <td className="px-4 py-3 font-bold text-primary sm:px-5">
                        {row.category}
                      </td>
                      <td className="px-4 py-3 font-semibold text-accent-deep sm:px-5">
                        {row.percentile}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-primary sm:px-5">
                        {row.range}
                      </td>
                      <td className="px-4 py-3 text-muted sm:px-5">{row.qualifiers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[14px] border border-accent/30 bg-accent/8 p-4">
              <p className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-accent-deep">
                Total qualifiers 2026
              </p>
              <p className="mt-1 font-display text-2xl font-extrabold text-primary">
                11,21,185
              </p>
              <p className="mt-1 font-body text-xs text-muted">
                Out of 19,99,895 who appeared (22,79,743 registered) · down from
                12,36,531 qualifiers in 2025.
              </p>
            </div>
            <div className="rounded-[14px] border border-border bg-white p-4">
              <p className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                2026 vs 2025 marks (UR/EWS)
              </p>
              <p className="mt-1 font-display text-2xl font-extrabold text-primary">
                715–213 <span className="text-lg font-bold text-muted">vs</span> 686–144
              </p>
              <p className="mt-1 font-body text-xs text-muted">
                A sharply higher bar this year — the Re-NEET paper was easier than
                NEET 2025.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AIQ closing ranks + AIIMS */}
      <section className="he-section border-y border-border bg-white">
        <div className="he-container">
          <SectionHeader
            eyebrow="Admission cutoff — Round 1"
            title={
              <>
                MBBS All India Quota{" "}
                <span className="text-secondary">closing ranks 2026</span>
              </>
            }
            description="MCC released the Round 1 final seat-allotment result on 24 August 2026. The closing rank is the last NEET rank allotted a government MBBS seat in that category under the 15% All India Quota."
            className="mb-7"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {aiqClosing2026.map((row) => (
              <div
                key={row.category}
                className="rounded-[14px] border border-border border-t-4 border-t-accent bg-white p-4"
              >
                <p className="font-body text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
                  {row.category}
                </p>
                <p className="mt-1.5 font-display text-2xl font-extrabold text-primary">
                  {row.closing}
                </p>
                <p className="mt-1 font-body text-[11px] text-muted">
                  Round 1 closing AIR (MBBS)
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <p className="mb-4 font-display text-lg font-extrabold text-primary sm:text-xl">
              AIIMS MBBS 2026 · Round 1 category-wise closing ranks
            </p>
            <div className="overflow-hidden rounded-[16px] border border-border">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-sm font-body">
                  <thead>
                    <tr className="border-b border-border bg-surface">
                      <th className="px-4 py-3 text-left font-body text-[11px] font-bold uppercase tracking-[0.12em] text-muted sm:px-5">
                        AIIMS campus
                      </th>
                      <th className="px-4 py-3 text-right font-body text-[11px] font-bold uppercase tracking-[0.12em] text-muted sm:px-5">
                        General
                      </th>
                      <th className="px-4 py-3 text-right font-body text-[11px] font-bold uppercase tracking-[0.12em] text-muted sm:px-5">
                        EWS
                      </th>
                      <th className="px-4 py-3 text-right font-body text-[11px] font-bold uppercase tracking-[0.12em] text-muted sm:px-5">
                        OBC
                      </th>
                      <th className="px-4 py-3 text-right font-body text-[11px] font-bold uppercase tracking-[0.12em] text-muted sm:px-5">
                        SC
                      </th>
                      <th className="px-4 py-3 text-right font-body text-[11px] font-bold uppercase tracking-[0.12em] text-muted sm:px-5">
                        ST
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {aiimsClosing2026.map((row, i) => (
                      <tr
                        key={row.campus}
                        className={`border-b border-border last:border-0 ${
                          i % 2 === 0 ? "bg-white" : "bg-surface/40"
                        }`}
                      >
                        <td className="px-4 py-3 font-bold text-primary sm:px-5">
                          {row.campus}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-accent-deep sm:px-5">
                          {formatAIR(row.gen)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-primary sm:px-5">
                          {formatAIR(row.ews)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-primary sm:px-5">
                          {formatAIR(row.obc)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-primary sm:px-5">
                          {formatAIR(row.sc)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-muted sm:px-5">
                          {formatAIR(row.st)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="mt-3 flex items-start gap-2 font-body text-xs leading-relaxed text-muted">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-deep" />
              AIIMS New Delhi General closed at AIR 51 in Round 1 (48 in 2025);
              Jodhpur fell from 392 to 343. State-quota seats (85%) close deeper
              than these AIQ ranks.
            </p>
          </div>
        </div>
      </section>

      {/* Previous year top government colleges */}
      <section className="he-section">
        <div className="he-container">
          <SectionHeader
            eyebrow="Previous year reference"
            title={
              <>
                Top government colleges — NEET 2025{" "}
                <span className="text-secondary">Round 1 (AIQ, General)</span>
              </>
            }
            description="MCC Round 1 2025 opening and closing ranks for marquee government colleges. Useful trend reference while 2026 state counselling rounds complete."
            className="mb-7"
          />
          <div className="overflow-hidden rounded-[16px] border border-border">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm font-body">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="px-4 py-3 text-left font-body text-[11px] font-bold uppercase tracking-[0.12em] text-muted sm:px-5">
                      College
                    </th>
                    <th className="px-4 py-3 text-right font-body text-[11px] font-bold uppercase tracking-[0.12em] text-muted sm:px-5">
                      Opening AIR
                    </th>
                    <th className="px-4 py-3 text-right font-body text-[11px] font-bold uppercase tracking-[0.12em] text-muted sm:px-5">
                      Closing AIR
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topGovt2025.map((row, i) => (
                    <tr
                      key={row.name}
                      className={`border-b border-border last:border-0 ${
                        i % 2 === 0 ? "bg-white" : "bg-surface/40"
                      }`}
                    >
                      <td className="px-4 py-3 font-bold text-primary sm:px-5">
                        {row.name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-primary sm:px-5">
                        {formatAIR(row.opening)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-accent-deep sm:px-5">
                        {formatAIR(row.closing)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Indicative planning bands */}
      <section className="he-section border-t border-border bg-white">
        <div className="he-container">
          <SectionHeader
            eyebrow="Planning ranges"
            title={
              <>
                Realistic score bands for a{" "}
                <span className="text-secondary">government seat</span>
              </>
            }
            description="Indicative planning ranges widely used after Re-NEET 2026 — not official cutoffs. Always verify against current MCC and state counselling results."
            className="mb-7"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {indicativeBands.map((band) => (
              <div
                key={band.category}
                className="rounded-[14px] border border-border border-l-4 border-l-accent bg-white p-5"
              >
                <p className="font-body text-xs font-bold uppercase tracking-[0.1em] text-muted">
                  {band.category}
                </p>
                <p className="mt-1 font-display text-2xl font-extrabold text-primary">
                  {band.band}
                </p>
                <p className="mt-1 font-body text-xs leading-relaxed text-muted">
                  {band.note}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-2 rounded-[12px] border border-border bg-background px-4 py-3">
            <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-accent-deep" />
            <p className="font-body text-xs leading-relaxed text-muted">
              <span className="font-bold text-text">Sources:</span> NTA NEET (UG)
              2026 official result & key data points (16 July 2026) and MCC UG 2026
              Round 1 final seat-allotment PDFs (24 August 2026, mcc.nic.in). Data
              is recompiled for reference; verify seat-wise cutoffs on official
              authorities before making admission decisions.
            </p>
          </div>
        </div>
      </section>

      <PageCTA
        title="Confused by your cutoff vs chances?"
        description="Tell us your score, category and state — we’ll map your realistic MBBS shortlist and counselling plan."
        primaryLabel="Talk to a counsellor"
        primaryHref="/contact"
        secondaryLabel="Browse MBBS colleges"
        secondaryHref="/colleges/mbbs-india"
      />
    </div>
  );
};

export default NeetCutoffPage;