import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

const SESSION_PASSWORD = process.env.SESSION_SECRET || "skinfluencer-session-secret-min-32-chars-long";
const COOKIE_NAME = "skinfluencer_session";

export interface SessionData {
  userId: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
}

const sessionOptions = {
  password: SESSION_PASSWORD,
  cookieName: COOKIE_NAME,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax" as const,
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session.userId) return null;
  return { userId: session.userId, email: session.email, name: session.name, role: session.role };
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}
