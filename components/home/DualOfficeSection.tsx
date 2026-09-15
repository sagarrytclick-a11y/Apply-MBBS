"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Clock,
  ExternalLink,
  MapPin,
  Navigation,
  Phone,
} from "lucide-react";
import { SITE_IDENTITY } from "@/app/config/site_identity";

export default function DualOfficeSection() {
  const offices = SITE_IDENTITY.offices;
  const [active, setActive] = useState<"noida" | "bhopal">(offices[0]?.id ?? "noida");
  const phones = SITE_IDENTITY.contact.phone.split(",").map((p) => p.trim());
  const phoneTel = phones[0].replace(/[^0-9+]/g, "");

  if (!offices.length) return null;

  return (
    <section id="offices" className="he-section scroll-mt-28 border-t border-border bg-surface">
      <div className="he-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.16em] text-accent-deep">
            Meet in person
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
            Two branches, one counselling desk
          </h2>
          <p className="mt-3 font-body text-sm leading-relaxed text-muted sm:text-[15px]">
            Drop by Noida or Bhopal for score review, shortlist planning, or a parent briefing in office hours.
          </p>
        </div>

        <div className="mx-auto mt-6 flex max-w-md gap-1.5 rounded-[12px] border border-border bg-white p-1">
          {offices.map((office) => (
            <button
              key={office.id}
              type="button"
              onClick={() => setActive(office.id)}
              className={`flex-1 rounded-[10px] px-3 py-2.5 font-body text-sm font-bold transition-colors ${
                active === office.id
                  ? "bg-accent text-white"
                  : "text-primary hover:bg-background"
              }`}
            >
              {office.city}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {offices.map((office, index) => {
            const isActive = active === office.id;
            const mapsUrl =
              office.id === "noida" && SITE_IDENTITY.contact.googleMapsUrl
                ? SITE_IDENTITY.contact.googleMapsUrl
                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.mapQuery)}`;

            return (
              <motion.article
                key={office.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                onMouseEnter={() => setActive(office.id)}
                className={`rounded-[16px] border bg-white p-5 transition-colors sm:p-6 ${
                  isActive
                    ? "border-accent/45 border-l-4 border-l-accent"
                    : "border-border border-l-4 border-l-transparent"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-accent/12 text-accent-deep">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-accent/10 px-2.5 py-1 font-body text-[11px] font-bold uppercase tracking-wide text-accent-deep">
                    {office.accent}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-xl font-extrabold text-primary sm:text-2xl">
                  {office.label}
                </h3>
                <p className="mt-1 font-body text-sm font-semibold text-accent-deep">
                  {office.city}, {office.state} {office.pincode}
                </p>

                <div className="mt-4 flex gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-deep" />
                  <p className="font-body text-sm leading-relaxed text-muted">{office.full}</p>
                </div>

                <ul className="mt-4 space-y-2 font-body text-sm text-muted">
                  <li className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-accent-deep" />
                    Mon–Sat · {SITE_IDENTITY.officeHours.mondayToSaturday}
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-accent-deep" />
                    <a
                      href={`tel:${phoneTel}`}
                      className="font-semibold text-primary hover:text-accent-deep"
                    >
                      {phones[0]}
                    </a>
                  </li>
                </ul>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-[12px] bg-accent font-body text-sm font-bold text-white transition-colors hover:bg-accent-deep"
                  >
                    <Navigation className="h-4 w-4" />
                    Open in Maps
                    <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                  </a>
                  <a
                    href={`tel:${phoneTel}`}
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-[12px] border border-border bg-white font-body text-sm font-bold text-primary hover:border-accent/40"
                  >
                    <Phone className="h-4 w-4 text-accent-deep" />
                    Call
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
