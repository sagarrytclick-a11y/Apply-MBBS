import React from "react";

/**
 * Neet Saathi mark — monochrome chat + AI spark.
 * Uses only currentColor so it works on green / white / dark backgrounds.
 */
export function NeetSaathiIcon({
  className = "h-5 w-5",
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}

      {/* Chat bubble */}
      <path
        d="M5.25 7A2.75 2.75 0 0 1 8 4.25h8A2.75 2.75 0 0 1 18.75 7v5.5A2.75 2.75 0 0 1 16 15.25h-5.85l-3.7 2.55a.6.6 0 0 1-.95-.49V7Z"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinejoin="round"
      />

      {/* Typing dots */}
      <circle cx="9.25" cy="9.75" r="1.05" fill="currentColor" />
      <circle cx="12" cy="9.75" r="1.05" fill="currentColor" />
      <circle cx="14.75" cy="9.75" r="1.05" fill="currentColor" />

      {/* AI spark */}
      <path
        d="M18.15 2.85 18.7 4.3l1.45.55-1.45.55-.55 1.45-.55-1.45L16.7 4.85l1.45-.55.55-1.45Z"
        fill="currentColor"
      />
      <path
        d="M20.9 5.35 21.2 6.1l.75.3-.75.3-.3.75-.3-.75-.75-.3.75-.3.3-.75Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default NeetSaathiIcon;
