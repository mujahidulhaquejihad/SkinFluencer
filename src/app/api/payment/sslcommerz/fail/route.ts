import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const tranId = searchParams.get("tran_id");
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return NextResponse.redirect(`${baseUrl}/checkout?failed=1&orderId=${tranId || ""}`);
}
