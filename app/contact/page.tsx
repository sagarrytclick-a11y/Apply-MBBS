"use client";

import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  CircleAlert,
} from "lucide-react";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import PageHero from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { CourseInterestSelect } from "@/components/ui/CourseInterestSelect";
import DualOfficeSection from "@/components/home/DualOfficeSection";

const phonePrimary = SITE_IDENTITY.contact.phone.split(",")[0].trim();
const phoneTel = phonePrimary.replace(/[^0-9+]/g, "");

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "mbbs-abroad",
    neetScore: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const setService = (value: string, label: string) => {
    setFormData((prev) => ({
      ...prev,
      service: value.startsWith("college:") ? label : value,
    }));
    setErrors((prev) => ({ ...prev, service: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Please enter your name";
    if (!formData.email.trim()) errs.email = "Please enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Please enter a valid email";
    if (!formData.phone.trim()) errs.phone = "Please enter your phone number";
    else if (!/^[6-9]\d{9}$/.test(formData.phone))
      errs.phone = "Use a valid 10-digit Indian mobile number";
    if (
      formData.neetScore &&
      (Number(formData.neetScore) < 0 || Number(formData.neetScore) > 720)
    )
      errs.neetScore = "Score should be between 0 and 720";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("idle");
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        mobile: formData.phone,
        courseInterest: formData.service,
        neetScore: formData.neetScore,
        company_url_hp: honeypot,
      };
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "mbbs-abroad",
          neetScore: "",
        });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass = (hasError?: boolean) =>
    `w-full h-12 px-4 rounded-[12px] border font-body text-sm text-text outline-none transition-colors bg-surface ${
      hasError
        ? "border-error focus:border-error"
        : "border-border focus:border-accent focus:bg-white"
    }`;

  return (
    <div className="bg-background min-h-screen">
      <PageHero
        surface="surface"
        align="left"
        eyebrow="Contact"
        title={
          <>
            Reach our counselling desk —{" "}
            <span className="text-secondary">same-day follow-up</span>
          </>
        }
        description="Questions on MBBS in India or abroad? Leave your details for a call within 24 hours, or phone us directly."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <a href={`tel:${phoneTel}`}>
            <Button size="lg">
              <Phone className="h-4 w-4" />
              Call {phonePrimary}
            </Button>
          </a>
          <a href="#contact-form">
            <Button variant="secondary" size="lg">
              Send an enquiry
            </Button>
          </a>
        </div>
      </PageHero>

      {/* Compact contact strip — no card clutter */}
      <section className="border-y border-border bg-white">
        <div className="he-container py-5 sm:py-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-border">
            {[
              {
                icon: Phone,
                label: "Call",
                value: SITE_IDENTITY.contact.phone,
                href: `tel:${phoneTel}`,
              },
              {
                icon: Mail,
                label: "Email",
                value: SITE_IDENTITY.contact.email,
                href: `mailto:${SITE_IDENTITY.contact.email}`,
              },
              {
                icon: MapPin,
                label: "Offices",
                value: SITE_IDENTITY.offices.map((o) => o.city).join(" · "),
                href: "#offices",
              },
              {
                icon: Clock,
                label: "Hours",
                value: `Mon–Sat · ${SITE_IDENTITY.officeHours.mondayToSaturday}`,
                href: undefined,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              const body = (
                <div className={`flex items-start gap-3 ${i > 0 ? "lg:pl-5" : ""}`}>
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-accent/10 text-accent-deep">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                      {item.label}
                    </p>
                    <p className="mt-0.5 font-body text-sm font-semibold text-primary break-words">
                      {item.value}
                    </p>
                  </div>
                </div>
              );
              return item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="transition-opacity hover:opacity-80"
                >
                  {body}
                </a>
              ) : (
                <div key={item.label}>{body}</div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="he-section">
        <div className="he-container">
          <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
            <div
              id="contact-form"
              className="lg:col-span-7 lg:sticky lg:top-24 lg:self-start"
            >
              <div className="rounded-[20px] border border-border bg-white p-6 sm:p-8">
                <p className="mb-2 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-accent-deep">
                  Enquiry
                </p>
                <h2 className="font-display text-2xl font-extrabold text-primary sm:text-3xl">
                  Request counselling
                </h2>
                <p className="mt-2 font-body text-sm leading-relaxed text-muted">
                  Note your course interest and NEET marks — a counsellor will follow up soon.
                </p>

                {submitStatus === "success" && (
                  <div className="mt-6 flex items-center gap-3 rounded-[12px] border border-success/25 bg-success/10 px-4 py-3 font-body text-sm text-success">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Enquiry received. Our team will contact you shortly.
                  </div>
                )}
                {submitStatus === "error" && (
                  <div className="mt-6 rounded-[12px] border border-error/25 bg-error/10 px-4 py-3 font-body text-sm text-error">
                    Submission failed. Retry once, or call our office.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                  <div
                    aria-hidden="true"
                    className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
                  >
                    <label htmlFor="contact-company-url-hp">Company URL</label>
                    <input
                      id="contact-company-url-hp"
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
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block font-body text-sm font-semibold text-text">
                        Your name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="As on your documents"
                        className={fieldClass(!!errors.name)}
                      />
                      {errors.name && (
                        <p className="mt-1 flex items-center gap-1 font-body text-xs text-error">
                          <CircleAlert className="h-3 w-3" />
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1.5 block font-body text-sm font-semibold text-text">
                        Mobile number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit WhatsApp number"
                        className={fieldClass(!!errors.phone)}
                      />
                      {errors.phone && (
                        <p className="mt-1 flex items-center gap-1 font-body text-xs text-error">
                          <CircleAlert className="h-3 w-3" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block font-body text-sm font-semibold text-text">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className={fieldClass(!!errors.email)}
                    />
                    {errors.email && (
                      <p className="mt-1 flex items-center gap-1 font-body text-xs text-error">
                        <CircleAlert className="h-3 w-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="relative z-10">
                      <label className="mb-1.5 block font-body text-sm font-semibold text-text">
                        Course interest
                      </label>
                      <CourseInterestSelect
                        value={formData.service}
                        onChange={setService}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block font-body text-sm font-semibold text-text">
                        NEET marks{" "}
                        <span className="font-normal text-muted">(if available)</span>
                      </label>
                      <input
                        type="number"
                        name="neetScore"
                        min="0"
                        max="720"
                        value={formData.neetScore}
                        onChange={handleChange}
                        placeholder="Out of 720"
                        className={fieldClass(!!errors.neetScore)}
                      />
                      {errors.neetScore && (
                        <p className="mt-1 flex items-center gap-1 font-body text-xs text-error">
                          <CircleAlert className="h-3 w-3" />
                          {errors.neetScore}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="mt-2 w-full min-w-[200px] sm:w-auto"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Submit request
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            <div className="space-y-5 lg:col-span-5">
              <div className="rounded-[20px] border border-border border-l-4 border-l-accent bg-white p-6">
                <h3 className="font-display text-xl font-bold text-primary">
                  Want to speak now?
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-muted">
                  Call or email for a quick read on colleges, fee ranges, and counselling dates.
                </p>
                <div className="mt-5 space-y-3">
                  <a
                    href={`tel:${phoneTel}`}
                    className="flex items-center gap-3 rounded-[12px] border border-border bg-surface/60 px-4 py-3 transition-colors hover:border-accent/40 hover:bg-white"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-accent text-white">
                      <Phone className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-body text-xs text-muted">Phone</p>
                      <p className="font-body text-sm font-semibold text-primary">
                        {SITE_IDENTITY.contact.phone}
                      </p>
                    </div>
                  </a>
                  <a
                    href={`mailto:${SITE_IDENTITY.contact.email}`}
                    className="flex items-center gap-3 rounded-[12px] border border-border bg-surface/60 px-4 py-3 transition-colors hover:border-accent/40 hover:bg-white"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-accent/12 text-accent-deep">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-body text-xs text-muted">Email</p>
                      <p className="break-all font-body text-sm font-semibold text-primary">
                        {SITE_IDENTITY.contact.email}
                      </p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="rounded-[20px] border border-border bg-white p-5 sm:p-6">
                <h3 className="font-display text-lg font-bold text-primary">
                  What families ask us about
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {[
                    "India versus abroad seat comparisons",
                    "Fee, bond, and recognition clarity",
                    "Document prep and counselling rounds",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-deep" />
                      <span className="font-body text-sm text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                id="office-map"
                className="overflow-hidden rounded-[20px] border border-border bg-white"
              >
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-primary">
                    Visit our Noida office
                  </h3>
                  <p className="mt-1.5 font-body text-sm leading-relaxed text-muted">
                    {SITE_IDENTITY.address.full}
                  </p>
                </div>
                <div className="h-[220px] border-t border-border">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(SITE_IDENTITY.address.full)}&z=15&ie=UTF-8&output=embed`}
                    width="100%"
                    height="100%"
                    loading="lazy"
                    style={{ border: 0 }}
                    className="h-full w-full"
                    title="Noida office location map"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DualOfficeSection />
    </div>
  );
};

export default ContactPage;
