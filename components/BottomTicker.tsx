"use client";

import Link from "next/link";
import { ArrowRight, Send } from "lucide-react";

type TickerItem = {
  prefix: string;
  bold: string;
  href: string;
};

function collegeSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-");
}

const TICKER_ITEMS: TickerItem[] = [
  { prefix: "", bold: "MBBS Abroad", href: "/colleges/mbbs-abroad" },
  { prefix: "MBBS in", bold: "Russia", href: "/country/russia" },
  {
    prefix: "",
    bold: "Perm State Medical University",
    href: `/colleges/${collegeSlug("Perm State Medical University, Perm")}`,
  },
  { prefix: "MBBS in", bold: "Kazakhstan", href: "/country/kazakhstan" },
  {
    prefix: "",
    bold: "Astana Medical University",
    href: `/colleges/${collegeSlug("Astana Medical University")}`,
  },
  { prefix: "MBBS in", bold: "Georgia", href: "/country/georgia" },
  {
    prefix: "",
    bold: "BAU International University",
    href: `/colleges/${collegeSlug("BAU International University")}`,
  },
  { prefix: "MBBS in", bold: "Uzbekistan", href: "/country/uzbekistan" },
  {
    prefix: "",
    bold: "Andijan State Medical University",
    href: `/colleges/${collegeSlug("Andijan State Medical University")}`,
  },
  { prefix: "MBBS in", bold: "Bangladesh", href: "/country/bangladesh" },
  {
    prefix: "",
    bold: "Dhaka Medical College",
    href: `/colleges/${collegeSlug("Dhaka Medical College")}`,
  },
  { prefix: "MBBS in", bold: "Nepal", href: "/country/nepal" },
  {
    prefix: "",
    bold: "Institute of Medicine (IOM)",
    href: `/colleges/${collegeSlug("Institute of Medicine (IOM)")}`,
  },
  { prefix: "MBBS in", bold: "Tajikistan", href: "/country/tajikistan" },
  {
    prefix: "",
    bold: "Avicenna Tajik State Medical University",
    href: `/colleges/${collegeSlug("Avicenna Tajik State Medical University")}`,
  },
];

function TickerPill({ item }: { item: TickerItem }) {
  return (
    <Link
      href={item.href}
      className="inline-flex shrink-0 items-center gap-2 rounded-md border border-white/25 bg-white/15 px-2.5 py-1 text-[13px] text-white transition-colors hover:bg-white/25"
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[#14532d]">
        <Send className="h-2.5 w-2.5" aria-hidden />
      </span>
      <span className="whitespace-nowrap">
        {item.prefix ? <span className="text-white/80">{item.prefix} </span> : null}
        <span className="font-semibold">{item.bold}</span>
      </span>
      <ArrowRight className="h-3 w-3 shrink-0 text-white/80" aria-hidden />
    </Link>
  );
}

export default function BottomTicker() {
  const loop = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div
      className="bottom-ticker fixed inset-x-0 bottom-0 z-[60] bg-[#14532d]"
      role="region"
      aria-label="Quick MBBS abroad destination links"
    >
      <div className="bottom-ticker-track flex w-max items-center gap-3 pl-3">
        {loop.map((item, i) => (
          <TickerPill key={`${item.href}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}
