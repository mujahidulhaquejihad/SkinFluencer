import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import * as bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password and name required" },
        { status: 400 }
      );
    }
    const emailLower = String(email).trim().toLowerCase();
    if (emailLower === "admin@skinfluencer.bd") {
      return NextResponse.json(
        { error: "Cannot register with admin email" },
        { status: 400 }
      );
    }
    const existing = await prisma.user.findUnique({
      where: { email: emailLower },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }
    const hash = await bcrypt.hash(String(password).trim(), 10);
    const user = await prisma.user.create({
      data: {
        email: emailLower,
        password: hash,
        name: String(name).trim(),
        role: "USER",
      },
    });
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
