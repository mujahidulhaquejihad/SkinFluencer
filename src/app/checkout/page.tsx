"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatBDT } from "@/lib/utils";
import { CreditCard, Smartphone, Shield, Banknote } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "SSLCOMMERZ" | "BKASH">("COD");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  useEffect(() => {
    const failed = searchParams.get("failed");
    const cancelled = searchParams.get("cancelled");
    if (failed) setError("Payment failed. Please try again or choose COD.");
    if (cancelled) setError("Payment was cancelled.");
  }, [searchParams]);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-serif text-2xl font-semibold text-[var(--foreground)]">
          Your cart is empty
        </h1>
        <Link href="/shop" className="mt-4 inline-block text-[var(--accent)] hover:underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  const orderItems = items.map(({ product, quantity }) => ({
    productId: product.id,
    name: product.name,
    price: product.price,
    quantity,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      setError("Please fill name, phone, address and city.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          postalCode: postalCode.trim() || null,
          paymentMethod,
          items: orderItems,
          total: subtotal,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");
      const orderId = data.order.id;

      if (paymentMethod === "COD") {
        clearCart();
        router.push(`/checkout/success?orderId=${orderId}`);
        return;
      }

      if (paymentMethod === "SSLCOMMERZ") {
        const initRes = await fetch("/api/payment/sslcommerz/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            amount: subtotal,
            customerName: name.trim(),
            customerEmail: user?.email || "customer@example.com",
            customerPhone: phone.trim(),
            customerAddress: address.trim(),
            customerCity: city.trim(),
          }),
        });
        const initData = await initRes.json();
        if (initData.redirectUrl) {
          clearCart();
          window.location.href = initData.redirectUrl;
          return;
        }
        if (initData.sandbox && initData.redirectUrl) {
          clearCart();
          window.location.href = initData.redirectUrl;
          return;
        }
        throw new Error(initData.error || "Payment init failed");
      }

      if (paymentMethod === "BKASH") {
        const initRes = await fetch("/api/payment/bkash/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, amount: subtotal }),
        });
        const initData = await initRes.json();
        if (initData.redirectUrl) {
          clearCart();
          window.location.href = initData.redirectUrl;
          return;
        }
        if (initData.sandbox && initData.redirectUrl) {
          clearCart();
          window.location.href = initData.redirectUrl;
          return;
        }
        throw new Error(initData.error || "bKash init failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-serif text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
        Checkout
      </h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Secure checkout. SSL/TLS. BDT ৳
      </p>

      {error && (
        <p className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6">
            <h2 className="font-serif text-lg font-semibold text-[var(--foreground)]">
              Delivery
            </h2>
            <input
              type="text"
              placeholder="Full name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-4 w-full min-h-[48px] rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted)]"
            />
            <input
              type="tel"
              placeholder="Phone *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="mt-2 w-full min-h-[48px] rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted)]"
            />
            <input
              type="text"
              placeholder="Address *"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="mt-2 w-full min-h-[48px] rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted)]"
            />
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                placeholder="City *"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="min-h-[48px] flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted)]"
              />
              <input
                type="text"
                placeholder="Postal code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-28 min-h-[48px] rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted)]"
              />
            </div>
          </section>

          <section className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="font-serif text-lg font-semibold text-[var(--foreground)]">
              Payment
            </h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-[var(--muted)]">
              <Shield className="h-4 w-4" aria-hidden />
              Secure. PCI-DSS compliant.
            </p>
            <div className="mt-4 space-y-3">
              <label className="flex min-h-[56px] cursor-pointer items-center gap-3 rounded-lg border border-[var(--border)] p-4 active:bg-[var(--border)]/50">
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <Banknote className="h-6 w-6 text-[var(--muted)]" />
                <span className="font-medium">Cash on Delivery (COD)</span>
                <span className="text-sm text-[var(--muted)]">Pay when you receive</span>
              </label>
              <label className="flex min-h-[56px] cursor-pointer items-center gap-3 rounded-lg border border-[var(--border)] p-4 active:bg-[var(--border)]/50">
                <input
                  type="radio"
                  name="payment"
                  value="SSLCOMMERZ"
                  checked={paymentMethod === "SSLCOMMERZ"}
                  onChange={() => setPaymentMethod("SSLCOMMERZ")}
                  className="text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <CreditCard className="h-6 w-6 text-[var(--muted)]" />
                <span className="font-medium">SSLCommerz</span>
                <span className="text-sm text-[var(--muted)]">Card, bank, mobile</span>
              </label>
              <label className="flex min-h-[56px] cursor-pointer items-center gap-3 rounded-lg border border-[var(--border)] p-4 active:bg-[var(--border)]/50">
                <input
                  type="radio"
                  name="payment"
                  value="BKASH"
                  checked={paymentMethod === "BKASH"}
                  onChange={() => setPaymentMethod("BKASH")}
                  className="text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <Smartphone className="h-6 w-6 text-[var(--muted)]" />
                <span className="font-medium">bKash</span>
                <span className="text-sm text-[var(--muted)]">Mobile wallet</span>
              </label>
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="font-serif text-lg font-semibold text-[var(--foreground)]">
              Order summary
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex justify-between">
                  <span className="text-[var(--muted)]">
                    {product.name} × {quantity}
                  </span>
                  <span className="text-[var(--foreground)]">
                    {formatBDT(product.price * quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex justify-between font-medium text-[var(--foreground)]">
              Total <span>{formatBDT(subtotal)}</span>
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full min-h-[48px] rounded-full border-2 border-[var(--accent)] bg-[var(--accent)] py-3.5 font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90 active:opacity-90 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              {submitting ? "Processing…" : "Place order"}
            </button>
            <Link href="/cart" className="mt-4 block text-center text-sm text-[var(--accent)] hover:underline">
              Back to cart
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
