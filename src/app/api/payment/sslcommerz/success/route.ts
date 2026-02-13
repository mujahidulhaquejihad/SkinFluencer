import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const tranId = searchParams.get("tran_id");
  const valId = searchParams.get("val_id");
  const status = searchParams.get("status");
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  if (status === "VALID" || status === "VALIDATED") {
    if (tranId) {
      await prisma.order.updateMany({
        where: { id: tranId },
        data: { status: "PAID", paymentId: valId || undefined },
      });
    }
  }
  return NextResponse.redirect(`${baseUrl}/checkout/success?orderId=${tranId || ""}`);
}
