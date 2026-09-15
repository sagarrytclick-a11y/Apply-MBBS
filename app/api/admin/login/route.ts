import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminCredentials,
  isAdminAuthConfigured,
  sessionCookieOptions,
} from "@/lib/adminAuth";
import { getClientIp } from "@/lib/security";

const MAX_ATTEMPTS = process.env.NODE_ENV === "production" ? 5 : 25;
const LOCK_MS =
  process.env.NODE_ENV === "production"
    ? 1000 * 60 * 10
    : 1000 * 60; // 1 min in dev
const attempts = new Map<string, { count: number; lockedUntil: number }>();

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminAuthConfigured()) {
      return NextResponse.json(
        { error: "Admin authentication is not configured." },
        { status: 503 }
      );
    }

    const clientKey = getClientIp(request);
    const record = attempts.get(clientKey);
    const now = Date.now();

    if (record?.lockedUntil && record.lockedUntil > now) {
      const minutes = Math.ceil((record.lockedUntil - now) / 60000);
      return NextResponse.json(
        { error: `Too many failed attempts. Try again in ${minutes} min.` },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((record.lockedUntil - now) / 1000)),
          },
        }
      );
    }

    const body = await request.json().catch(() => null);
    const username = String(body?.username || "")
      .trim()
      .toLowerCase()
      .slice(0, 64);
    const password = String(body?.password || "").slice(0, 128);

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    let creds: { username: string; password: string };
    try {
      creds = getAdminCredentials();
    } catch {
      return NextResponse.json(
        { error: "Admin authentication is not configured. Check .env values." },
        { status: 503 }
      );
    }

    const expectedUser = creds.username.trim().toLowerCase();
    const expectedPass = creds.password;

    const valid =
      safeEqual(username, expectedUser) && safeEqual(password, expectedPass);

    if (!valid) {
      const prev = attempts.get(clientKey) || { count: 0, lockedUntil: 0 };
      const count = prev.count + 1;
      const lockedUntil = count >= MAX_ATTEMPTS ? now + LOCK_MS : 0;
      attempts.set(clientKey, {
        count: lockedUntil ? 0 : count,
        lockedUntil,
      });

      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    attempts.delete(clientKey);

    const token = createAdminSessionToken(username);
    const response = NextResponse.json({
      ok: true,
      user: { username },
    });

    response.cookies.set(ADMIN_SESSION_COOKIE, token, sessionCookieOptions());
    return response;
  } catch (error) {
    console.error(
      "Admin login error:",
      error instanceof Error ? error.message : "unknown"
    );
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
