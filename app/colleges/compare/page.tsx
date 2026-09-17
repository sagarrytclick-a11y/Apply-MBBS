"use client";

import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Check,
  Copy,
  GitCompareArrows,
  Search,
  X,
} from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { PageCTA } from "@/components/ui/PageCTA";
import {
  getCompareCatalog,
  type CompareCollege,
} from "@/lib/catalog";

const MAX_COMPARE = 3;

const PATHWAY_LABEL: Record<CompareCollege["pathway"], string> = {
  india: "MBBS India",
  abroad: "MBBS Abroad",
  mdms: "MD / MS",
};

type RowKey =
  | "pathway"
  | "location"
  | "type"
  | "fees"
  | "nriFees"
  | "seats"
  | "recognition"
  | "ranking"
  | "admission";

const ROWS: { key: RowKey; label: string }[] = [
  { key: "pathway", label: "Pathway" },
  { key: "location", label: "Location" },
  { key: "type", label: "College type" },
  { key: "fees", label: "Fees" },
  { key: "nriFees", label: "NRI fees" },
  { key: "seats", label: "Seats" },
  { key: "recognition", label: "Recognition" },
  { key: "ranking", label: "Ranking" },
  { key: "admission", label: "Admission" },
];

function cellValue(college: CompareCollege, key: RowKey): string {
  switch (key) {
    case "pathway":
      return PATHWAY_LABEL[college.pathway];
    case "location":
      return [college.city, college.region].filter(Boolean).join(", ");
    case "type":
      return college.type || "—";
    case "fees":
      return college.fees || "—";
    case "nriFees":
      return college.nriFees || "—";
    case "seats":
      return typeof college.seats === "number" ? String(college.seats) : "—";
    case "recognition":
      return college.recognition || "—";
    case "ranking":
      return college.ranking && college.ranking.toUpperCase() !== "N/A"
        ? college.ranking
        : "—";
    case "admission":
      return college.admissionProcess || "—";
    default:
      return "—";
  }
}

function parseSlugs(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, MAX_COMPARE);
}

