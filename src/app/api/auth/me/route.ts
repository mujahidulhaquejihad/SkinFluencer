import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  return NextResponse.json({
    user: {
      id: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
}
