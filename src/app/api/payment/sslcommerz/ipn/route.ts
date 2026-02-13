import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const tranId = formData.get("tran_id") as string | null;
    const valId = formData.get("val_id") as string | null;
    const status = formData.get("status") as string | null;
    if ((status === "VALID" || status === "VALIDATED") && tranId) {
      await prisma.order.updateMany({
        where: { id: tranId },
        data: { status: "PAID", paymentId: valId || undefined },
      });
    }
    return NextResponse.json({ done: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "IPN failed" }, { status: 500 });
  }
}
