"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { useAuth } from "@/context/AuthContext";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="font-serif text-2xl font-semibold text-[var(--foreground)]">
        Order placed
      </h1>
      <p className="mt-2 text-[var(--muted)]">
        Thank you. Your order has been received.
        {orderId && (
          <span className="mt-2 block font-mono text-sm">
            Order ID: {orderId}
          </span>
        )}
      </p>
      <div className="mt-8 flex flex-col gap-4">
        {user && orderId && (
          <Link
            href={`/account/orders/${orderId}`}
            className="rounded-full border-2 border-[var(--accent)] bg-[var(--accent)] px-6 py-3 font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90"
          >
            View order
          </Link>
        )}
        <Link href="/shop" className="text-[var(--accent)] hover:underline">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-16 text-center">Loading…</div>}>
      <SuccessContent />
    </Suspense>
  );
}
