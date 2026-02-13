import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { unsealData } from "iron-session";

const SESSION_PASSWORD = process.env.SESSION_SECRET || "skinfluencer-session-secret-min-32-chars-long";

async function getSessionFromCookie(request: NextRequest) {
  const cookie = request.cookies.get("skinfluencer_session")?.value;
  if (!cookie) return null;
  try {
    const session = await unsealData<{ userId?: string; role?: string }>(cookie, {
      password: SESSION_PASSWORD,
    });
    return session;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    const session = await getSessionFromCookie(request);
    if (!session?.userId || session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/inventory", "/admin/orders", "/admin/products", "/admin/campaigns", "/admin/quick-add"],
};
