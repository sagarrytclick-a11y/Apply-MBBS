import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import connectDB from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import {
  checkRateLimit,
  escapeHtml,
  getClientIp,
  isValidEmail,
  normalizeIndianMobile,
  sanitizePlainText,
} from "@/lib/security";

const MAX_NAME = 80;
const MAX_COURSE = 120;
const MAX_NEET = 10;
const MAX_BODY_BYTES = 8_192;

function getResend() {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

export async function POST(request: NextRequest) {
  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }

    const ip = getClientIp(request);
    const ipLimit = checkRateLimit(`lead:ip:${ip}`, 8, 60 * 60 * 1000);
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(ipLimit.retryAfterSec) },
        }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Honeypot — bots fill hidden fields; humans leave empty.
    // Do NOT name this "website" — browsers/password managers autofill it.
    const honeypot = sanitizePlainText(
      (body as { company_url_hp?: string }).company_url_hp ??
        (body as { website?: string }).website ??
        (body as { company?: string }).company,
      100
    );
    if (honeypot) {
      console.warn("Lead honeypot triggered — skipping save");
      return NextResponse.json(
        {
          success: true,
          message:
            "Your enquiry has been submitted successfully! Our team will contact you soon.",
        },
        { status: 200 }
      );
    }

    const name = sanitizePlainText((body as { name?: string }).name, MAX_NAME);
    const email = sanitizePlainText(
      (body as { email?: string }).email,
      254
    ).toLowerCase();
    const mobileRaw = sanitizePlainText((body as { mobile?: string }).mobile, 20);
    const courseInterest = sanitizePlainText(
      (body as { courseInterest?: string }).courseInterest,
      MAX_COURSE
    );
    const neetScoreRaw = sanitizePlainText(
      (body as { neetScore?: string }).neetScore,
      MAX_NEET
    );

    if (!name || !email || !courseInterest) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: name, email, and course interest are required",
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const emailLimit = checkRateLimit(`lead:email:${email}`, 3, 60 * 60 * 1000);
    if (!emailLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests for this email. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(emailLimit.retryAfterSec) },
        }
      );
    }

    let mobile = "";
    if (mobileRaw) {
      const normalized = normalizeIndianMobile(mobileRaw);
      if (!normalized) {
        return NextResponse.json(
          { error: "Enter a valid 10-digit mobile number" },
          { status: 400 }
        );
      }
      mobile = normalized;
    }

    let neetScore = "";
    if (neetScoreRaw) {
      if (!/^\d{1,3}$/.test(neetScoreRaw)) {
        return NextResponse.json(
          { error: "NEET score must be a number between 0 and 720" },
          { status: 400 }
        );
      }
      const score = Number(neetScoreRaw);
      if (score < 0 || score > 720) {
        return NextResponse.json(
          { error: "NEET score must be a number between 0 and 720" },
          { status: 400 }
        );
      }
      neetScore = String(score);
    }

    // Always persist the lead first — email is best-effort
    await connectDB();

    const enquiry = new Enquiry({
      name,
      email,
      mobile: mobile || undefined,
      courseInterest,
      neetScore: neetScore || undefined,
    });
    await enquiry.save();

    const adminEmail = process.env.ADMIN_EMAIL?.trim();
    const fromEmail = process.env.FROM_EMAIL?.trim();
    if (!adminEmail || !fromEmail) {
      console.error("ADMIN_EMAIL/FROM_EMAIL missing — enquiry saved, email skipped");
      return NextResponse.json(
        {
          success: true,
          message:
            "Your enquiry has been submitted successfully! Our team will contact you soon.",
          id: enquiry._id.toString(),
        },
        { status: 200 }
      );
    }

    const resend = getResend();
    if (resend) {
      const safeName = escapeHtml(name);
      const safeEmail = escapeHtml(email);
      const safeMobile = mobile ? escapeHtml(mobile) : "";
      const safeCourse = escapeHtml(
        courseInterest
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l: string) => l.toUpperCase())
      );
      const safeNeet = neetScore ? escapeHtml(neetScore) : "";
      const safePhone = escapeHtml(
        process.env.ADMIN_PHONE?.trim() || SITE_IDENTITY.contact.phone
      );
      const submittedAt = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const emailContent = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f4f7fc;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fc;padding:30px 10px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.08);">
            <tr>
              <td style="background:linear-gradient(135deg,#0F172A,#15803D);padding:32px 36px;text-align:center;">
                <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">New Admission Inquiry</h1>
                <p style="margin:6px 0 0;font-size:14px;color:#bfdbfe;">${submittedAt}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 36px 8px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:14px 18px;background:#f8fafc;border-radius:12px;border-left:4px solid #15803D;">
                      <table width="100%" cellpadding="6" cellspacing="0">
                        <tr><td style="font-size:14px;color:#64748b;padding:4px 0;width:110px;">Name</td><td style="font-size:14px;font-weight:600;color:#0f172a;padding:4px 0;">${safeName}</td></tr>
                        <tr><td style="font-size:14px;color:#64748b;padding:4px 0;width:110px;">Email</td><td style="font-size:14px;font-weight:600;color:#0f172a;padding:4px 0;"><a href="mailto:${safeEmail}" style="color:#15803D;text-decoration:none;">${safeEmail}</a></td></tr>
                        <tr><td style="font-size:14px;color:#64748b;padding:4px 0;width:110px;">Mobile</td><td style="font-size:14px;font-weight:600;color:#0f172a;padding:4px 0;">${safeMobile || '<span style="color:#94a3b8;">Not provided</span>'}</td></tr>
                        <tr><td style="font-size:14px;color:#64748b;padding:4px 0;width:110px;">Course</td><td style="font-size:14px;font-weight:600;color:#0f172a;padding:4px 0;">${safeCourse}</td></tr>
                        <tr><td style="font-size:14px;color:#64748b;padding:4px 0;width:110px;">NEET Score</td><td style="font-size:14px;font-weight:600;color:#0f172a;padding:4px 0;">${safeNeet || '<span style="color:#94a3b8;">Not provided</span>'}</td></tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 36px 32px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background:#0F172A;border-radius:12px;padding:20px 24px;text-align:center;">
                      <p style="margin:0 0 12px;font-size:14px;color:#94a3b8;line-height:1.5;">This inquiry was submitted from the Apply MBBS admission portal. Please contact the student as soon as possible.</p>
                      <a href="mailto:${safeEmail}" style="display:inline-block;background:#15803D;color:#ffffff;padding:10px 24px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;">Reply to ${safeName}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background:#f8fafc;padding:20px 36px;text-align:center;border-top:1px solid #e2e8f0;">
                <p style="margin:0;font-size:12px;color:#94a3b8;">This is an automated notification from <strong style="color:#0f172a;">Apply MBBS</strong></p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>`;

      const confirmationContent = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f4f7fc;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fc;padding:30px 10px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.08);">
            <tr>
              <td style="background:linear-gradient(135deg,#0F172A,#15803D);padding:32px 36px;text-align:center;">
                <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">Inquiry Received!</h1>
                <p style="margin:6px 0 0;font-size:14px;color:#bfdbfe;">Apply MBBS</p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 36px;">
                <p style="font-size:16px;color:#0f172a;line-height:1.6;margin:0 0 6px;">Dear <strong style="color:#15803D;">${safeName}</strong>,</p>
                <p style="font-size:15px;color:#334155;line-height:1.7;margin:0 0 20px;">Thank you for your interest in <strong style="color:#0F172A;">${safeCourse}</strong>. We have received your inquiry and our admission team will contact you within <strong>24-48 hours</strong>.</p>
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                  <tr>
                    <td style="padding:18px 20px;background:#f8fafc;border-radius:12px;">
                      <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.5px;">What happens next</p>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr><td style="padding:5px 0;font-size:14px;color:#475569;">1. Our counselor reviews your profile</td></tr>
                        <tr><td style="padding:5px 0;font-size:14px;color:#475569;">2. We reach out via call / email</td></tr>
                        <tr><td style="padding:5px 0;font-size:14px;color:#475569;">3. Personalized college recommendations</td></tr>
                        <tr><td style="padding:5px 0;font-size:14px;color:#475569;">4. End-to-end admission support</td></tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background:linear-gradient(135deg,#0F172A,#15803D);border-radius:12px;padding:20px 24px;text-align:center;">
                      <p style="margin:0 0 4px;font-size:13px;color:#bfdbfe;">Need immediate assistance?</p>
                      <p style="margin:0;font-size:16px;font-weight:700;color:#22C55E;">${safePhone}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background:#f8fafc;padding:24px 36px;text-align:center;border-top:1px solid #e2e8f0;">
                <p style="margin:0 0 4px;font-size:13px;color:#475569;font-weight:600;">Apply MBBS</p>
                <p style="margin:0 0 12px;font-size:12px;color:#94a3b8;">${escapeHtml(SITE_IDENTITY.address.full)}</p>
                <a href="${SITE_IDENTITY.website}" style="display:inline-block;font-size:12px;color:#15803D;text-decoration:none;">${SITE_IDENTITY.domain}</a>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>`;

      const subjectName = name.slice(0, 60);
      const subjectCourse = courseInterest.slice(0, 60);
      const usingResendTestFrom = /@resend\.dev>?$/i.test(fromEmail);

      const adminResult = await resend.emails.send({
        from: fromEmail,
        to: [adminEmail],
        replyTo: email,
        subject: `New Admission Inquiry: ${subjectName} - ${subjectCourse}`,
        html: emailContent,
      });

      if (adminResult.error) {
        console.error(
          "Admin email failed:",
          adminResult.error.name,
          adminResult.error.message
        );
      }

      // onboarding@resend.dev can ONLY email the Resend account owner.
      // Skip student confirmation until a custom domain is verified.
      let studentOk = false;
      if (!usingResendTestFrom || email.toLowerCase() === adminEmail.toLowerCase()) {
        const studentResult = await resend.emails.send({
          from: fromEmail,
          to: [email],
          subject: `Your MBBS Admission Inquiry - ${SITE_IDENTITY.name}`,
          html: confirmationContent,
        });

        if (studentResult.error) {
          console.error(
            "Student email failed:",
            studentResult.error.name,
            studentResult.error.message
          );
        } else {
          studentOk = true;
        }
      } else {
        console.warn(
          "Skipped student confirmation email — verify a domain on Resend to email applicants (test from=resend.dev)."
        );
      }

      if (!adminResult.error) {
        // delivered
      } else if (!studentOk) {
        console.error(
          "Enquiry saved to DB but email delivery failed. Check ADMIN_EMAIL matches Resend account, or verify a domain."
        );
      }
    } else {
      console.error("RESEND_API_KEY missing — enquiry saved, email skipped");
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Your enquiry has been submitted successfully! Our team will contact you soon.",
        id: enquiry._id.toString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lead API error:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
