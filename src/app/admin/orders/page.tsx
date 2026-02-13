"use client";

import { useEffect, useState } from "react";
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
  total: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string | null;
  items: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/orders", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
        else setError(data.error || "Failed to load");
      })
      .catch(() => setError("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-[var(--muted)]">Loading orders…</p>;
  if (error) return <p className="text-red-600 dark:text-red-400">{error}</p>;

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-[var(--foreground)]">
        Orders
      </h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Track and update order status until delivered.
      </p>
      <div className="mt-6 overflow-x-auto rounded-lg border border-[var(--border)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--card)]">
            <tr>
              <th className="px-4 py-3 font-medium text-[var(--foreground)]">Order</th>
              <th className="px-4 py-3 font-medium text-[var(--foreground)]">Customer</th>
              <th className="px-4 py-3 font-medium text-[var(--foreground)]">Total</th>
              <th className="px-4 py-3 font-medium text-[var(--foreground)]">Payment</th>
              <th className="px-4 py-3 font-medium text-[var(--foreground)]">Status</th>
              <th className="px-4 py-3 font-medium text-[var(--foreground)]">Date</th>
              <th className="px-4 py-3 font-medium text-[var(--foreground)]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] bg-[var(--background)]">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 font-mono text-xs text-[var(--muted)]">
                  {order.id.slice(0, 8)}…
                </td>
                <td className="px-4 py-3 text-[var(--foreground)]">{order.name}</td>
                <td className="px-4 py-3 text-[var(--foreground)]">{formatBDT(order.total)}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{order.paymentMethod}</td>
                <td className="px-4 py-3">
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
                </td>
                <td className="px-4 py-3 text-[var(--muted)]">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-medium text-[var(--accent)] hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orders.length === 0 && (
        <p className="mt-6 text-[var(--muted)]">No orders yet.</p>
      )}
    </div>
  );
}
