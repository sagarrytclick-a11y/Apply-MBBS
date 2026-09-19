import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { sendMail, parseEmailList } from "@/lib/mailer";
import {
  buildAdminEnquiryEmail,
  buildStudentConfirmationEmail,
} from "@/lib/enquiry-emails";
import {
  checkRateLimit,
  getClientIp,
  isValidEmail,
  normalizeIndianMobile,
  sanitizePlainText,
} from "@/lib/security";

const MAX_NAME = 80;
const MAX_COURSE = 120;
const MAX_NEET = 10;
const MAX_BODY_BYTES = 8_192;

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
    const adminCc = parseEmailList(process.env.ADMIN_CC);
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

    const smtpReady =
      process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim();

    if (smtpReady) {
      const submittedAt =
        enquiry.createdAt instanceof Date ? enquiry.createdAt : new Date();
      const enquiryPayload = {
        id: enquiry._id.toString(),
        name,
        email,
        mobile: mobile || undefined,
        courseInterest,
        neetScore: neetScore || undefined,
        submittedAt,
      };

      const subjectName = name.slice(0, 60);
      const subjectCourse = courseInterest.slice(0, 60);
      const dateStamp = submittedAt.toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      try {
        await sendMail({
          from: fromEmail,
          to: adminEmail,
          cc: adminCc.length ? adminCc : undefined,
          replyTo: email,
          subject: `New Enquiry · ${subjectName} · ${subjectCourse} · ${dateStamp}`,
          html: buildAdminEnquiryEmail(enquiryPayload),
        });
      } catch (err) {
        console.error(
          "Admin email failed:",
          err instanceof Error ? err.message : err
        );
      }

      try {
        await sendMail({
          from: fromEmail,
          to: email,
          subject: `Enquiry received · ${SITE_IDENTITY.name}`,
          html: buildStudentConfirmationEmail(enquiryPayload),
        });
      } catch (err) {
        console.error(
          "Student email failed:",
          err instanceof Error ? err.message : err
        );
      }
    } else {
      console.error(
        "SMTP_HOST/SMTP_USER/SMTP_PASS missing — enquiry saved, email skipped"
      );
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
