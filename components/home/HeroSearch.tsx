"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Building2,
  FileText,
  Globe2,
  GraduationCap,
  Search,
  TrendingUp,
  X,
} from "lucide-react";
import { toCollegeSlug, toCountrySlug } from "@/lib/catalog";

type ResultKind = "college" | "country" | "blog" | "page";

type SearchHit = {
  id: string;
  kind: ResultKind;
  title: string;
  subtitle: string;
  href: string;
  trending?: boolean;
};

const STATIC_PAGES: SearchHit[] = [
  {
    id: "page-india",
    kind: "page",
    title: "MBBS India",
    subtitle: "Pathway",
    href: "/colleges/mbbs-india",
    trending: true,
  },
  {
    id: "page-abroad",
    kind: "page",
    title: "MBBS Abroad",
    subtitle: "Pathway",
    href: "/colleges/mbbs-abroad",
    trending: true,
  },
  {
    id: "page-mdms",
    kind: "page",
    title: "MD / MS",
    subtitle: "Pathway",
    href: "/colleges/md-ms",
    trending: true,
  },
  {
    id: "page-neet",
    kind: "page",
    title: "NEET Rank Predictor",
    subtitle: "Tool",
    href: "/neet-rank-predictor",
    trending: true,
  },
  {
    id: "page-blog",
    kind: "page",
    title: "Blog & updates",
    subtitle: "Guides",
    href: "/blog",
  },
  {
    id: "page-contact",
    kind: "page",
    title: "Contact counsellor",
    subtitle: "Support",
    href: "/contact",
  },
  {
    id: "page-about",
    kind: "page",
    title: "About Apply MBBS",
    subtitle: "About",
    href: "/about",
  },
];

const KIND_META: Record<
  ResultKind,
  { label: string; Icon: typeof Building2 }
> = {
  college: { label: "College", Icon: Building2 },
  country: { label: "Country", Icon: Globe2 },
  blog: { label: "Blog", Icon: BookOpen },
  page: { label: "Page", Icon: FileText },
};

function pathwayLabel(pathway: string) {
  if (pathway === "india") return "MBBS India";
  if (pathway === "abroad") return "MBBS Abroad";
  if (pathway === "mdms") return "MD / MS";
  return pathway;
}

