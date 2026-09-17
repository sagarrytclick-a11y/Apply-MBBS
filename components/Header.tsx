"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
  Search,
  Phone,
  Mail,
  Target,
  GitCompareArrows,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import Logo from "./Logo";
import { Button } from "./ui/Button";
import { usePopup } from "../contexts/PopupContext";
import { usePathname } from "next/navigation";
import {
  abroadCountries,
  indiaStates,
  mdMsStates,
  type NavCollege,
} from "@/lib/nav-mega-data";
import { SITE_IDENTITY } from "@/app/config/site_identity";

type PanelKey = "india" | "abroad" | "mdms" | "resources" | null;

const pathways: {
  key: Exclude<PanelKey, null>;
  label: string;
  href: string;
}[] = [
  { key: "india", label: "MBBS India", href: "/colleges/mbbs-india" },
  { key: "abroad", label: "MBBS Abroad", href: "/colleges/mbbs-abroad" },
  { key: "mdms", label: "MD / MS", href: "/colleges/md-ms" },
];

function matchesQuery(c: NavCollege, q: string) {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return (
    c.name.toLowerCase().includes(needle) ||
    c.city.toLowerCase().includes(needle) ||
    c.type.toLowerCase().includes(needle)
  );
}

type CategoryItem = {
  id: string;
  label: string;
  meta?: string;
  href?: string;
  colleges: NavCollege[];
};

