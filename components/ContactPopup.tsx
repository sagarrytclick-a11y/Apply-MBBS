"use client";

import React, { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  GraduationCap,
  Mail,
  Phone,
  User,
  X,
} from "lucide-react";
import { usePopup } from "../contexts/PopupContext";
import Logo from "./Logo";
import { SITE_IDENTITY } from "@/app/config/site_identity";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const getDigits = (value: string) => value.replace(/\D/g, "");

const isValidIndianMobile = (value: string) => {
  const digits = getDigits(value);
  if (/^[6-9]\d{9}$/.test(digits)) return true;
  if (/^0[6-9]\d{9}$/.test(digits)) return true;
  if (/^91[6-9]\d{9}$/.test(digits)) return true;
  return false;
};

const ContactPopup: React.FC = () => {
  const { isOpen, closePopup, formData, updateFormData, resetForm } = usePopup();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState("");

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    const name = formData.name.trim();
    const email = formData.email.trim();
    const mobile = formData.mobile.trim();

    if (!name) errs.name = "Name is required";
    if (!email) errs.email = "Email is required";
    else if (!EMAIL_REGEX.test(email)) errs.email = "Enter a valid email";
    if (!mobile) errs.mobile = "Mobile is required";
    else if (!isValidIndianMobile(mobile)) errs.mobile = "Enter a valid 10-digit mobile";
    if (!formData.courseInterest) errs.courseInterest = "Select a course";

    if (formData.neetScore.trim()) {
      const score = Number(formData.neetScore);
      if (!/^\d+$/.test(formData.neetScore.trim()) || score < 0 || score > 720) {
        errs.neetScore = "Score must be 0–720";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const digits = getDigits(formData.mobile);
      const mobile =
        digits.length === 12 && digits.startsWith("91")
          ? digits.slice(2)
          : digits.length === 11 && digits.startsWith("0")
            ? digits.slice(1)
            : digits;

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          mobile,
          courseInterest: formData.courseInterest,
          neetScore: formData.neetScore.trim()
            ? String(Number(formData.neetScore))
            : "",
          company_url_hp: honeypot,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setErrors({});
        setTimeout(() => {
          closePopup();
          resetForm();
          setSubmitStatus("idle");
        }, 1800);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const setField = (field: keyof typeof formData, value: string) => {
    let next = value;
    if (field === "mobile") next = value.replace(/[^\d+\s\-]/g, "").slice(0, 16);
    if (field === "neetScore") {
      next = value.replace(/\D/g, "").slice(0, 3);
      if (next && Number(next) > 720) next = "720";
    }
    if (field === "email") next = value.replace(/\s/g, "");
    updateFormData({ [field]: next });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  if (!isOpen) return null;

  const fieldShell = (hasError?: boolean) =>
    `flex h-12 items-center gap-3 rounded-[14px] border bg-white px-3.5 transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 ${
      hasError ? "border-error" : "border-accent/25"
    }`;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 font-body">
      <div
        className="absolute inset-0 bg-primary/45 backdrop-blur-[3px]"
        onClick={closePopup}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-popup-title"
        className="relative w-full max-w-[420px] overflow-hidden rounded-[28px] border border-border/70 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-accent/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-10 h-40 w-40 rounded-full bg-[var(--success)]/20 blur-3xl"
        />

        <button
          type="button"
          onClick={closePopup}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-muted transition-colors hover:border-primary hover:text-primary"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <form onSubmit={handleSubmit} noValidate className="relative px-6 pb-6 pt-7 sm:px-8 sm:pb-8 sm:pt-8">
          <div className="mb-5 flex flex-col items-center text-center">
            <Logo className="h-12 w-auto object-contain sm:h-14" />
            <h2
              id="contact-popup-title"
              className="mt-4 font-display text-[1.45rem] font-extrabold tracking-tight text-primary sm:text-[1.65rem]"
            >
              Let’s plan your admission
            </h2>
            <p className="mt-1.5 font-body text-sm text-muted">
              Complimentary counselling with {SITE_IDENTITY.name}
            </p>
          </div>

          <div
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
          >
            <label htmlFor="popup-company-url-hp">Company URL</label>
            <input
              id="popup-company-url-hp"
              type="text"
              name="company_url_hp"
              tabIndex={-1}
              autoComplete="off"
              data-lpignore="true"
              data-1p-ignore="true"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {submitStatus === "success" && (
            <div className="mb-3 rounded-[14px] border border-accent/30 bg-accent/10 px-3.5 py-2.5 text-center font-body text-sm font-semibold text-primary">
              Got it — our team will reach out shortly.
            </div>
          )}
          {submitStatus === "error" && (
            <div className="mb-3 rounded-[14px] border border-error/25 bg-error/10 px-3.5 py-2.5 text-center font-body text-sm text-error">
              Couldn’t send that. Please try once more.
            </div>
          )}

          <div className="space-y-3">
            <div>
              <div className={fieldShell(!!errors.name)}>
                <User className="h-4 w-4 shrink-0 text-accent" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="Enter Your Name *"
                  autoComplete="name"
                  className="h-full w-full bg-transparent font-body text-sm text-primary outline-none placeholder:text-muted/70"
                />
              </div>
              {errors.name && (
                <p className="mt-1 px-1 font-body text-xs text-error">{errors.name}</p>
              )}
            </div>

            <div>
              <div className={fieldShell(!!errors.email)}>
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="Enter Email Address *"
                  autoComplete="email"
                  className="h-full w-full bg-transparent font-body text-sm text-primary outline-none placeholder:text-muted/70"
                />
              </div>
              {errors.email && (
                <p className="mt-1 px-1 font-body text-xs text-error">{errors.email}</p>
              )}
            </div>

            <div>
              <div className={fieldShell(!!errors.mobile)}>
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                <span className="shrink-0 font-body text-sm font-semibold text-primary">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="tel"
                  value={formData.mobile}
                  onChange={(e) => setField("mobile", e.target.value)}
                  placeholder="Mobile Number *"
                  autoComplete="tel"
                  className="h-full w-full bg-transparent font-body text-sm text-primary outline-none placeholder:text-muted/70"
                />
              </div>
              {errors.mobile && (
                <p className="mt-1 px-1 font-body text-xs text-error">{errors.mobile}</p>
              )}
            </div>

            <div>
              <div className={`relative ${fieldShell(!!errors.courseInterest)}`}>
                <BookOpen className="h-4 w-4 shrink-0 text-accent" />
                <select
                  value={formData.courseInterest}
                  onChange={(e) => setField("courseInterest", e.target.value)}
                  className="h-full w-full appearance-none bg-transparent pr-6 font-body text-sm font-medium text-primary outline-none"
                >
                  <option value="">Select Your Course *</option>
                  <option value="mbbs-india">MBBS India</option>
                  <option value="mbbs-abroad">MBBS Abroad</option>
                  <option value="md-ms-bds">MD / MS / BDS</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 h-4 w-4 text-muted" />
              </div>
              {errors.courseInterest && (
                <p className="mt-1 px-1 font-body text-xs text-error">
                  {errors.courseInterest}
                </p>
              )}
            </div>

            <div>
              <div className={fieldShell(!!errors.neetScore)}>
                <GraduationCap className="h-4 w-4 shrink-0 text-accent" />
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.neetScore}
                  onChange={(e) => setField("neetScore", e.target.value)}
                  placeholder="NEET Score (optional)"
                  className="h-full w-full bg-transparent font-body text-sm text-primary outline-none placeholder:text-muted/70"
                />
              </div>
              {errors.neetScore && (
                <p className="mt-1 px-1 font-body text-xs text-error">
                  {errors.neetScore}
                </p>
              )}
            </div>
          </div>

          <p className="mt-4 text-center font-body text-[11px] leading-relaxed text-muted">
            By submitting, you agree to our{" "}
            <a href="/terms" className="font-semibold text-accent hover:text-accent-deep">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="font-semibold text-accent hover:text-accent-deep">
              Privacy Policy
            </a>
            .
          </p>

          <button
            type="submit"
            disabled={isSubmitting || submitStatus === "success"}
            className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-[14px] bg-accent font-body text-[15px] font-extrabold text-white shadow-[0_8px_24px_rgba(21,128,61,0.35)] transition-all hover:-translate-y-0.5 hover:bg-accent-deep disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-border disabled:text-muted disabled:shadow-none"
          >
            {isSubmitting
              ? "Sending..."
              : submitStatus === "success"
                ? "Received ✓"
                : "Book free counselling"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPopup;