export default function HeroSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchHit[]>([]);
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [indiaRes, abroadRes, mdmsRes, blogsRes] = await Promise.all([
          fetch("/mbbs-india.json"),
          fetch("/mbbs-abroad.json"),
          fetch("/md-ms.json"),
          fetch("/blogs.json"),
        ]);
        const [india, abroad, mdms, blogsJson] = await Promise.all([
          indiaRes.json(),
          abroadRes.json(),
          mdmsRes.json(),
          blogsRes.json(),
        ]);

        const hits: SearchHit[] = [...STATIC_PAGES];

        for (const state of india.states || []) {
          for (const c of state.colleges || []) {
            hits.push({
              id: `india-${c.id}`,
              kind: "college",
              title: c.name,
              subtitle: `${c.city} · ${pathwayLabel("india")}`,
              href: `/colleges/${toCollegeSlug(c.name)}`,
            });
          }
        }

        for (const country of abroad.countries || []) {
          hits.push({
            id: `country-${country.id ?? country.name}`,
            kind: "country",
            title: `MBBS in ${country.name}`,
            subtitle: `${country.colleges?.length || 0} universities`,
            href: `/country/${toCountrySlug(country.name)}`,
            trending: true,
          });
          for (const c of country.colleges || []) {
            hits.push({
              id: `abroad-${c.id}`,
              kind: "college",
              title: c.name,
              subtitle: `${c.city} · ${country.name}`,
              href: `/colleges/${toCollegeSlug(c.name)}`,
            });
          }
        }

        for (const state of mdms.states || []) {
          for (const c of state.colleges || []) {
            hits.push({
              id: `mdms-${c.id}`,
              kind: "college",
              title: c.name,
              subtitle: `${c.city} · MD/MS · ${state.name}`,
              href: state.slug
                ? `/colleges/md-ms/${state.slug}`
                : `/colleges/${toCollegeSlug(c.name)}`,
            });
          }
        }

        for (const b of blogsJson.blogs || []) {
          hits.push({
            id: `blog-${b.id}`,
            kind: "blog",
            title: b.title,
            subtitle: b.category || "Blog",
            href: `/blog/${b.id}`,
          });
        }

        if (!cancelled) {
          setIndex(hits);
          setReady(true);
        }
      } catch {
        if (!cancelled) {
          setIndex(STATIC_PAGES);
          setReady(true);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => overlayInputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const popular = useMemo(() => {
    const trending = index.filter((h) => h.trending).slice(0, 9);
    if (trending.length >= 6) return trending;
    return [...STATIC_PAGES.filter((p) => p.trending), ...trending]
      .filter((v, i, a) => a.findIndex((x) => x.id === v.id) === i)
      .slice(0, 9);
  }, [index]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index
      .map((item) => {
        const title = item.title.toLowerCase();
        const sub = item.subtitle.toLowerCase();
        let score = 0;
        if (title.startsWith(q)) score += 40;
        else if (title.includes(q)) score += 24;
        if (sub.includes(q)) score += 10;
        const words = q.split(/\s+/).filter(Boolean);
        if (words.every((w) => title.includes(w) || sub.includes(w))) score += 8;
        return { item, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 36)
      .map((x) => x.item);
  }, [index, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const goTo = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (results[activeIndex]) {
      goTo(results[activeIndex].href);
      return;
    }
    const q = query.trim();
    if (q) goTo(`/?q=${encodeURIComponent(q)}#universities`);
  };

  const openOverlay = () => setOpen(true);

  const list = query.trim() ? results : popular;
  const showingPopular = !query.trim();

  const overlay =
    mounted && open
      ? createPortal(
          <div
            className="fixed inset-0 z-[200] flex flex-col bg-white font-body"
            role="dialog"
            aria-modal="true"
            aria-label="Site search"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3.5 sm:px-6 sm:py-4">
              <h2 className="font-display text-lg font-extrabold text-primary sm:text-xl">
                Search
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent/40 hover:text-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-hidden px-4 py-5 sm:px-6 sm:py-7">
              <form onSubmit={handleSubmit} className="shrink-0">
                <label className="sr-only" htmlFor="site-search-overlay-input">
                  What are you looking for?
                </label>
                <div className="flex items-center rounded-[14px] border-2 border-accent bg-white shadow-[0_8px_28px_rgba(21,128,61,0.12)] focus-within:ring-4 focus-within:ring-accent/15">
                  <Search className="ml-4 h-5 w-5 shrink-0 text-muted sm:h-6 sm:w-6" />
                  <input
                    ref={overlayInputRef}
                    id="site-search-overlay-input"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (!list.length) return;
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setActiveIndex((i) => (i + 1) % list.length);
                      } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setActiveIndex((i) => (i - 1 + list.length) % list.length);
                      }
                    }}
                    placeholder="What are you looking for?"
                    className="h-14 w-full bg-transparent px-3 font-body text-base text-primary outline-none placeholder:text-muted sm:h-16 sm:px-4 sm:text-lg"
                    autoComplete="off"
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface hover:text-primary"
                      aria-label="Clear"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : null}
                  <button
                    type="submit"
                    className="mr-2 hidden h-11 shrink-0 items-center gap-2 rounded-[10px] bg-accent px-4 font-body text-sm font-extrabold text-white hover:bg-accent-deep sm:inline-flex"
                  >
                    Find
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>

              <div className="mt-6 flex min-h-0 flex-1 flex-col sm:mt-8">
                <div className="mb-3 flex shrink-0 items-center gap-2 sm:mb-4">
                  <TrendingUp className="h-4 w-4 text-accent-deep" />
                  <h3 className="font-display text-base font-extrabold text-primary sm:text-lg">
                    {showingPopular ? "Popular searches" : "Matching results"}
                  </h3>
                  <span className="font-body text-xs text-muted">
                    {ready ? `${list.length}` : "…"}
                  </span>
                </div>

                <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain pb-8">
                  {!ready && showingPopular ? (
                    <p className="font-body text-sm text-muted">Loading search index…</p>
                  ) : list.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                      <GraduationCap className="h-10 w-10 text-border" />
                      <p className="font-display text-lg font-extrabold text-primary">
                        No matches found
                      </p>
                      <p className="max-w-sm font-body text-sm text-muted">
                        Try a college name, city, country, or blog topic.
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          goTo(
                            `/?q=${encodeURIComponent(query.trim())}#universities`
                          )
                        }
                        className="mt-2 font-body text-sm font-bold text-accent-deep hover:underline"
                      >
                        Browse college explorer →
                      </button>
                    </div>
                  ) : (
                    <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-3">
                      {list.map((item, i) => {
                        const active = i === activeIndex && !showingPopular;
                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              onMouseEnter={() => setActiveIndex(i)}
                              onClick={() => goTo(item.href)}
                              className={`flex w-full items-center gap-3 rounded-[12px] border bg-white px-3.5 py-3.5 text-left transition-colors sm:px-4 ${
                                active
                                  ? "border-accent shadow-[0_6px_20px_rgba(21,128,61,0.12)]"
                                  : "border-border hover:border-accent/50"
                              }`}
                            >
                              <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                              <span className="min-w-0 flex-1">
                                <span className="block truncate font-body text-sm font-bold text-primary">
                                  {item.title}
                                </span>
                                <span className="mt-0.5 block truncate font-body text-xs text-muted">
                                  {KIND_META[item.kind].label}
                                  {item.subtitle ? ` · ${item.subtitle}` : ""}
                                </span>
                              </span>
                              {(showingPopular || item.trending) && (
                                <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 font-body text-[10px] font-extrabold text-white">
                                  Trending
                                </span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {query.trim() && results.length > 0 ? (
                  <div className="shrink-0 border-t border-border pt-3">
                    <button
                      type="button"
                      onClick={() =>
                        goTo(
                          `/?q=${encodeURIComponent(query.trim())}#universities`
                        )
                      }
                      className="inline-flex items-center gap-1.5 font-body text-sm font-bold text-accent-deep hover:underline"
                    >
                      See all matches for “{query.trim()}”
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {/* Hero trigger — opens full overlay */}
      <div className="w-full max-w-2xl px-0 sm:px-0">
        <button
          type="button"
          onClick={openOverlay}
          className="group flex w-full items-center gap-3 rounded-[18px] border border-white/25 bg-white px-3.5 py-3 text-left shadow-[0_14px_40px_rgba(0,0,0,0.22)] transition-transform active:scale-[0.99] hover:-translate-y-0.5 sm:gap-4 sm:rounded-[20px] sm:px-4 sm:py-3.5"
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-accent/10 text-accent-deep sm:h-11 sm:w-11">
            <Search className="h-5 w-5" strokeWidth={2.25} />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate font-body text-[13px] font-semibold text-primary sm:text-[15px]">
              Search colleges, cities, blogs…
            </span>
            <span className="mt-0.5 block truncate font-body text-[11px] text-muted sm:text-xs">
              Tap to explore pathways & campuses
            </span>
          </span>

          <span className="inline-flex h-10 shrink-0 items-center justify-center rounded-[12px] bg-accent px-3.5 font-body text-[12px] font-extrabold text-white shadow-[0_6px_16px_rgba(21,128,61,0.28)] transition-colors group-hover:bg-accent-deep sm:h-11 sm:gap-1.5 sm:px-5 sm:text-sm">
            <span className="sm:hidden">Go</span>
            <span className="hidden sm:inline">Find</span>
            <ArrowRight className="hidden h-4 w-4 sm:block" />
          </span>

          {/* Hidden input keeps form semantics for a11y; click opens overlay */}
          <input
            ref={inputRef}
            type="search"
            readOnly
            tabIndex={-1}
            aria-hidden
            className="sr-only"
            value=""
          />
        </button>
      </div>
      {overlay}
    </>
  );
}
