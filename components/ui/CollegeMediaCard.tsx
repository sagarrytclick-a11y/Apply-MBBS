"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";

export interface CollegeMediaCardProps {
  name: string;
  city: string;
  href: string;
  image?: string;
  type?: string;
  ranking?: string;
  fees?: string;
  fallbackImage?: string;
  /** Subtle visual tone — same card family, different accent vibe */
  tone?: "india" | "abroad" | "pg";
  priority?: boolean;
}

function rankingBadge(ranking?: string): string | null {
  if (!ranking) return null;
  const raw = ranking.trim();
  if (!raw) return null;

  const compact = raw.toUpperCase().replace(/[\s._-]+/g, "");
  if (
    ["N/A", "NA", "#NA", "#N/A", "NONE", "NIL", "NULL", "—", "–"].includes(
      compact
    )
  ) {
    return null;
  }

  const hash = raw.match(/#\s*(\d+)/);
  if (hash) return `#${hash[1]}`;

  const top = raw.match(/Top\s+(\d+)/i);
  if (top) return `Top ${top[1]}`;

  if (/^govt/i.test(raw) || /^government/i.test(raw)) return "Govt";
  if (/deemed/i.test(raw)) return "Deemed";
  if (/^nmc\b/i.test(raw)) return "NMC";
  if (/private/i.test(raw)) return "Private";
  if (/trust/i.test(raw)) return "Trust";
  if (/society/i.test(raw)) return "Society";
  if (/featured|premier|reputed|highly\s*rated/i.test(raw)) return "Featured";

  if (raw.length <= 12) return raw;
  return `${raw.slice(0, 10)}…`;
}

export function CollegeMediaCard({
  name,
  city,
  href,
  image,
  type,
  ranking,
  fees,
  fallbackImage = "/medical.webp",
  tone = "india",
  priority = false,
}: CollegeMediaCardProps) {
  const [src, setSrc] = useState(image || fallbackImage);
  const rankLabel = rankingBadge(ranking);

  const ring =
    tone === "abroad"
      ? "ring-accent/25 group-hover:ring-accent/45"
      : tone === "pg"
        ? "ring-primary/15 group-hover:ring-primary/30"
        : "ring-border group-hover:ring-accent/35";

  const badge =
    tone === "abroad"
      ? "bg-accent text-white"
      : tone === "pg"
        ? "bg-primary text-white"
        : "bg-white text-accent-deep ring-1 ring-accent/25";

  return (
    <Link
      href={href}
      className={`group flex h-full flex-col overflow-hidden rounded-[22px] border border-border bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)] ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(21,128,61,0.12)] ${ring}`}
    >
      <div className="relative mx-3 mt-3 overflow-hidden rounded-[18px] bg-surface">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={src}
            alt={`${name} — medical college`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            priority={priority}
            onError={() => {
              if (src !== fallbackImage) setSrc(fallbackImage);
            }}
          />
        </div>

        <span
          className={`absolute bottom-3 left-3 inline-flex max-w-[70%] items-center truncate rounded-full px-3 py-1.5 font-body text-[10px] font-bold uppercase tracking-wide shadow-[0_4px_14px_rgba(0,0,0,0.12)] ${badge}`}
        >
          {type || "College"}
        </span>

        {rankLabel ? (
          <span className="absolute right-3 top-3 inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-white/95 px-2.5 font-body text-[10px] font-extrabold text-primary shadow-sm ring-1 ring-black/5">
            {rankLabel}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5 sm:px-5 sm:pb-5">
        <h3 className="font-display text-[16px] font-extrabold leading-snug text-primary line-clamp-2 transition-colors group-hover:text-accent-deep sm:text-[17px]">
          {name}
        </h3>

        <p className="mt-2.5 inline-flex w-fit max-w-full items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 font-body text-xs font-semibold text-muted">
          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent-deep">
            <MapPin className="h-3 w-3" />
          </span>
          <span className="truncate">{city}</span>
        </p>

        {fees ? (
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/80 pt-3.5">
            <div className="min-w-0">
              <p className="font-body text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                Fees
              </p>
              <p className="truncate font-body text-sm font-bold text-text">
                {fees}
              </p>
            </div>
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-transform duration-300 group-hover:scale-110 group-hover:bg-accent-deep">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        ) : (
          <div className="mt-auto flex justify-end pt-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white transition-transform duration-300 group-hover:scale-110">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default CollegeMediaCard;
