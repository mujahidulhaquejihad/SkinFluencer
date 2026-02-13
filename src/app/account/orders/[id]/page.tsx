"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
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
  total: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string | null;
  items: string;
  createdAt: string;
}

export default function AccountOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    fetch(`/api/orders/${id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.order) setOrder(data.order);
        else setError(data.error || "Not found");
      })
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, [id, user]);

  if (authLoading || (user === null && !error)) {
    return <p className="text-[var(--muted)]">Loading…</p>;
  }
  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-[var(--foreground)]">Sign in to view this order.</p>
        <Link href="/login" className="mt-4 inline-block text-[var(--accent)] hover:underline">
          Sign in
        </Link>
      </div>
    );
  }

  if (loading) return <p className="text-[var(--muted)]">Loading…</p>;
  if (error && !order) {
    return (
      <div>
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <Link href="/account/orders" className="mt-4 inline-block text-[var(--accent)] hover:underline">
          Back to orders
        </Link>
      </div>
    );
  }

  const items: OrderItem[] = order
    ? (() => {
        try {
          return JSON.parse(order.items);
        } catch {
          return [];
        }
      })()
    : [];

  return (
    <div>
      <Link href="/account/orders" className="text-sm text-[var(--accent)] hover:underline">
        ← My orders
      </Link>
      {order && (
        <>
          <h1 className="mt-4 font-serif text-2xl font-semibold text-[var(--foreground)]">
            Order {order.id.slice(0, 8)}…
          </h1>
          <p className="mt-2">
            <span
              className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                order.status === "DELIVERED"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : order.status === "CANCELLED"
                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  : "bg-[var(--accent)]/20 text-[var(--accent)]"
              }`}
            >
              {order.status}
            </span>
          </p>
          <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
            <h2 className="font-semibold text-[var(--foreground)]">Delivery</h2>
            <p className="mt-1 text-[var(--foreground)]">{order.name}</p>
            <p className="text-sm text-[var(--muted)]">{order.phone}</p>
            <p className="text-sm text-[var(--foreground)]">
              {order.address}, {order.city}
              {order.postalCode ? ` ${order.postalCode}` : ""}
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">Payment: {order.paymentMethod}</p>
            <p className="text-sm text-[var(--muted)]">
              Placed: {new Date(order.createdAt).toLocaleString()}
            </p>
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
      <Link href="/account/orders" className="mt-6 inline-block text-sm text-[var(--accent)] hover:underline">
        Back to orders
      </Link>
    </div>
  );
}
