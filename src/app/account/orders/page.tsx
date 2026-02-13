"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { formatBDT } from "@/lib/utils";

interface Order {
  id: string;
  status: string;
  paymentMethod: string;
  total: number;
  createdAt: string;
}

export default function AccountOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    fetch("/api/orders", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
        else setError(data.error || "Failed to load");
      })
      .catch(() => setError("Failed to load orders"))
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading || (user === null && !error)) {
    return <p className="text-[var(--muted)]">Loading…</p>;
  }
  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-[var(--foreground)]">Sign in to view your orders.</p>
        <Link href="/login" className="mt-4 inline-block text-[var(--accent)] hover:underline">
          Sign in
        </Link>
      </div>
    );
  }

  if (error) return <p className="text-red-600 dark:text-red-400">{error}</p>;
  if (loading) return <p className="text-[var(--muted)]">Loading orders…</p>;

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-[var(--foreground)]">
        My orders
      </h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        View and track your orders.
      </p>
      <ul className="mt-6 space-y-4">
        {orders.map((order) => (
          <li
            key={order.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4"
          >
            <div>
              <span className="font-mono text-sm text-[var(--muted)]">{order.id.slice(0, 8)}…</span>
              <span className="ml-2 font-medium text-[var(--foreground)]">{formatBDT(order.total)}</span>
              <span className="ml-2 text-sm text-[var(--muted)]">{order.paymentMethod}</span>
            </div>
            <div className="flex items-center gap-4">
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
              <Link
                href={`/account/orders/${order.id}`}
                className="font-medium text-[var(--accent)] hover:underline"
              >
                View
              </Link>
            </div>
            <span className="w-full text-sm text-[var(--muted)] sm:w-auto">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
      {orders.length === 0 && (
        <p className="mt-6 text-[var(--muted)]">You have no orders yet.</p>
      )}
      <Link href="/account" className="mt-6 inline-block text-sm text-[var(--accent)] hover:underline">
        Back to account
      </Link>
    </div>
  );
}
