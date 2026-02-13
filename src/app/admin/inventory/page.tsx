"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useProducts } from "@/context/ProductsContext";
import { getStockStatus } from "@/lib/utils";
import { formatBDT } from "@/lib/utils";
import { Plus, Search } from "lucide-react";

export default function AdminInventoryPage() {
  const { products, updateProduct } = useProducts();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<string>("");
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q))
    );
  }, [products, search]);

  const byStatus = useMemo(() => {
    const inStock: typeof filteredProducts = [];
    const lowStock: typeof filteredProducts = [];
    const outOfStock: typeof filteredProducts = [];
    filteredProducts.forEach((p) => {
      const status = getStockStatus(p.stock);
      if (status === "in-stock") inStock.push(p);
      else if (status === "low-stock") lowStock.push(p);
      else outOfStock.push(p);
    });
    return { inStock, lowStock, outOfStock };
  }, [filteredProducts]);

  const startEdit = (p: { id: string; stock: number }) => {
    setEditingId(p.id);
    setEditStock(String(p.stock));
  };

  const saveStock = (id: string) => {
    const n = parseInt(editStock, 10);
    if (!Number.isNaN(n) && n >= 0) {
      updateProduct(id, { stock: n });
    }
    setEditingId(null);
    setEditStock("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditStock("");
  };

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
        Inventory
      </h1>
      <p className="mt-2 text-[var(--muted)]">
        Update stock levels. Changes are saved immediately.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" aria-hidden />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, category, or brand…"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] py-2 pl-10 pr-4 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            aria-label="Search products"
          />
        </div>
        <Link
          href="/admin/products?add=1"
          className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--accent)] bg-[var(--accent)] px-5 py-2.5 font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90"
        >
          <Plus className="h-5 w-5" aria-hidden />
          Add product
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
          <h2 className="font-serif text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">
            In stock
          </h2>
          <p className="mt-2 text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
            {byStatus.inStock.length}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
          <h2 className="font-serif text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">
            Low stock (≤10)
          </h2>
          <p className="mt-2 text-2xl font-semibold text-amber-600 dark:text-amber-400">
            {byStatus.lowStock.length}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
          <h2 className="font-serif text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">
            Out of stock
          </h2>
          <p className="mt-2 text-2xl font-semibold text-red-600 dark:text-red-400">
            {byStatus.outOfStock.length}
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--card)]">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="px-4 py-3 font-semibold text-[var(--foreground)]">
                Product
              </th>
              <th className="px-4 py-3 font-semibold text-[var(--foreground)]">
                Category
              </th>
              <th className="px-4 py-3 font-semibold text-[var(--foreground)]">
                Stock
              </th>
              <th className="px-4 py-3 font-semibold text-[var(--foreground)]">
                Status
              </th>
              <th className="px-4 py-3 font-semibold text-[var(--foreground)]">
                Price (BDT)
              </th>
              <th className="px-4 py-3 font-semibold text-[var(--foreground)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[var(--muted)]">
                  {search.trim() ? "No products match your search." : "No products yet."}
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
              const status = getStockStatus(p.stock);
              const isEditing = editingId === p.id;
              return (
                <tr
                  key={p.id}
                  className="border-b border-[var(--border)] last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">{p.category}</td>
                  <td className="px-4 py-3 text-[var(--foreground)]">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          value={editStock}
                          onChange={(e) => setEditStock(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveStock(p.id);
                            if (e.key === "Escape") cancelEdit();
                          }}
                          className="w-20 rounded border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-[var(--foreground)]"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => saveStock(p.id)}
                          className="rounded bg-[var(--accent)] px-2 py-1 text-xs text-[var(--accent-foreground)] hover:opacity-90"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="rounded border border-[var(--border)] px-2 py-1 text-xs text-[var(--muted)] hover:bg-[var(--border)]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="rounded border border-[var(--border)] px-2 py-1 hover:bg-[var(--border)]"
                      >
                        {p.stock} (edit)
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        status === "in-stock" &&
                        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      } ${
                        status === "low-stock" &&
                        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                      } ${
                        status === "out-of-stock" &&
                        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      }`}
                    >
                      {status === "in-stock" && "In Stock"}
                      {status === "low-stock" && "Low Stock"}
                      {status === "out-of-stock" && "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--foreground)]">
                    {formatBDT(p.price)}
                  </td>
                  <td className="px-4 py-3">
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="text-sm text-[var(--accent)] hover:underline"
                      >
                        Update stock
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
