import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const paymentID = searchParams.get("paymentID");
  const status = searchParams.get("status");
  const trxID = searchParams.get("trxID");
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  if (status === "success" && paymentID && trxID) {
    const orderId = searchParams.get("merchantInvoiceNumber");
    if (orderId) {
      await prisma.order.updateMany({
        where: { id: orderId },
        data: { status: "PAID", paymentId: trxID },
      });
    }
    return NextResponse.redirect(`${baseUrl}/checkout/success?orderId=${orderId || ""}`);
  }
  return NextResponse.redirect(`${baseUrl}/checkout?failed=1`);
}
