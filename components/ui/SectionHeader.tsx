import React from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  const alignment =
    align === "center" ? "text-center mx-auto items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col max-w-3xl ${alignment} ${className}`}>
      {eyebrow && (
        <p className="font-body text-[13px] sm:text-sm font-semibold tracking-[0.04em] uppercase text-accent-deep mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-[1.65rem] sm:text-4xl lg:text-[2.65rem] font-extrabold leading-[1.2] tracking-tight text-primary">
        {title}
      </h2>
      {description && (
        <p className="mt-3 font-body text-sm sm:text-lg font-medium text-muted leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeader;
