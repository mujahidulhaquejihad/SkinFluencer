"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatBDT } from "@/lib/utils";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  status: string;
  paymentMethod: string;
  paymentId: string | null;
  total: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string | null;
  items: string;
  createdAt: string;
  updatedAt: string;
}

const STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/orders/${id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.order) setOrder(data.order);
        else setError(data.error || "Not found");
      })
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status: string) => {
    if (!order) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) setOrder({ ...order, status: data.order.status });
      else setError(data.error || "Update failed");
    } catch {
      setError("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-[var(--muted)]">Loading…</p>;
  if (error && !order) {
    return (
      <div>
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <Link href="/admin/orders" className="mt-4 inline-block text-[var(--accent)] hover:underline">
          Back to orders
        </Link>
      </div>
    );
  }

  const items: OrderItem[] = order ? (() => {
    try {
      return JSON.parse(order.items);
    } catch {
      return [];
    }
  })() : [];

  return (
    <div>
      <Link href="/admin/orders" className="text-sm text-[var(--accent)] hover:underline">
        ← Orders
      </Link>
      {order && (
        <>
          <h1 className="mt-4 font-serif text-2xl font-semibold text-[var(--foreground)]">
            Order {order.id.slice(0, 8)}…
          </h1>
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
              <h2 className="font-semibold text-[var(--foreground)]">Customer</h2>
              <p className="mt-1 text-[var(--foreground)]">{order.name}</p>
              <p className="text-sm text-[var(--muted)]">{order.phone}</p>
              <p className="mt-2 text-sm text-[var(--foreground)]">
                {order.address}, {order.city}
                {order.postalCode ? ` ${order.postalCode}` : ""}
              </p>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
              <h2 className="font-semibold text-[var(--foreground)]">Status</h2>
              <select
                value={order.status}
                onChange={(e) => updateStatus(e.target.value)}
                disabled={saving}
                className="mt-2 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Payment: {order.paymentMethod}
                {order.paymentId && ` · ${order.paymentId}`}
              </p>
              <p className="text-sm text-[var(--muted)]">
                Placed: {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
            <h2 className="font-semibold text-[var(--foreground)]">Items</h2>
            <ul className="mt-2 space-y-2">
              {items.map((item, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span className="text-[var(--foreground)]">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-[var(--muted)]">{formatBDT(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex justify-between font-medium text-[var(--foreground)]">
              Total <span>{formatBDT(order.total)}</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
