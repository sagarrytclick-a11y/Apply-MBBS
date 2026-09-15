import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/adminAuth";

export async function POST() {
  const response = NextResponse.json({ ok: true, authenticated: false });
  clearAdminSessionCookie(response);
  return response;
}
