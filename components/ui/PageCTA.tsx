import React from "react";
import Link from "next/link";
import { Button } from "./Button";

interface PageCTAProps {
  title: React.ReactNode;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  onPrimaryClick?: () => void;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function PageCTA({
  title,
  description,
  primaryLabel = "Request counselling",
  primaryHref,
  onPrimaryClick,
  secondaryLabel,
  secondaryHref,
}: PageCTAProps) {
  return (
    <section className="he-section bg-primary">
      <div className="he-container text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight">
          {title}
        </h2>
        {description && (
          <p className="mt-3 mx-auto max-w-2xl font-body text-base text-white/75 leading-relaxed">
            {description}
          </p>
        )}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {onPrimaryClick ? (
            <Button onClick={onPrimaryClick} size="lg">
              {primaryLabel}
            </Button>
          ) : primaryHref ? (
            <Link href={primaryHref}>
              <Button size="lg">{primaryLabel}</Button>
            </Link>
          ) : null}
          {secondaryLabel && secondaryHref && (
            <Link href={secondaryHref}>
              <Button variant="secondary" size="lg">
                {secondaryLabel}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export default PageCTA;
