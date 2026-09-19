import { SITE_IDENTITY } from "@/app/config/site_identity";
import { escapeHtml } from "@/lib/security";

export type EnquiryEmailData = {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  courseInterest: string;
  neetScore?: string;
  submittedAt?: Date;
};

function formatCourse(course: string) {
  return course
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

function formatDateTimeIST(date: Date) {
  const datePart = date.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  return { datePart, timePart, full: `${datePart} · ${timePart} IST` };
}

function row(label: string, valueHtml: string) {
  return `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;width:38%;vertical-align:top;">
        <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;">${label}</p>
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;vertical-align:top;">
        <p style="margin:0;font-size:15px;font-weight:600;color:#0f172a;line-height:1.45;">${valueHtml}</p>
      </td>
    </tr>`;
}

function shell(opts: {
  title: string;
  subtitle: string;
  body: string;
  footerNote?: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Tahoma,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 40px rgba(15,23,42,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#0f172a 0%,#14532d 55%,#15803d 100%);padding:28px 32px;">
              <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#86efac;">${escapeHtml(SITE_IDENTITY.name)}</p>
              <h1 style="margin:0;font-size:24px;line-height:1.25;font-weight:800;color:#ffffff;">${escapeHtml(opts.title)}</h1>
              <p style="margin:10px 0 0;font-size:14px;color:#bbf7d0;">${opts.subtitle}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px;">
              ${opts.body}
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;padding:18px 32px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#0f172a;">${escapeHtml(SITE_IDENTITY.name)}</p>
              <p style="margin:0 0 8px;font-size:12px;color:#64748b;line-height:1.5;">${escapeHtml(SITE_IDENTITY.address.full)}</p>
              <p style="margin:0;font-size:12px;color:#94a3b8;">${opts.footerNote || "Automated message — please do not reply to this notification address if unused."}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildAdminEnquiryEmail(data: EnquiryEmailData) {
  const when = formatDateTimeIST(data.submittedAt || new Date());
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safeMobile = data.mobile ? escapeHtml(data.mobile) : "";
  const safeCourse = escapeHtml(formatCourse(data.courseInterest));
  const safeNeet = data.neetScore ? escapeHtml(data.neetScore) : "";
  const safeId = escapeHtml(data.id);
  const telHref = data.mobile
    ? `tel:+91${data.mobile.replace(/\D/g, "").slice(-10)}`
    : "";
  const waHref = data.mobile
    ? `https://wa.me/91${data.mobile.replace(/\D/g, "").slice(-10)}`
    : "";

  const body = `
    <p style="margin:0 0 18px;font-size:15px;color:#334155;line-height:1.6;">
      A new counselling enquiry was submitted on the website. Full form details are below.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;margin-bottom:20px;">
      <tr>
        <td colspan="2" style="padding:14px 16px;background:#f0fdf4;border-bottom:1px solid #e2e8f0;">
          <p style="margin:0;font-size:13px;font-weight:800;color:#166534;text-transform:uppercase;letter-spacing:0.08em;">Enquiry form details</p>
        </td>
      </tr>
      ${row("Enquiry ID", `<span style="font-family:ui-monospace,Menlo,monospace;font-size:13px;color:#475569;">#${safeId}</span>`)}
      ${row("Submitted date", escapeHtml(when.datePart))}
      ${row("Submitted time", escapeHtml(`${when.timePart} IST`))}
      ${row("Full name", safeName)}
      ${row("Email", `<a href="mailto:${safeEmail}" style="color:#15803d;text-decoration:none;font-weight:700;">${safeEmail}</a>`)}
      ${row(
        "Mobile",
        safeMobile
          ? `<a href="${telHref}" style="color:#0f172a;text-decoration:none;">+91 ${safeMobile}</a>`
          : `<span style="color:#94a3b8;">Not provided</span>`
      )}
      ${row("Course interest", safeCourse)}
      ${row(
        "NEET score",
        safeNeet
          ? `${safeNeet} <span style="color:#64748b;font-weight:500;">/ 720</span>`
          : `<span style="color:#94a3b8;">Not provided</span>`
      )}
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;">
      <tr>
        <td align="center" style="padding:4px;">
          <a href="mailto:${safeEmail}?subject=${encodeURIComponent(`Re: Your MBBS enquiry — ${data.name}`)}" style="display:inline-block;background:#15803d;color:#ffffff;padding:12px 22px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;margin:4px;">Reply by email</a>
          ${
            telHref
              ? `<a href="${telHref}" style="display:inline-block;background:#0f172a;color:#ffffff;padding:12px 22px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;margin:4px;">Call student</a>`
              : ""
          }
          ${
            waHref
              ? `<a href="${waHref}" style="display:inline-block;background:#16a34a;color:#ffffff;padding:12px 22px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;margin:4px;">WhatsApp</a>`
              : ""
          }
        </td>
      </tr>
    </table>

    <p style="margin:0 0 18px;font-size:13px;color:#64748b;line-height:1.5;text-align:center;">
      Please follow up within 24 hours for best conversion.
    </p>
  `;

  return shell({
    title: "New admission enquiry",
    subtitle: escapeHtml(when.full),
    body,
    footerNote: "Internal alert for counselling team · Apply MBBS",
  });
}

export function buildStudentConfirmationEmail(data: EnquiryEmailData) {
  const when = formatDateTimeIST(data.submittedAt || new Date());
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safeMobile = data.mobile ? escapeHtml(data.mobile) : "";
  const safeCourse = escapeHtml(formatCourse(data.courseInterest));
  const safeNeet = data.neetScore ? escapeHtml(data.neetScore) : "";
  const safePhone = escapeHtml(
    process.env.ADMIN_PHONE?.trim() || SITE_IDENTITY.contact.phone
  );
  const phoneTel = (
    process.env.ADMIN_PHONE?.trim() || SITE_IDENTITY.contact.phone
  ).replace(/[^0-9+]/g, "");

  const body = `
    <p style="margin:0 0 6px;font-size:16px;color:#0f172a;">Dear <strong style="color:#15803d;">${safeName}</strong>,</p>
    <p style="margin:0 0 20px;font-size:15px;color:#334155;line-height:1.7;">
      Thank you for contacting <strong>${escapeHtml(SITE_IDENTITY.name)}</strong>.
      We have received your enquiry and our counsellor will reach out within <strong>24–48 hours</strong>.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;margin-bottom:20px;">
      <tr>
        <td colspan="2" style="padding:14px 16px;background:#f8fafc;border-bottom:1px solid #e2e8f0;">
          <p style="margin:0;font-size:13px;font-weight:800;color:#0f172a;text-transform:uppercase;letter-spacing:0.08em;">Your submitted details</p>
        </td>
      </tr>
      ${row("Submitted on", escapeHtml(when.full))}
      ${row("Name", safeName)}
      ${row("Email", safeEmail)}
      ${row("Mobile", safeMobile ? `+91 ${safeMobile}` : `<span style="color:#94a3b8;">Not provided</span>`)}
      ${row("Course interest", safeCourse)}
      ${row(
        "NEET score",
        safeNeet
          ? `${safeNeet} / 720`
          : `<span style="color:#94a3b8;">Not provided</span>`
      )}
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
      <tr>
        <td style="background:linear-gradient(135deg,#0f172a,#15803d);border-radius:14px;padding:20px 22px;text-align:center;">
          <p style="margin:0 0 6px;font-size:13px;color:#bbf7d0;">Need help sooner?</p>
          <a href="tel:${escapeHtml(phoneTel)}" style="display:inline-block;font-size:18px;font-weight:800;color:#ffffff;text-decoration:none;">${safePhone}</a>
        </td>
      </tr>
    </table>
  `;

  return shell({
    title: "Enquiry received",
    subtitle: "We will contact you shortly",
    body,
    footerNote: `<a href="${SITE_IDENTITY.website}" style="color:#15803d;text-decoration:none;">${SITE_IDENTITY.domain}</a>`,
  });
}
