import { ImageResponse } from "next/og";
import { SITE_IDENTITY } from "@/app/config/site_identity";

export const runtime = "edge";
export const alt = `${SITE_IDENTITY.name} — ${SITE_IDENTITY.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background:
            "linear-gradient(135deg, #0f172a 0%, #14532d 55%, #15803d 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#86efac",
          }}
        >
          MBBS · Abroad · MD/MS · NEET
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05 }}>
            {SITE_IDENTITY.name}
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 500,
              color: "rgba(255,255,255,0.88)",
              maxWidth: 900,
            }}
          >
            {SITE_IDENTITY.tagline}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "rgba(255,255,255,0.75)" }}>
          {SITE_IDENTITY.domain}
        </div>
      </div>
    ),
    { ...size }
  );
}