function CompareCollegesClient() {
  const catalog = useMemo(() => getCompareCatalog(), []);
  const bySlug = useMemo(() => {
    const map = new Map<string, CompareCollege>();
    for (const c of catalog) map.set(c.slug, c);
    return map;
  }, [catalog]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selected, setSelected] = useState<CompareCollege[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slugs = parseSlugs(searchParams.get("c"));
    const next = slugs
      .map((s) => bySlug.get(s))
      .filter((c): c is CompareCollege => Boolean(c));
    setSelected(next);
    setHydrated(true);
  }, [searchParams, bySlug]);

  const syncUrl = useCallback(
    (colleges: CompareCollege[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (colleges.length === 0) params.delete("c");
      else params.set("c", colleges.map((c) => c.slug).join(","));
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const addCollege = (college: CompareCollege) => {
    if (selected.some((c) => c.slug === college.slug)) return;
    if (selected.length >= MAX_COMPARE) return;
    const next = [...selected, college];
    setSelected(next);
    syncUrl(next);
    setQuery("");
    setOpen(false);
  };

  const removeCollege = (slug: string) => {
    const next = selected.filter((c) => c.slug !== slug);
    setSelected(next);
    syncUrl(next);
  };

  const clearAll = () => {
    setSelected([]);
    syncUrl([]);
  };

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const selectedSlugs = new Set(selected.map((c) => c.slug));
    return catalog
      .filter((c) => {
        if (selectedSlugs.has(c.slug)) return false;
        const hay = `${c.name} ${c.city} ${c.region} ${PATHWAY_LABEL[c.pathway]}`.toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 8);
  }, [catalog, query, selected]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const cols = Math.max(selected.length, 1);

  return (
    <main className="min-h-screen bg-background">
      <PageHero
        eyebrow="College compare"
        title={
          <>
            Compare medical colleges{" "}
            <span className="text-accent-bright">side by side</span>
          </>
        }
        description="Pick up to 3 colleges from MBBS India, Abroad, or MD/MS and compare fees, seats, recognition, and rankings in one table."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Compare colleges" },
        ]}
        surface="primary"
        pattern="grid"
      >
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 font-body text-xs font-semibold text-white/90">
            <GitCompareArrows className="h-3.5 w-3.5" />
            {selected.length}/{MAX_COMPARE} selected
          </span>
          {selected.length > 0 ? (
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 font-body text-xs font-semibold text-white/90 transition hover:bg-white/15"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-accent-soft" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Link copied" : "Copy share link"}
            </button>
          ) : null}
        </div>
      </PageHero>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div ref={boxRef} className="relative mx-auto max-w-2xl">
          <label htmlFor="compare-search" className="sr-only">
            Search colleges to compare
          </label>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-[var(--shadow-soft)] focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
            <Search className="h-5 w-5 shrink-0 text-muted" />
            <input
              ref={inputRef}
              id="compare-search"
              type="search"
              autoComplete="off"
              placeholder={
                selected.length >= MAX_COMPARE
                  ? "Remove a college to add another"
                  : "Search by college, city, or state…"
              }
              disabled={selected.length >= MAX_COMPARE}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              className="w-full bg-transparent font-body text-sm text-text outline-none placeholder:text-muted disabled:cursor-not-allowed"
            />
          </div>

          {open && query.trim().length >= 2 && selected.length < MAX_COMPARE ? (
            <ul className="absolute z-30 mt-2 max-h-80 w-full overflow-auto rounded-2xl border border-border bg-surface py-2 shadow-[var(--shadow-lift)]">
              {suggestions.length === 0 ? (
                <li className="px-4 py-3 font-body text-sm text-muted">
                  No colleges match “{query.trim()}”.
                </li>
              ) : (
                suggestions.map((c) => (
                  <li key={`${c.pathway}-${c.slug}`}>
                    <button
                      type="button"
                      onClick={() => addCollege(c)}
                      className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-blue-50"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-blue-50">
                        {c.image ? (
                          <Image
                            src={c.image}
                            alt=""
                            width={36}
                            height={36}
                            className="h-9 w-9 object-cover"
                            unoptimized
                          />
                        ) : (
                          <Building2 className="h-4 w-4 text-accent" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-body text-sm font-bold text-primary">
                          {c.name}
                        </span>
                        <span className="mt-0.5 block truncate font-body text-xs text-muted">
                          {PATHWAY_LABEL[c.pathway]} · {c.city}, {c.region}
                        </span>
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          ) : null}
        </div>

        {hydrated && selected.length > 0 ? (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <p className="font-body text-sm text-muted">
              Comparing {selected.length} college
              {selected.length === 1 ? "" : "s"}
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="font-body text-sm font-semibold text-accent hover:text-accent-deep"
            >
              Clear all
            </button>
          </div>
        ) : null}

        {!hydrated ? (
          <div className="mt-12 h-48 animate-pulse rounded-2xl bg-border/40" />
        ) : selected.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
            <GitCompareArrows className="mx-auto h-10 w-10 text-accent" />
            <h2 className="mt-4 font-display text-xl font-bold text-primary">
              Add colleges to start comparing
            </h2>
            <p className="mx-auto mt-2 max-w-md font-body text-sm text-muted">
              Search above and pick 2–3 options. Your selection stays in the URL
              so you can share the comparison.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/colleges/mbbs-india"
                className="inline-flex h-9 items-center rounded-[10px] border border-border bg-white px-4 font-body text-sm font-bold text-primary transition hover:border-accent/40 hover:bg-background"
              >
                Browse MBBS India
              </Link>
              <Link
                href="/colleges/mbbs-abroad"
                className="inline-flex h-9 items-center rounded-[10px] border border-border bg-white px-4 font-body text-sm font-bold text-primary transition hover:border-accent/40 hover:bg-background"
              >
                Browse Abroad
              </Link>
              <Link
                href="/colleges/md-ms"
                className="inline-flex h-9 items-center rounded-[10px] border border-border bg-white px-4 font-body text-sm font-bold text-primary transition hover:border-accent/40 hover:bg-background"
              >
                Browse MD / MS
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-surface shadow-[var(--shadow-soft)]">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-blue-50/60">
                  <th className="sticky left-0 z-10 w-36 bg-blue-50 px-4 py-4 font-body text-xs font-bold uppercase tracking-wide text-muted sm:w-44">
                    Detail
                  </th>
                  {selected.map((c) => (
                    <th
                      key={c.slug}
                      className="min-w-[200px] px-4 py-4 align-top"
                      style={{ width: `${100 / cols}%` }}
                    >
                      <div className="relative pr-8">
                        <button
                          type="button"
                          onClick={() => removeCollege(c.slug)}
                          className="absolute right-0 top-0 rounded-full p-1 text-muted transition hover:bg-white hover:text-primary"
                          aria-label={`Remove ${c.name}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="mb-3 h-28 overflow-hidden rounded-xl bg-blue-50">
                          {c.image ? (
                            <Image
                              src={c.image}
                              alt={c.name}
                              width={320}
                              height={180}
                              className="h-full w-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Building2 className="h-8 w-8 text-accent/50" />
                            </div>
                          )}
                        </div>
                        <Link
                          href={c.href}
                          className="font-body text-sm font-bold leading-snug text-primary hover:text-accent"
                        >
                          {c.name}
                        </Link>
                        <p className="mt-1 font-body text-xs text-muted">
                          {PATHWAY_LABEL[c.pathway]}
                        </p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => (
                  <tr
                    key={row.key}
                    className={
                      i % 2 === 0
                        ? "border-b border-border"
                        : "border-b border-border bg-background/60"
                    }
                  >
                    <th className="sticky left-0 z-10 bg-inherit px-4 py-3.5 font-body text-xs font-bold uppercase tracking-wide text-muted sm:text-[13px] sm:normal-case sm:tracking-normal">
                      <span className="bg-surface sm:bg-transparent">
                        {row.label}
                      </span>
                    </th>
                    {selected.map((c) => (
                      <td
                        key={`${c.slug}-${row.key}`}
                        className="px-4 py-3.5 font-body text-sm text-text"
                      >
                        {cellValue(c, row.key)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <th className="sticky left-0 z-10 bg-surface px-4 py-4 font-body text-xs font-bold uppercase tracking-wide text-muted" />
                  {selected.map((c) => (
                    <td key={`${c.slug}-cta`} className="px-4 py-4">
                      <Link
                        href={c.href}
                        className="inline-flex items-center gap-1.5 font-body text-sm font-bold text-accent hover:text-accent-deep"
                      >
                        View college
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {selected.length === 1 ? (
          <p className="mt-4 text-center font-body text-sm text-muted">
            Add one more college to see a side-by-side comparison.
          </p>
        ) : null}
      </section>

      <PageCTA
        title="Need help shortlisting the right college?"
        description="Share your NEET score, budget, and preferred states — our counsellors will narrow options with you."
        primaryLabel="Request counselling"
        primaryHref="/contact"
        secondaryLabel="Compare more colleges"
        secondaryHref="/colleges/mbbs-india"
      />
    </main>
  );
}

export default function CompareCollegesPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-6xl px-4 py-24">
            <div className="h-48 animate-pulse rounded-2xl bg-border/40" />
          </div>
        </main>
      }
    >
      <CompareCollegesClient />
    </Suspense>
  );
}
