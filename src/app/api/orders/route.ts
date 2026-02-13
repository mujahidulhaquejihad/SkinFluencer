import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, requireAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const admin = await requireAdmin();
    if (admin) {
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ orders });
    }
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json({ error: "Sign in to view orders" }, { status: 401 });
    }
    const orders = await prisma.order.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ orders });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      address,
      city,
      postalCode,
      paymentMethod,
      items,
      total,
    } = body;
    if (!name || !phone || !address || !city || !paymentMethod || !items?.length || total == null) {
      return NextResponse.json(
        { error: "Name, phone, address, city, payment method and items required" },
        { status: 400 }
      );
    }
    const user = await requireAuth();
    const order = await prisma.order.create({
      data: {
        userId: user?.userId ?? null,
        status: paymentMethod === "COD" ? "PENDING" : "PENDING",
        paymentMethod: String(paymentMethod),
        total: Number(total),
        name: String(name).trim(),
        phone: String(phone).trim(),
        address: String(address).trim(),
        city: String(city).trim(),
        postalCode: postalCode ? String(postalCode).trim() : null,
        items: JSON.stringify(items),
      },
    });
    return NextResponse.json({ order });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
