"use client";

import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  summary?: string;
  className?: string;
  /** Pages shown on each side of the current page */
  siblingCount?: number;
}

function getPageItems(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): Array<number | "ellipsis"> {
  if (totalPages <= 1) return [];

  const totalNumbers = siblingCount * 2 + 5; // first, last, current, 2 siblings, 2 ellipsis slots
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  const items: Array<number | "ellipsis"> = [];

  items.push(1);

  if (showLeftEllipsis) {
    items.push("ellipsis");
  } else {
    for (let p = 2; p < leftSibling; p++) items.push(p);
  }

  for (let p = leftSibling; p <= rightSibling; p++) {
    if (p !== 1 && p !== totalPages) items.push(p);
  }

  if (showRightEllipsis) {
    items.push("ellipsis");
  } else {
    for (let p = rightSibling + 1; p < totalPages; p++) items.push(p);
  }

  if (totalPages > 1) items.push(totalPages);

  return items;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  summary,
  className = "",
  siblingCount = 1,
}: PaginationProps) {
  const items = useMemo(
    () => getPageItems(currentPage, totalPages, siblingCount),
    [currentPage, totalPages, siblingCount]
  );

  if (totalPages <= 1) return null;

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  const btnBase =
    "flex h-10 min-w-10 items-center justify-center rounded-[12px] font-body text-sm font-semibold transition-all";

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className={`${btnBase} border border-border text-muted hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40`}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {items.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`e-${index}`}
              className="flex h-10 min-w-8 items-center justify-center font-body text-sm font-semibold text-muted"
              aria-hidden
            >
              …
            </span>
          ) : (
            <button
              type="button"
              key={item}
              onClick={() => goTo(item)}
              aria-current={currentPage === item ? "page" : undefined}
              className={`${btnBase} px-2 ${
                currentPage === item
                  ? "bg-primary text-white"
                  : "border border-border text-muted hover:bg-surface"
              }`}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className={`${btnBase} border border-border text-muted hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40`}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {summary && (
        <p className="mt-4 text-center font-body text-sm text-muted">{summary}</p>
      )}
    </div>
  );
}

export default Pagination;