function ListWisePanel({
  categories,
  directoryHref,
  directoryLabel,
  emptyHint,
  itemPrefix,
}: {
  categories: CategoryItem[];
  directoryHref: string;
  directoryLabel: string;
  emptyHint: string;
  itemPrefix?: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(
    () => categories[0]?.id ?? null
  );
  const [query, setQuery] = useState("");

  const active =
    categories.find((c) => c.id === activeId) || categories[0] || null;

  const list = useMemo(() => {
    const q = query.trim();
    if (q && !active) {
      return categories
        .flatMap((c) => c.colleges)
        .filter((c) => matchesQuery(c, q))
        .slice(0, 40);
    }
    if (!active) return [];
    return active.colleges.filter((c) => matchesQuery(c, q)).slice(0, 40);
  }, [active, categories, query]);

  const mid = Math.ceil(list.length / 2);
  const leftList = list.slice(0, mid);
  const rightList = list.slice(mid);

  const renderCollege = (c: NavCollege) => (
    <li key={`${c.id}-${c.href}`}>
      <Link
        href={c.href}
        prefetch={false}
        className="block rounded-[10px] px-2 py-2.5 transition-colors hover:bg-background"
      >
        <span className="block truncate font-body text-[13px] font-bold text-primary">
          {c.name}
        </span>
        <span className="mt-0.5 block truncate font-body text-[11px] text-muted">
          {c.city}
          {c.type ? ` · ${c.type}` : ""}
        </span>
      </Link>
    </li>
  );

  return (
    <div className="grid h-[420px] overflow-hidden rounded-[20px] border border-border bg-white shadow-[0_20px_50px_rgba(15,23,42,0.12)] grid-cols-[240px_1fr]">
      <div className="flex h-full min-h-0 flex-col border-r border-border bg-[#f8fafc] p-4">
        <p className="mb-3 shrink-0 font-body text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
          Select category
        </p>
        <ul className="custom-scrollbar min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
          {categories.map((item) => {
            const selected = active?.id === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveId(item.id);
                    setQuery("");
                  }}
                  className={`w-full rounded-[12px] px-3 py-2.5 text-left transition-colors ${
                    selected
                      ? "border-l-[3px] border-accent bg-accent/10 text-primary"
                      : "border-l-[3px] border-transparent text-text/80 hover:bg-white hover:text-primary"
                  }`}
                >
                  <span className="block truncate font-body text-[13px] font-semibold">
                    {itemPrefix ? `${itemPrefix} ${item.label}` : item.label}
                  </span>
                  {item.meta && (
                    <span
                      className={`mt-0.5 block font-body text-[11px] ${
                        selected ? "text-accent-deep" : "text-muted"
                      }`}
                    >
                      {item.meta}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex h-full min-h-0 flex-col p-4 sm:p-5">
        <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
          <p className="font-body text-[12px] font-bold uppercase tracking-[0.12em] text-accent-deep">
            Universities
            {active ? (
              <span className="ml-2 font-semibold normal-case tracking-normal text-muted">
                · {active.label}
              </span>
            ) : null}
          </p>
          <span className="rounded-full bg-accent/15 px-2.5 py-1 font-body text-[10px] font-extrabold uppercase tracking-wide text-accent-deep">
            {list.length} listed
          </span>
        </div>

        <label className="relative mb-3 block shrink-0">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search colleges..."
            className="h-11 w-full rounded-[12px] border border-border bg-white pl-10 pr-3 font-body text-sm text-primary outline-none transition-colors placeholder:text-muted focus:border-accent"
          />
        </label>

        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
          {!active && !query.trim() ? (
            <div className="flex h-full min-h-[140px] flex-col items-center justify-center px-4 text-center">
              <p className="max-w-xs font-body text-sm text-muted">{emptyHint}</p>
            </div>
          ) : list.length === 0 ? (
            <div className="flex h-full min-h-[140px] items-center justify-center">
              <p className="font-body text-sm text-muted">No colleges match that search.</p>
            </div>
          ) : (
            <div className="grid h-full grid-cols-2 gap-x-4">
              <ul className="divide-y divide-border/70 border-r border-border/70 pr-3">
                {leftList.map(renderCollege)}
              </ul>
              <ul className="divide-y divide-border/70 pl-1">
                {rightList.length > 0
                  ? rightList.map(renderCollege)
                  : (
                    <li className="px-2 py-3 font-body text-[12px] text-muted">
                      More campuses added regularly
                    </li>
                  )}
              </ul>
            </div>
          )}
        </div>

        <Link
          href={active?.href || directoryHref}
          className="mt-4 inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-[12px] bg-accent font-body text-[13px] font-extrabold uppercase tracking-[0.06em] text-white transition-colors hover:bg-accent-deep"
        >
          {active ? `Explore ${active.label}` : directoryLabel}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function IndiaPanel() {
  const categories: CategoryItem[] = indiaStates.map((s) => ({
    id: s.name,
    label: s.name,
    meta: `${s.colleges.length} colleges`,
    href: "/colleges/mbbs-india",
    colleges: s.colleges,
  }));

  return (
    <ListWisePanel
      categories={categories}
      directoryHref="/colleges/mbbs-india"
      directoryLabel="Open full India list"
      emptyHint="Select a state to see listed medical colleges."
    />
  );
}

function AbroadPanel() {
  const categories: CategoryItem[] = abroadCountries.map((c) => ({
    id: c.slug,
    label: c.name,
    meta: `${c.colleges.length} colleges`,
    href: c.href,
    colleges: c.colleges,
  }));

  return (
    <ListWisePanel
      categories={categories}
      directoryHref="/colleges/mbbs-abroad"
      directoryLabel="Open full abroad list"
      emptyHint="Select a country to see overseas universities."
      itemPrefix="Study in"
    />
  );
}

function MdMsPanel() {
  const categories: CategoryItem[] = mdMsStates.map((s) => ({
    id: s.slug,
    label: s.name,
    meta: `${s.count} colleges`,
    href: s.href,
    colleges: s.colleges,
  }));

  return (
    <ListWisePanel
      categories={categories}
      directoryHref="/colleges/md-ms"
      directoryLabel="Open full MD/MS list"
      emptyHint="Select a state to see MD / MS colleges."
    />
  );
}

const resourceLinks = [
  {
    href: "/neet-rank-predictor",
    title: "NEET Rank Predictor",
    desc: "Turn your score and category into an estimated AIR.",
    badge: "NEW",
  },
  {
    href: "/colleges/compare",
    title: "Compare Colleges",
    desc: "Side-by-side fees, seats, recognition, and rankings.",
    badge: "NEW",
  },
  {
    href: "/blog",
    title: "Latest Updates",
    desc: "Counselling roundups, cutoffs, and admission explainers.",
  },
  {
    href: "/about",
    title: "About us",
    desc: "How we support students and families through admissions.",
  },
  {
    href: "/contact",
    title: "Contact",
    desc: "Reach a counsellor at our Noida desk.",
  },
];

function ResourcesPanel() {
  const mid = Math.ceil(resourceLinks.length / 2);
  const left = resourceLinks.slice(0, mid);
  const right = resourceLinks.slice(mid);

  const renderResource = (item: (typeof resourceLinks)[number]) => {
    return (
      <li key={item.href}>
        <Link
          href={item.href}
          className="block rounded-[12px] px-2 py-3 transition-colors hover:bg-background"
        >
          <span className="flex items-center gap-2">
            <span className="font-body text-sm font-bold text-primary">{item.title}</span>
            {item.badge ? (
              <span className="rounded-full bg-accent px-2 py-0.5 font-body text-[9px] font-extrabold text-white">
                {item.badge}
              </span>
            ) : null}
          </span>
          <span className="mt-0.5 block font-body text-[12px] leading-relaxed text-muted">
            {item.desc}
          </span>
        </Link>
      </li>
    );
  };

  return (
    <div className="overflow-hidden rounded-[20px] border border-border bg-white p-4 shadow-[0_20px_50px_rgba(15,23,42,0.12)] sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-body text-[12px] font-bold uppercase tracking-[0.12em] text-accent-deep">
          Helpful links
        </p>
        <span className="rounded-full bg-accent/15 px-2.5 py-1 font-body text-[10px] font-extrabold uppercase tracking-wide text-accent-deep">
          Updates
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <ul className="divide-y divide-border/70 border-r border-border/70 pr-3">
          {left.map(renderResource)}
        </ul>
        <ul className="divide-y divide-border/70 pl-1">{right.map(renderResource)}</ul>
      </div>
    </div>
  );
}

export default function Header() {
  const { openPopup } = usePopup();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [panel, setPanel] = useState<PanelKey>(null);
  const [mobileSection, setMobileSection] = useState<PanelKey>(null);
  const [routeKey, setRouteKey] = useState(pathname);
  const rootRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (pathname !== routeKey) {
    setRouteKey(pathname);
    setMobileOpen(false);
    setPanel(null);
    setMobileSection(null);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanel(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [panel]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const openPanel = (key: Exclude<PanelKey, null>) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setPanel(key);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setPanel(null), 200);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const phonePrimary = SITE_IDENTITY.contact.phone.split(",")[0].trim();
  const phoneTel = phonePrimary.replace(/[^0-9+]/g, "");

  const navIdle =
    "text-text/75 hover:bg-accent/10 hover:text-accent-deep";
  const navActive = "bg-accent text-white hover:bg-accent-deep";

  return (
    <header
      ref={rootRef}
      className={`sticky top-0 z-50 w-full overflow-visible font-body transition-all duration-300 ${
        scrolled || panel
          ? "border-b border-border/70 bg-white/95 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-xl"
          : "border-b border-border/60 bg-white"
      }`}
    >
      <div className="hidden border-b border-white/10 bg-primary text-white sm:block">
        <div className="mx-auto flex h-10 max-w-[1360px] items-center justify-between gap-4 px-4 xl:px-6">
          <div className="flex min-w-0 items-center gap-4 lg:gap-6">
            <a
              href={`tel:${phoneTel}`}
              className="inline-flex items-center gap-1.5 font-body text-[12px] font-semibold text-white/90 transition-colors hover:text-white"
            >
              <Phone className="h-3 w-3 text-accent" />
              {phonePrimary}
            </a>
            <a
              href={`mailto:${SITE_IDENTITY.contact.email}`}
              className="inline-flex items-center gap-1.5 font-body text-[12px] font-semibold text-white/90 transition-colors hover:text-white"
            >
              <Mail className="h-3 w-3 text-accent" />
              {SITE_IDENTITY.contact.email}
            </a>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {[
              {
                href: SITE_IDENTITY.social.facebook,
                label: "Facebook",
                Icon: FaFacebookF,
              },
              {
                href: SITE_IDENTITY.social.instagram,
                label: "Instagram",
                Icon: FaInstagram,
              },
              {
                href: SITE_IDENTITY.social.youtube,
                label: "YouTube",
                Icon: FaYoutube,
              },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[11px] text-white transition-colors hover:bg-accent hover:text-white"
              >
                <item.Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-16 w-full max-w-[1360px] items-center gap-3 px-4 xl:h-[72px] xl:px-6">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center"
          aria-label={`${SITE_IDENTITY.name} home`}
        >
          <Logo className="h-12 w-auto object-contain sm:h-14 xl:h-[60px]" />
        </Link>

        <nav className="hidden min-[1180px]:flex flex-1 items-center justify-center gap-0.5">
          <Link
            href="/"
            onMouseEnter={scheduleClose}
            className={`rounded-[10px] px-2.5 py-1.5 text-[13px] font-bold whitespace-nowrap transition-colors ${
              isActive("/") && !panel ? navActive : navIdle
            }`}
          >
            Home
          </Link>

          {pathways.map((item) => {
            const open = panel === item.key;
            return (
              <div
                key={item.key}
                className="relative"
                onMouseEnter={() => openPanel(item.key)}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() =>
                    setPanel((v) => (v === item.key ? null : item.key))
                  }
                  className={`inline-flex items-center gap-1 rounded-[10px] px-2.5 py-1.5 text-[13px] font-bold whitespace-nowrap transition-colors ${
                    open || isActive(item.href) ? navActive : navIdle
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            );
          })}

          <div
            className="relative"
            onMouseEnter={() => openPanel("resources")}
            onMouseLeave={scheduleClose}
          >
            <button
              type="button"
              aria-expanded={panel === "resources"}
              onClick={() =>
                setPanel((v) => (v === "resources" ? null : "resources"))
              }
              className={`inline-flex items-center gap-1 rounded-[10px] px-2.5 py-1.5 text-[13px] font-bold whitespace-nowrap transition-colors ${
                panel === "resources" ||
                isActive("/blog") ||
                isActive("/about") ||
                isActive("/contact")
                  ? navActive
                  : navIdle
              }`}
            >
              Updates
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  panel === "resources" ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </nav>

        <div className="relative ml-auto hidden shrink-0 items-center gap-2 min-[1180px]:flex">
          <Link
            href="/colleges/compare"
            onMouseEnter={scheduleClose}
            aria-label="Compare Colleges"
            className={`group relative z-[1] inline-flex h-10 items-center gap-2 overflow-hidden rounded-[12px] px-3.5 font-body text-[13px] font-bold transition-all hover:-translate-y-0.5 ${
              isActive("/colleges/compare")
                ? "bg-gradient-to-r from-accent to-accent-deep text-white shadow-[0_4px_14px_rgba(21,128,61,0.35)]"
                : "border border-border bg-surface text-primary hover:border-accent/40 hover:bg-accent/10 hover:text-accent-deep"
            }`}
          >
            <span
              className={`relative inline-flex h-7 w-7 items-center justify-center rounded-[9px] transition-colors ${
                isActive("/colleges/compare")
                  ? "bg-white/20 ring-1 ring-white/30"
                  : "bg-primary/5 text-accent group-hover:bg-accent group-hover:text-white"
              }`}
            >
              <GitCompareArrows className="h-3.5 w-3.5" strokeWidth={2.4} />
            </span>
            <span className="relative whitespace-nowrap">Compare</span>
          </Link>

          <Link
            href="/neet-rank-predictor"
            onMouseEnter={scheduleClose}
            aria-label="NEET Rank Predictor"
            className={`group relative z-[1] inline-flex h-10 items-center gap-2 overflow-hidden rounded-[12px] px-3.5 font-body text-[13px] font-bold transition-all hover:-translate-y-0.5 ${
              isActive("/neet-rank-predictor")
                ? "bg-gradient-to-r from-accent to-accent-deep text-white shadow-[0_4px_14px_rgba(21,128,61,0.35)]"
                : "border border-accent/30 bg-accent/10 text-accent-deep hover:border-accent/50 hover:bg-accent hover:text-white hover:shadow-[0_6px_16px_rgba(21,128,61,0.28)]"
            }`}
          >
            <span
              className={`relative inline-flex h-7 w-7 items-center justify-center rounded-[9px] transition-colors ${
                isActive("/neet-rank-predictor")
                  ? "bg-white/20 ring-1 ring-white/30"
                  : "bg-accent text-white group-hover:bg-white group-hover:text-accent"
              }`}
            >
              <Target className="h-3.5 w-3.5" strokeWidth={2.4} />
            </span>
            <span className="relative whitespace-nowrap">NEET Predictor</span>
          </Link>

          <div className="relative">
            <button
              type="button"
              onMouseEnter={scheduleClose}
              onClick={openPopup}
              className="relative z-[1] inline-flex h-10 items-center rounded-[12px] bg-accent px-5 font-body text-[13px] font-bold text-white shadow-[0_4px_14px_rgba(21,128,61,0.35)] transition-all hover:-translate-y-0.5 hover:bg-accent-deep"
            >
              Start Application
            </button>

            <button
              type="button"
              onMouseEnter={scheduleClose}
              onClick={openPopup}
              aria-label="Book a counselling call"
              className="enquiry-hang absolute left-1/2 top-full z-[70] pt-1"
            >
            <span className="enquiry-hang-string mx-auto flex flex-col items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_0_1px_rgba(216,50,74,0.4)]" />
              <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_0_1px_rgba(216,50,74,0.4)]" />
              <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_0_1px_rgba(216,50,74,0.4)]" />
              <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_0_1px_rgba(216,50,74,0.4)]" />
            </span>
            <span className="enquiry-hang-tag relative mt-1 inline-flex min-w-[168px] items-center justify-center whitespace-nowrap rounded-[12px] bg-[#d8324a] px-5 py-3 font-body text-[12px] font-extrabold uppercase tracking-[0.08em] text-white shadow-[0_10px_24px_rgba(216,50,74,0.4)]">
              <span className="pointer-events-none absolute left-2 top-1.5 text-[10px] leading-none opacity-85">
                +
              </span>
              <span className="pointer-events-none absolute right-2 top-1.5 text-[10px] leading-none opacity-85">
                +
              </span>
              <span className="pointer-events-none absolute bottom-1.5 left-2 text-[10px] leading-none opacity-85">
                +
              </span>
              <span className="pointer-events-none absolute bottom-1.5 right-2 text-[10px] leading-none opacity-85">
                +
              </span>
              Get Guidance
            </span>
            </button>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 min-[1180px]:hidden">
          <Link
            href="/colleges/compare"
            onClick={() => {
              setMobileOpen(false);
              setPanel(null);
            }}
            aria-label="Compare Colleges"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-[10px] ${
              isActive("/colleges/compare")
                ? "bg-gradient-to-r from-accent to-accent-deep text-white shadow-[0_3px_10px_rgba(21,128,61,0.3)]"
                : "border border-border bg-surface text-primary"
            }`}
          >
            <GitCompareArrows className="h-4 w-4" strokeWidth={2.4} />
          </Link>
          <Link
            href="/neet-rank-predictor"
            onClick={() => {
              setMobileOpen(false);
              setPanel(null);
            }}
            aria-label="NEET Rank Predictor"
            className={`inline-flex h-10 items-center gap-1.5 rounded-[10px] px-2.5 font-body text-[12px] font-bold ${
              isActive("/neet-rank-predictor")
                ? "bg-gradient-to-r from-accent to-accent-deep text-white shadow-[0_3px_10px_rgba(21,128,61,0.3)]"
                : "border border-accent/30 bg-accent/10 text-accent-deep"
            }`}
          >
            <span
              className={`inline-flex h-6 w-6 items-center justify-center rounded-[7px] ${
                isActive("/neet-rank-predictor")
                  ? "bg-white/20"
                  : "bg-accent text-white"
              }`}
            >
              <Target className="h-3.5 w-3.5" strokeWidth={2.4} />
            </span>
            <span className="pr-0.5">NEET</span>
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-border text-text"
            onClick={() => {
              setPanel(null);
              setMobileOpen((v) => !v);
            }}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {panel && (
          <motion.div
            key={panel}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 top-full z-[60] hidden min-[1180px]:block"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <div className="he-container pb-4 pt-2">
              {panel === "india" && <IndiaPanel />}
              {panel === "abroad" && <AbroadPanel />}
              {panel === "mdms" && <MdMsPanel />}
              {panel === "resources" && <ResourcesPanel />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="max-h-[80vh] overflow-hidden overflow-y-auto border-t border-border bg-white min-[1180px]:hidden"
          >
            <div className="he-container space-y-1 py-4">
              <Link
                href="/"
                className={`block rounded-[12px] px-4 py-3 text-[15px] font-bold ${
                  isActive("/") ? "bg-accent text-white" : "text-text hover:bg-accent/10 hover:text-accent-deep"
                }`}
              >
                Home
              </Link>

              {pathways.map((item) => (
                <div key={item.key}>
                  <button
                    type="button"
                    onClick={() =>
                      setMobileSection((v) => (v === item.key ? null : item.key))
                    }
                    className={`flex w-full items-center justify-between rounded-[12px] px-4 py-3 text-[15px] font-bold ${
                      isActive(item.href) || mobileSection === item.key
                        ? "bg-accent text-white"
                        : "text-text hover:bg-accent/10 hover:text-accent-deep"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        mobileSection === item.key ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileSection === item.key && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-1 overflow-hidden pb-2 pl-4"
                      >
                        <Link
                          href={item.href}
                          className="block rounded-[10px] bg-surface px-4 py-2.5 text-sm font-bold text-primary"
                        >
                          View all
                        </Link>
                        {item.key === "india" &&
                          indiaStates.slice(0, 8).map((s) => (
                            <Link
                              key={s.name}
                              href="/colleges/mbbs-india"
                              className="block rounded-[10px] px-4 py-2 text-sm font-semibold text-muted"
                            >
                              {s.name}
                            </Link>
                          ))}
                        {item.key === "abroad" &&
                          abroadCountries.map((c) => (
                            <Link
                              key={c.slug}
                              href={c.href}
                              className="block rounded-[10px] px-4 py-2 text-sm font-semibold text-muted"
                            >
                              Study in {c.name}
                            </Link>
                          ))}
                        {item.key === "mdms" &&
                          mdMsStates.map((s) => (
                            <Link
                              key={s.slug}
                              href={s.href}
                              className="block rounded-[10px] px-4 py-2 text-sm font-semibold text-muted"
                            >
                              {s.name}
                            </Link>
                          ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <div>
                <button
                  type="button"
                  onClick={() =>
                    setMobileSection((v) => (v === "resources" ? null : "resources"))
                  }
                  className={`flex w-full items-center justify-between rounded-[12px] px-4 py-3 text-[15px] font-bold ${
                    mobileSection === "resources" ||
                    isActive("/blog") ||
                    isActive("/about") ||
                    isActive("/contact")
                      ? "bg-accent text-white"
                      : "text-text hover:bg-accent/10 hover:text-accent-deep"
                  }`}
                >
                  Latest Updates
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      mobileSection === "resources" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {mobileSection === "resources" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-1 overflow-hidden pb-2 pl-4"
                    >
                      {resourceLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block rounded-[10px] px-4 py-2 text-sm font-semibold text-muted"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-2 border-t border-border pt-3">
                <Link
                  href="/colleges/compare"
                  onClick={() => setMobileOpen(false)}
                  className="group flex w-full items-center gap-3 rounded-[14px] border border-border bg-surface px-4 py-3.5 text-left transition-colors hover:border-accent/40 hover:bg-accent/10"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-primary/5 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                    <GitCompareArrows className="h-5 w-5" strokeWidth={2.3} />
                  </span>
                  <span>
                    <span className="block font-body text-[15px] font-bold text-primary">
                      Compare Colleges
                    </span>
                    <span className="block font-body text-xs text-muted">
                      Fees, seats & rankings side by side
                    </span>
                  </span>
                </Link>
                <Link
                  href="/neet-rank-predictor"
                  onClick={() => setMobileOpen(false)}
                  className="group flex w-full items-center gap-3 rounded-[14px] border border-accent/25 bg-gradient-to-r from-accent/10 to-accent/5 px-4 py-3.5 text-left transition-colors hover:border-accent/40 hover:from-accent hover:to-accent-deep hover:text-white"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-accent text-white shadow-[0_4px_12px_rgba(21,128,61,0.28)] transition-colors group-hover:bg-white group-hover:text-accent">
                    <Target className="h-5 w-5" strokeWidth={2.3} />
                  </span>
                  <span>
                    <span className="block font-body text-[15px] font-bold text-inherit">
                      NEET Rank Predictor
                    </span>
                    <span className="block font-body text-xs text-muted group-hover:text-white/80">
                      Estimate rank from your score
                    </span>
                  </span>
                </Link>
                <a
                  href={`tel:${phoneTel}`}
                  className="flex items-center gap-2 rounded-[10px] px-4 py-2 font-body text-sm font-semibold text-primary"
                >
                  <Phone className="h-4 w-4 text-accent" />
                  {phonePrimary}
                </a>
                <a
                  href={`mailto:${SITE_IDENTITY.contact.email}`}
                  className="flex items-center gap-2 rounded-[10px] px-4 py-2 font-body text-sm font-semibold text-primary"
                >
                  <Mail className="h-4 w-4 text-accent" />
                  {SITE_IDENTITY.contact.email}
                </a>
                <Button onClick={openPopup} className="w-full" size="lg" variant="primary">
                  Start Application
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
