import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

let transporter: Transporter | null = null;
let transporterKey = "";

function requiredEnv(name: string): string | null {
  const value = process.env[name]?.trim();
  return value || null;
}

function smtpCredentials() {
  const host = requiredEnv("SMTP_HOST");
  const user = requiredEnv("SMTP_USER");
  // Gmail app passwords are often copied with spaces — strip them
  const pass = (process.env.SMTP_PASS || "").replace(/\s+/g, "").trim() || null;
  const port = Number(process.env.SMTP_PORT?.trim() || "587");
  const secure =
    process.env.SMTP_SECURE?.trim() === "true" || port === 465;
  return { host, user, pass, port, secure };
}

export function getMailTransporter(): Transporter | null {
  const { host, user, pass, port, secure } = smtpCredentials();
  if (!host || !user || !pass) return null;

  const key = `${host}|${port}|${secure}|${user}|${pass}`;
  if (transporter && transporterKey === key) return transporter;

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    requireTLS: !secure && port === 587,
    auth: { user, pass },
  });
  transporterKey = key;

  return transporter;
}

export async function sendMail(options: {
  from: string;
  to: string | string[];
  cc?: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const mailer = getMailTransporter();
  if (!mailer) {
    throw new Error("SMTP is not configured (SMTP_HOST / SMTP_USER / SMTP_PASS)");
  }

  const { user } = smtpCredentials();
  // Gmail rejects send if From address is not the logged-in mailbox (or its alias)
  const from = options.from;
  if (user && !from.toLowerCase().includes(user.toLowerCase())) {
    console.warn(
      `FROM_EMAIL (${from}) does not match SMTP_USER (${user}). Gmail may reject or rewrite the sender.`
    );
  }

  try {
    return await mailer.sendMail({
      from: options.from,
      to: options.to,
      cc: options.cc,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/Invalid login|BadCredentials|535/i.test(message)) {
      throw new Error(
        `Gmail login failed for SMTP_USER=${user}. Generate an App Password for THIS exact account (Google Account → Security → 2-Step Verification → App passwords), put it in SMTP_PASS with no spaces, and restart npm run dev.`
      );
    }
    throw err;
  }
}

/** Split comma/semicolon-separated emails from env */
export function parseEmailList(value?: string | null): string[] {
  if (!value?.trim()) return [];
  return value
    .split(/[,;]+/)
    .map((e) => e.trim())
    .filter((e) => e.length > 0 && e.includes("@"));
}
