import React from "react";
import { Search, RotateCcw } from "lucide-react";

export interface FilterSelectOption {
  value: string;
  label: string;
}

interface CollegeFilterBarProps {
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  selects: {
    id: string;
    label: string;
    value: string;
    options: FilterSelectOption[];
    onChange: (value: string) => void;
  }[];
  onReset?: () => void;
  resultCount?: number;
  className?: string;
}

const selectClass =
  "h-11 w-full min-w-[140px] appearance-none rounded-[12px] border border-border bg-surface px-3.5 pr-9 font-body text-sm text-text outline-none transition-colors focus:border-accent focus:bg-white";

export function CollegeFilterBar({
  search,
  onSearchChange,
  searchPlaceholder = "Search by college or city...",
  selects,
  onReset,
  resultCount,
  className = "",
}: CollegeFilterBarProps) {
  const hasActive =
    (search && search.trim().length > 0) ||
    selects.some((s) => s.value !== "" && s.value !== "all");

  return (
    <div
      className={
        className ||
        "mb-8 rounded-[16px] border border-border bg-white px-3 py-3 sm:px-4 shadow-[0_4px_20px_rgba(30,41,59,0.04)]"
      }
    >      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
        {onSearchChange && (
          <div className="relative w-full sm:min-w-[200px] sm:flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search ?? ""}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-11 w-full rounded-[12px] border border-border bg-surface pl-10 pr-4 font-body text-sm text-text outline-none transition-colors placeholder:text-muted/70 focus:border-accent focus:bg-white"
            />
          </div>
        )}

        {selects.map((select) => (
          <div key={select.id} className="relative w-full sm:w-[180px] sm:shrink-0">
            <label htmlFor={select.id} className="sr-only">
              {select.label}
            </label>
            <select
              id={select.id}
              value={select.value}
              onChange={(e) => select.onChange(e.target.value)}
              className={selectClass}
              aria-label={select.label}
            >
              {select.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted text-xs">
              ▾
            </span>
          </div>
        ))}

        {typeof resultCount === "number" && (
          <p className="w-full sm:w-auto whitespace-nowrap font-body text-sm text-muted px-1 py-1 sm:py-0">
            <span className="font-semibold text-primary">{resultCount}</span>{" "}
            {resultCount === 1 ? "result" : "results"}
          </p>
        )}

        {onReset && hasActive && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-11 w-full sm:w-auto sm:shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-[12px] border border-border bg-surface px-3.5 font-body text-sm font-semibold text-secondary transition-colors hover:border-primary/30 hover:text-primary"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

export default CollegeFilterBar;
