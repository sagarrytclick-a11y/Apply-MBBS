"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, GraduationCap, Loader2, Search } from "lucide-react";
import { toCollegeSlug } from "@/lib/catalog";
import { dailySeed, shuffle } from "@/lib/shuffle";

type PathwayFilter = "all" | "india" | "abroad" | "mdms";

type ExplorerCollege = {
  id: number;
  name: string;
  city: string;
  fees?: string;
  image?: string;
  region: string;
  pathway: Exclude<PathwayFilter, "all">;
  parentSlug?: string;
};

const pathways: { id: PathwayFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "india", label: "MBBS India" },
  { id: "abroad", label: "MBBS Abroad" },
  { id: "mdms", label: "MD / MS" },
];

const pathwayLabels: Record<Exclude<PathwayFilter, "all">, string> = {
  india: "MBBS India",
  abroad: "MBBS Abroad",
  mdms: "MD / MS",
};

function collegeHref(college: ExplorerCollege) {
  if (college.pathway === "mdms" && college.parentSlug) {
    return `/colleges/md-ms/${college.parentSlug}`;
  }
  return `/colleges/${toCollegeSlug(college.name)}`;
}

export default function UniversityExplorer() {
  const searchParams = useSearchParams();
  const [allColleges, setAllColleges] = useState<ExplorerCollege[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [pathway, setPathway] = useState<PathwayFilter>("all");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const q = searchParams.get("q");
    if (q != null) startTransition(() => setQuery(q));
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [indiaRes, abroadRes, mdmsRes] = await Promise.all([
          fetch("/mbbs-india.json"),
          fetch("/mbbs-abroad.json"),
          fetch("/md-ms.json"),
        ]);
        const [india, abroad, mdms] = await Promise.all([
          indiaRes.json(),
          abroadRes.json(),
          mdmsRes.json(),
        ]);

        const list: ExplorerCollege[] = [];

        for (const state of india.states || []) {
          for (const c of state.colleges || []) {
            list.push({
              id: c.id,
              name: c.name,
              city: c.city,
              fees: c.fees ? String(c.fees) : undefined,
              image: c.image ? String(c.image) : undefined,
              region: state.name,
              pathway: "india",
            });
          }
        }

        for (const country of abroad.countries || []) {
          for (const c of country.colleges || []) {
            list.push({
              id: c.id,
              name: c.name,
              city: c.city,
              fees: c.fees ? String(c.fees) : undefined,
              image: c.image ? String(c.image) : undefined,
              region: country.name,
              pathway: "abroad",
            });
          }
        }

        for (const state of mdms.states || []) {
          for (const c of state.colleges || []) {
            list.push({
              id: c.id,
              name: c.name,
              city: c.city,
              fees: c.fees ? String(c.fees) : undefined,
              image: c.image ? String(c.image) : undefined,
              region: state.name,
              pathway: "mdms",
              parentSlug: state.slug,
            });
          }
        }

        if (!cancelled) setAllColleges(shuffle(list, dailySeed() + 19));
      } catch {
        if (!cancelled) setAllColleges([]);
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allColleges
      .filter((c) => (pathway === "all" ? true : c.pathway === pathway))
      .filter((c) => {
        if (!q) return true;
        return (
          c.name.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q)
        );
      })
      .slice(0, 9);
  }, [allColleges, pathway, query]);

  const catalogueHref =
    pathway === "india"
      ? "/colleges/mbbs-india"
      : pathway === "abroad"
        ? "/colleges/mbbs-abroad"
        : pathway === "mdms"
          ? "/colleges/md-ms"
          : "/colleges/mbbs-abroad";

  return (
    <section id="universities" className="he-section scroll-mt-28">
      <div className="he-container">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
              Explore medical colleges
            </h2>
            <p className="mt-2 font-body text-sm text-muted">
              Filter by name or city, then open any listing for full details.
            </p>
          </div>
          <Link
            href={catalogueHref}
            className="inline-flex items-center gap-1.5 font-body text-sm font-bold text-accent-deep hover:text-primary"
          >
            See complete colleges 
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6">
          <label className="relative block max-w-xl">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="College name or city…"
              className="h-12 w-full rounded-[12px] border border-border bg-white pl-10 pr-3 font-body text-sm text-primary outline-none placeholder:text-muted focus:border-accent"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border">
          {pathways.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => startTransition(() => setPathway(item.id))}
              className={`border-b-2 pb-2.5 font-body text-sm font-semibold transition-colors ${
                pathway === item.id
                  ? "border-accent text-primary"
                  : "border-transparent text-muted hover:text-primary"
              }`}
            >
              {item.label}
            </button>
          ))}
          {(isPending || loadingList) && (
            <Loader2 className="mb-2.5 h-3.5 w-3.5 animate-spin text-muted" />
          )}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {!loadingList && filtered.length === 0 && (
            <div className="col-span-full rounded-[16px] border border-dashed border-border bg-white py-12 text-center">
              <p className="font-body text-sm text-muted">
                Nothing matched. Adjust your filters or search terms.
              </p>
            </div>
          )}

          {filtered.map((college) => (
            <Link
              key={`${college.pathway}-${college.id}`}
              href={collegeHref(college)}
              prefetch={false}
              className="group overflow-hidden rounded-[16px] border border-border bg-white transition-colors hover:border-accent/40"
            >
              <div className="relative h-40 bg-primary/5">
                {college.image ? (
                  <Image
                    src={college.image}
                    alt={college.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary to-accent-deep">
                    <GraduationCap className="h-10 w-10 text-white/80" />
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2 py-1 font-body text-[10px] font-bold uppercase tracking-wide text-primary">
                  {pathwayLabels[college.pathway]}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-[15px] font-bold leading-snug text-primary line-clamp-2">
                  {college.name}
                </h3>
                <p className="mt-1.5 font-body text-xs text-muted">
                  {college.city} · {college.region}
                </p>
                {college.fees && (
                  <p className="mt-2 font-body text-xs font-semibold text-accent-deep line-clamp-1">
                    {college.fees}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
