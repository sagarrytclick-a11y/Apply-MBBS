"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import Logo from "./Logo";
import { usePopup } from "../contexts/PopupContext";
import { SITE_IDENTITY } from "../app/config/site_identity";

const pathways = [
  { name: "MBBS India", href: "/colleges/mbbs-india" },
  { name: "MBBS Abroad", href: "/colleges/mbbs-abroad" },
  { name: "MD / MS", href: "/colleges/md-ms" },
  { name: "NEET Predictor", href: "/neet-rank-predictor" },
  { name: "Contact", href: "/contact" },
];

const destinations = [
  { name: "Russia", href: "/country/russia" },
  { name: "Kazakhstan", href: "/country/kazakhstan" },
  { name: "Uzbekistan", href: "/country/uzbekistan" },
  { name: "Georgia", href: "/country/georgia" },
  { name: "Nepal", href: "/country/nepal" },
  { name: "Bangladesh", href: "/country/bangladesh" },
  { name: "Tajikistan", href: "/country/tajikistan" },
];

const company = [
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "FAQs", href: "/#faq" },
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
];

const social = [
  { label: "Instagram", href: SITE_IDENTITY.social.instagram, Icon: FaInstagram },
  { label: "Facebook", href: SITE_IDENTITY.social.facebook, Icon: FaFacebookF },
  { label: "LinkedIn", href: SITE_IDENTITY.social.linkedin, Icon: FaLinkedinIn },
  { label: "YouTube", href: SITE_IDENTITY.social.youtube, Icon: FaYoutube },
];

export default function Footer() {
  const { openPopup } = usePopup();
  const year = new Date().getFullYear();
  const phones = SITE_IDENTITY.contact.phone.split(",").map((p) => p.trim());
  const phoneTel = phones[0].replace(/[^0-9+]/g, "");

  return (
    <footer className="bg-[#0B1220] font-body text-white">
      <div className="border-b border-white/10 bg-accent">
        <div className="he-container flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-[15px] font-bold text-white sm:text-base">
            Want a realistic shortlist? Complimentary counselling is open.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openPopup}
              className="inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-white px-3.5 font-body text-sm font-bold text-accent"
            >
              Speak with us
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <a
              href={`tel:${phoneTel}`}
              className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-white/50 px-3.5 font-body text-sm font-bold text-white"
            >
              <Phone className="h-3.5 w-3.5" />
              Call
            </a>
          </div>
        </div>
      </div>

      <div className="he-container py-7 sm:py-8">
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
          <div className="lg:col-span-3">
            <Logo
              className="h-11 w-auto object-contain"
              imageWrapperClassName="inline-flex items-center overflow-hidden rounded-[10px] bg-white px-2 py-1.5"
            />
            <p className="mt-3 max-w-[240px] font-body text-[13px] leading-relaxed text-white/75">
              Guidance for MBBS in India and overseas, MD/MS routes, and NEET planning.
            </p>
            <div className="mt-3.5 flex gap-2">
              {social.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-accent-soft transition-colors hover:bg-accent hover:text-white"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-2.5 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-accent-soft">
              Pathways
            </h4>
            <ul className="space-y-1.5">
              {pathways.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-body text-[13px] text-white/85 transition-colors hover:text-white"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-2.5 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-accent-soft">
              Destinations
            </h4>
            <ul className="space-y-1.5">
              {destinations.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-body text-[13px] text-white/85 transition-colors hover:text-white"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-2.5 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-accent-soft">
              Company
            </h4>
            <ul className="space-y-1.5">
              {company.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-body text-[13px] text-white/85 transition-colors hover:text-white"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="mb-2.5 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-accent-soft">
              Offices & contact
            </h4>
            <ul className="space-y-3 font-body text-[13px] text-white/85">
              {SITE_IDENTITY.offices.map((office) => (
                <li key={office.id} className="flex gap-2">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-soft" />
                  <span className="leading-snug">
                    <span className="font-semibold text-white">{office.label}</span>
                    <span className="mt-0.5 block text-[12px] text-white/70">
                      {office.full}
                    </span>
                  </span>
                </li>
              ))}
              <li className="flex gap-2">
                <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-soft" />
                <a
                  href={`tel:${phoneTel}`}
                  className="font-semibold text-white hover:text-accent-soft"
                >
                  {phones.join(" · ")}
                </a>
              </li>
              <li className="flex gap-2">
                <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-soft" />
                <a
                  href={`mailto:${SITE_IDENTITY.contact.email}`}
                  className="break-all hover:text-accent-soft"
                >
                  {SITE_IDENTITY.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-[11px] text-white/55">
            © {year} {SITE_IDENTITY.name}. Admission counselling only — confirm fees and seats with official college sources.
          </p>
          <div className="flex gap-4 font-body text-[11px] text-white/55">
            <Link href="/privacy" className="hover:text-accent-soft">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-accent-soft">
              Terms
            </Link>
            <Link href="/sitemap" className="hover:text-accent-soft">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
