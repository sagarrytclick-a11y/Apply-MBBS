import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { SITE_IDENTITY } from "@/app/config/site_identity";

interface Crumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  breadcrumbs?: Crumb[];
  children?: React.ReactNode;
  align?: "left" | "center";
  surface?: "primary" | "surface" | "white";
  /** Subtle square grid overlay (best on primary) */
  pattern?: "none" | "grid";
  image?: string;
  imageAlt?: string;
  imageSide?: "left" | "right";
  /** default = full media; sm = compact (e.g. country flag) */
  imageSize?: "default" | "sm";
}

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  children,
  align = "left",
  surface = "primary",
  pattern = "none",
  image,
  imageAlt = "",
  imageSide = "right",
  imageSize = "default",
}: PageHeroProps) {
  const isDark = surface === "primary";
  const alignCls = align === "center" ? "text-center items-center mx-auto" : "text-left items-start";
  const imageFirst = Boolean(image) && imageSide === "left";
  const compact = imageSize === "sm";

  const wrap =
    surface === "primary"
      ? "bg-primary text-white"
      : surface === "surface"
        ? "bg-surface border-b border-border"
        : "bg-background border-b border-border";

  const media = image ? (
    <div
      className={`relative ${imageFirst ? "order-first" : ""} ${
        compact ? "lg:col-span-4" : "lg:col-span-6"
      }`}
    >
      <div
        className={`relative overflow-hidden rounded-[20px] border border-white/15 bg-white/5 shadow-[0_12px_32px_rgba(0,0,0,0.2)] ${
          compact
            ? "aspect-[3/2] max-w-[280px] sm:max-w-[320px] ml-auto mr-auto lg:mr-0"
            : "aspect-[4/3] sm:aspect-[5/4]"
        }`}
      >
        <Image
          src={image}
          alt={imageAlt || SITE_IDENTITY.name}
          fill
          className="object-cover"
          sizes={compact ? "320px" : "(max-width: 1024px) 100vw, 540px"}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/35 via-transparent to-transparent" />
      </div>
    </div>
  ) : null;

  const content = (
    <div
      className={`flex flex-col ${alignCls} ${
        image
          ? compact
            ? "lg:col-span-8 max-w-none"
            : "lg:col-span-6 max-w-none"
          : "max-w-3xl"
      }`}
    >
      {eyebrow && (
        <p
          className={`font-body text-[12px] sm:text-[13px] font-bold tracking-[0.14em] uppercase mb-3 ${
            isDark ? "text-accent" : "text-accent-deep"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h1
        className={`font-display text-[1.75rem] sm:text-4xl lg:text-[2.75rem] font-extrabold leading-[1.15] tracking-tight ${
          isDark ? "text-white" : "text-primary"
        }`}
      >
        {title}
      </h1>
      {description && (
        <p
          className={`mt-4 font-body text-sm sm:text-lg leading-relaxed max-w-2xl ${
            isDark ? "text-white/75" : "text-muted"
          } ${align === "center" ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      )}
      {children && <div className="mt-6 sm:mt-7 w-full">{children}</div>}
    </div>
  );

  return (
    <section
      className={`relative overflow-hidden ${wrap} ${
        pattern === "grid" ? "he-hero-grid" : ""
      }`}
    >
      <div className="he-container relative z-10 py-10 sm:py-12 lg:py-14">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className={`mb-5 flex flex-wrap items-center gap-1.5 font-body text-xs sm:text-sm ${
              isDark ? "text-white/60" : "text-muted"
            } ${align === "center" ? "justify-center" : ""}`}
          >
            {breadcrumbs.map((c, i) => (
              <React.Fragment key={`${c.label}-${i}`}>
                {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />}
                {c.href ? (
                  <Link
                    href={c.href}
                    className={`transition-colors ${
                      isDark ? "hover:text-accent" : "hover:text-primary"
                    }`}
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span className={isDark ? "text-white/90" : "text-text font-semibold"}>
                    {c.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div
          className={`grid items-center gap-8 lg:gap-12 ${
            image ? "lg:grid-cols-12" : ""
          }`}
        >
          {imageFirst ? (
            <>
              {media}
              {content}
            </>
          ) : (
            <>
              {content}
              {media}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default PageHero;
