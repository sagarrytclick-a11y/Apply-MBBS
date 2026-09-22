"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { indiaStates } from "@/lib/nav-mega-data";

type TickerItem = {
  prefix: string;
  bold: string;
  href: string;
};

const TICKER_ITEMS: TickerItem[] = indiaStates.flatMap((s) =>
  s.colleges.map((c) => ({
    prefix: s.name,
    bold: c.name,
    href: c.href,
  }))
);

// fallback if data empty (build-time safety)
const FALLBACK: TickerItem[] = [
  { prefix: "MBBS India", bold: "Explore colleges", href: "/colleges/mbbs-india" },
];

function TickerPill({ item }: { item: TickerItem }) {
  return (
    <Link
      href={item.href}
      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[13px] text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-primary"
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-accent-deep">
        <GraduationCap className="h-3 w-3" aria-hidden />
      </span>
      <span className="whitespace-nowrap">
        <span className="text-white/75">{item.prefix} · </span>
        <span className="font-semibold">{item.bold}</span>
      </span>
      <ArrowRight className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
    </Link>
  );
}

export default function BottomTicker() {
  const items = TICKER_ITEMS.length ? TICKER_ITEMS : FALLBACK;
  const loop = [...items, ...items];

  return (
    <div
      className="bottom-ticker fixed inset-x-0 bottom-0 z-[60] border-t border-white/10 bg-gradient-to-r from-primary via-[#14532d] to-primary"
      role="region"
      aria-label="MBBS India colleges — quick links"
    >
      <div className="bottom-ticker-track flex w-max items-center gap-3 pl-3">
        {loop.map((item, i) => (
          <TickerPill key={`${item.href}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}
