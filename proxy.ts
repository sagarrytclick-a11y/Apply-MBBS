import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/adminAuth";

const PUBLIC_ADMIN_API = new Set([
  "/api/admin/login",
  "/api/admin/logout",
  "/api/admin/session",
]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin UI — redirect unauthenticated users away from /admin pages
  // (login UI lives at /admin itself; allow it, block nested routes without session)
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const session = verifyAdminSessionToken(token);

    // Always allow /admin (login shell). Nested routes need a valid session.
    if (pathname !== "/admin" && pathname !== "/admin/" && !session.valid) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin";
      loginUrl.search = "";
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect admin APIs (except login / logout / session check)
  if (pathname.startsWith("/api/admin/")) {
    if (PUBLIC_ADMIN_API.has(pathname)) {
      return NextResponse.next();
    }

    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const session = verifyAdminSessionToken(token);
    if (!session.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
