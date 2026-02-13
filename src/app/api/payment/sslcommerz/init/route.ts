import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const SSLCOMMERZ_STORE_ID = process.env.SSLCOMMERZ_STORE_ID;
const SSLCOMMERZ_STORE_PASSWD = process.env.SSLCOMMERZ_STORE_PASSWD;
const IS_LIVE = process.env.SSLCOMMERZ_IS_LIVE === "true";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, amount, customerName, customerEmail, customerPhone, customerAddress, customerCity } = body;
    if (!orderId || amount == null) {
      return NextResponse.json({ error: "orderId and amount required" }, { status: 400 });
    }
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const payload = {
      store_id: SSLCOMMERZ_STORE_ID,
      store_passwd: SSLCOMMERZ_STORE_PASSWD,
      total_amount: Number(amount),
      currency: "BDT",
      tran_id: orderId,
      success_url: `${baseUrl}/api/payment/sslcommerz/success`,
      fail_url: `${baseUrl}/api/payment/sslcommerz/fail`,
      cancel_url: `${baseUrl}/api/payment/sslcommerz/cancel`,
      ipn_url: `${baseUrl}/api/payment/sslcommerz/ipn`,
      cus_name: customerName || "Customer",
      cus_email: customerEmail || "customer@example.com",
      cus_phone: customerPhone || "01700000000",
      cus_add1: customerAddress || "Address",
      cus_city: customerCity || "Dhaka",
      product_name: "SkinFluencer Order",
      product_category: "Skincare",
      product_profile: "general",
      shipping_method: "NO",
    };
    if (!SSLCOMMERZ_STORE_ID || !SSLCOMMERZ_STORE_PASSWD) {
      return NextResponse.json({
        error: "SSLCommerz not configured. Set SSLCOMMERZ_STORE_ID and SSLCOMMERZ_STORE_PASSWD.",
        sandbox: true,
        redirectUrl: `${baseUrl}/checkout/success?orderId=${orderId}`,
      });
    }
    const apiUrl = IS_LIVE
      ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
      : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(payload as Record<string, string>).toString(),
    });
    const data = await res.json();
    if (data.GatewayPageURL) {
      return NextResponse.json({ redirectUrl: data.GatewayPageURL });
    }
    return NextResponse.json(
      { error: data.failedreason || "SSLCommerz init failed" },
      { status: 400 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Payment init failed" }, { status: 500 });
  }
}
