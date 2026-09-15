"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import {
  allNavColleges,
  pathwayOptions,
  type InterestOption,
} from "@/lib/nav-mega-data";

type Props = {
  value: string;
  onChange: (value: string, label: string) => void;
  className?: string;
  placeholder?: string;
};

function resolveLabel(value: string) {
  if (!value) return "";
  const fromPathway = pathwayOptions.find((o) => o.value === value);
  if (fromPathway) return fromPathway.label;
  const fromCollege = allNavColleges.find(
    (o) => o.value === value || o.label === value
  );
  if (fromCollege) return fromCollege.label;
  return value;
}

export function CourseInterestSelect({
  value,
  onChange,
  className = "",
  placeholder = "Search course or college…",
}: Props) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selectedLabel = resolveLabel(value);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pathways = pathwayOptions.filter(
      (o) =>
        !q ||
        o.label.toLowerCase().includes(q) ||
        o.value.toLowerCase().includes(q)
    );
    const colleges = (
      q
        ? allNavColleges.filter(
            (o) =>
              o.label.toLowerCase().includes(q) ||
              (o.meta || "").toLowerCase().includes(q)
          )
        : allNavColleges
    ).slice(0, q ? 12 : 8);
    return { pathways, colleges };
  }, [query]);

  const pick = (opt: InterestOption) => {
    onChange(opt.value, opt.label);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-full items-center justify-between gap-2 rounded-[12px] border border-border bg-surface px-4 text-left font-body text-sm text-text outline-none transition-colors focus:border-accent focus:bg-white"
      >
        <span className={selectedLabel ? "line-clamp-1" : "text-muted"}>
          {selectedLabel || "Select interest"}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 overflow-hidden rounded-[14px] border border-border bg-white shadow-[var(--shadow-lift)]"
        >
          <div className="border-b border-border p-2">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
              <input
                autoFocus
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-[10px] border border-border bg-surface py-2 pl-9 pr-3 font-body text-sm text-text outline-none placeholder:text-muted focus:border-primary/30 focus:bg-white"
              />
            </label>
          </div>

          <div className="max-h-[260px] overflow-y-auto p-1.5">
            {filtered.pathways.length > 0 && (
              <div className="mb-1">
                <p className="px-2.5 py-1.5 font-body text-[10px] font-bold uppercase tracking-[0.12em] text-accent-deep">
                  Pathways
                </p>
                {filtered.pathways.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={value === opt.value || value === opt.label}
                    onClick={() => pick(opt)}
                    className={`flex w-full rounded-[10px] px-2.5 py-2 text-left font-body text-sm font-semibold transition-colors ${
                      value === opt.value || value === opt.label
                        ? "bg-primary text-white"
                        : "text-text hover:bg-surface"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {filtered.colleges.length > 0 && (
              <div>
                <p className="px-2.5 py-1.5 font-body text-[10px] font-bold uppercase tracking-[0.12em] text-accent-deep">
                  Colleges
                </p>
                {filtered.colleges.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={value === opt.value || value === opt.label}
                    onClick={() => pick(opt)}
                    className={`flex w-full flex-col rounded-[10px] px-2.5 py-2 text-left transition-colors ${
                      value === opt.value || value === opt.label
                        ? "bg-primary text-white"
                        : "text-text hover:bg-surface"
                    }`}
                  >
                    <span className="font-body text-sm font-semibold line-clamp-1">
                      {opt.label}
                    </span>
                    {opt.meta && (
                      <span
                        className={`mt-0.5 font-body text-[11px] line-clamp-1 ${
                          value === opt.value || value === opt.label
                            ? "text-white/70"
                            : "text-muted"
                        }`}
                      >
                        {opt.meta}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {filtered.pathways.length === 0 && filtered.colleges.length === 0 && (
              <p className="px-2.5 py-4 text-center font-body text-sm text-muted">
                No matches found.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
