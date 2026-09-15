import React from "react";

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Base shimmer bone */
export function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={cx(
        "animate-pulse rounded-[10px] bg-border/70",
        className
      )}
      aria-hidden
    />
  );
}

/** Media card grid — college / blog listing */
export function CollegeGridSkeleton({
  count = 9,
  withHero = true,
}: {
  count?: number;
  withHero?: boolean;
}) {
  return (
    <div className="min-h-screen bg-surface">
      {withHero && (
        <div className="bg-primary">
          <div className="he-container py-12 sm:py-14">
            <Skeleton className="mb-3 h-3 w-24 bg-white/15" />
            <Skeleton className="mb-3 h-10 w-72 max-w-full bg-white/20" />
            <Skeleton className="h-4 w-full max-w-xl bg-white/10" />
            <div className="mt-6 flex flex-wrap gap-3">
              <Skeleton className="h-11 w-36 bg-white/15" />
              <Skeleton className="h-11 w-32 bg-white/10" />
            </div>
          </div>
        </div>
      )}

      <div className="he-section he-container">
        <div className="mb-8 rounded-[16px] border border-border bg-white p-3 sm:p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Skeleton className="h-11 w-full sm:flex-1" />
            <Skeleton className="h-11 w-full sm:w-44" />
            <Skeleton className="h-11 w-full sm:w-40" />
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="he-card overflow-hidden pointer-events-none hover:transform-none"
            >
              <Skeleton className="aspect-[16/10] rounded-none" />
              <div className="space-y-3 p-4 sm:p-5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex justify-between pt-1">
                  <Skeleton className="h-3 w-1/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** College / MD-MS detail slug page */
export function CollegeDetailSkeleton() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-primary">
        <div className="he-container py-10 sm:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6 space-y-4">
              <Skeleton className="h-3 w-24 bg-white/15" />
              <Skeleton className="h-10 w-full max-w-md bg-white/20" />
              <Skeleton className="h-4 w-full max-w-sm bg-white/10" />
              <div className="flex flex-wrap gap-2 pt-2">
                <Skeleton className="h-8 w-20 bg-white/15" />
                <Skeleton className="h-8 w-24 bg-white/15" />
                <Skeleton className="h-8 w-28 bg-white/15" />
              </div>
              <Skeleton className="mt-2 h-12 w-40 bg-white/20" />
            </div>
            <div className="lg:col-span-6">
              <Skeleton className="aspect-[4/3] w-full rounded-[20px] bg-white/10" />
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-[72px] z-40 border-b border-border bg-white">
        <div className="he-container flex gap-2 py-2.5 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 shrink-0" />
          ))}
        </div>
      </div>

      <div className="he-section he-container !pt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[20px] border border-border bg-white p-6 sm:p-8 space-y-4"
              >
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
                <div className="grid gap-4 pt-2 md:grid-cols-2">
                  <Skeleton className="h-32 w-full rounded-[16px]" />
                  <Skeleton className="h-32 w-full rounded-[16px]" />
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-4 space-y-5">
            <div className="rounded-[20px] border border-border bg-white overflow-hidden">
              <Skeleton className="h-40 w-full rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="mt-2 h-12 w-full" />
              </div>
            </div>
            <div className="rounded-[20px] border border-border bg-white p-5 space-y-3">
              <Skeleton className="h-5 w-36" />
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-[12px]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Country slug page */
export function CountryDetailSkeleton() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-primary">
        <div className="he-container py-10 sm:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-4">
              <Skeleton className="h-3 w-24 bg-white/15" />
              <Skeleton className="h-10 w-64 max-w-full bg-white/20" />
              <Skeleton className="h-4 w-full max-w-lg bg-white/10" />
              <div className="flex gap-3 pt-2">
                <Skeleton className="h-11 w-36 bg-white/15" />
                <Skeleton className="h-11 w-28 bg-white/10" />
              </div>
            </div>
            <div className="lg:col-span-4">
              <Skeleton className="aspect-[3/2] max-w-[280px] ml-auto rounded-[20px] bg-white/10" />
            </div>
          </div>
        </div>
      </div>

      <div className="he-section he-container">
        <div className="mb-8 space-y-3">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="he-card overflow-hidden pointer-events-none hover:transform-none"
            >
              <Skeleton className="h-52 w-full rounded-none" />
              <div className="space-y-3 p-6">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-5/6" />
                <Skeleton className="h-3.5 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Blog article slug */
export function BlogDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-white">
        <div className="he-container py-10 sm:py-14">
          <div className="mb-6 flex gap-2">
            <Skeleton className="h-3.5 w-12" />
            <Skeleton className="h-3.5 w-3" />
            <Skeleton className="h-3.5 w-10" />
            <Skeleton className="h-3.5 w-3" />
            <Skeleton className="h-3.5 w-32" />
          </div>
          <div className="mx-auto max-w-3xl space-y-4">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-10 w-full max-w-2xl" />
            <Skeleton className="h-10 w-3/4 max-w-xl" />
            <div className="flex flex-wrap gap-4 pt-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </div>

      <div className="he-section">
        <div className="he-container max-w-3xl space-y-5">
          <Skeleton className="aspect-[16/9] w-full rounded-[16px]" />
          <div className="space-y-3 rounded-[16px] border border-border bg-white p-6 sm:p-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton
                key={i}
                className={cx(
                  "h-4",
                  i % 3 === 0 ? "w-full" : i % 3 === 1 ? "w-11/12" : "w-4/5"
                )}
              />
            ))}
          </div>
          <div className="grid gap-4 pt-6 sm:grid-cols-3">
            <Skeleton className="h-40 w-full rounded-[16px]" />
            <Skeleton className="h-40 w-full rounded-[16px]" />
            <Skeleton className="h-40 w-full rounded-[16px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** MD/MS state page skeleton */
export function StateDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-primary">
        <div className="he-container py-12">
          <Skeleton className="mb-3 h-3 w-32 bg-white/15" />
          <Skeleton className="mb-3 h-10 w-72 max-w-full bg-white/20" />
          <Skeleton className="h-4 w-full max-w-xl bg-white/10" />
          <div className="mt-6 flex gap-4">
            <Skeleton className="h-16 w-36 bg-white/10" />
            <Skeleton className="h-16 w-36 bg-white/10" />
          </div>
        </div>
      </div>
      <div className="he-section he-container space-y-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="he-card overflow-hidden pointer-events-none hover:transform-none"
          >
            <div className="border-b border-border p-6 sm:p-8 space-y-3">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-4 w-80 max-w-full" />
            </div>
            <div className="space-y-0 p-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div
                  key={j}
                  className="flex items-center justify-between gap-4 border-b border-border px-6 py-5 last:border-0"
                >
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-5 w-24" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
