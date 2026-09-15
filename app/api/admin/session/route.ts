import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSessionFromCookies();

  const headers = {
    "Cache-Control": "no-store, no-cache, must-revalidate",
  };

  if (!session.valid) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401, headers }
    );
  }

  return NextResponse.json(
    {
      authenticated: true,
      user: { username: session.username },
    },
    { headers }
  );
}
