import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, requireAdmin } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    const admin = await requireAdmin();
    if (admin) {
      return NextResponse.json({ order });
    }
    const user = await requireAuth();
    if (!user || order.userId !== user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    return NextResponse.json({ order });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }
    const { id } = await params;
    const body = await req.json();
    const { status } = body;
    const allowed = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!status || !allowed.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ order });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
