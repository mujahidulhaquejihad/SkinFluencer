import { NextResponse } from "next/server";

const BKASH_APP_KEY = process.env.BKASH_APP_KEY;
const BKASH_APP_SECRET = process.env.BKASH_APP_SECRET;
const BKASH_IS_SANDBOX = process.env.BKASH_IS_SANDBOX !== "false";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, amount } = body;
    if (!orderId || amount == null) {
      return NextResponse.json({ error: "orderId and amount required" }, { status: 400 });
    }
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    if (!BKASH_APP_KEY || !BKASH_APP_SECRET) {
      return NextResponse.json({
        error: "bKash not configured. Set BKASH_APP_KEY and BKASH_APP_SECRET.",
        sandbox: true,
        redirectUrl: `${baseUrl}/checkout/success?orderId=${orderId}`,
      });
    }
    const tokenRes = await fetch(
      BKASH_IS_SANDBOX
        ? "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant"
        : "https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          username: BKASH_APP_KEY,
          password: BKASH_APP_SECRET,
        },
        body: JSON.stringify({ app_key: BKASH_APP_KEY, app_secret: BKASH_APP_SECRET }),
      }
    );
    const tokenData = await tokenRes.json();
    const idToken = tokenData?.id_token;
    if (!idToken) {
      return NextResponse.json({ error: "bKash token failed" }, { status: 400 });
    }
    const createRes = await fetch(
      BKASH_IS_SANDBOX
        ? "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/create"
        : "https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: idToken,
          "X-APP-Key": BKASH_APP_KEY,
        },
        body: JSON.stringify({
          mode: "0011",
          payerReference: " ",
          callbackURL: `${baseUrl}/api/payment/bkash/callback`,
          amount: String(Number(amount)),
          currency: "BDT",
          intent: "sale",
          merchantInvoiceNumber: orderId,
        }),
      }
    );
    const createData = await createRes.json();
    if (createData?.bkashURL) {
      return NextResponse.json({ redirectUrl: createData.bkashURL, trxID: createData.trxID });
    }
    return NextResponse.json(
      { error: createData?.statusMessage || "bKash create failed" },
      { status: 400 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "bKash init failed" }, { status: 500 });
  }
}
