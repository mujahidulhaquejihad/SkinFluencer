"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useProducts } from "@/context/ProductsContext";
import type { Product, SkinType, Concern, Ingredient } from "@/lib/types";
import { SKIN_TYPE_LABELS, CONCERN_LABELS, INGREDIENT_LABELS } from "@/lib/types";
import { formatBDT } from "@/lib/utils";
import { Trash2, Plus } from "lucide-react";

const SKIN_TYPES: SkinType[] = ["oily", "dry", "combination", "sensitive"];
const CONCERNS: Concern[] = ["acne", "anti-aging", "hyperpigmentation"];
const INGREDIENTS: Ingredient[] = ["vitamin-c", "retinol", "niacinamide"];

const defaultImage = "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800";

export default function AdminProductsPage() {
  const searchParams = useSearchParams();
  const { products, addProduct, removeProduct } = useProducts();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (searchParams.get("add") === "1") setShowForm(true);
  }, [searchParams]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    brand: "",
    shortDescription: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    skinTypes: [] as SkinType[],
    concerns: [] as Concern[],
    ingredients: [] as Ingredient[],
    membersOnly: false,
    memberDiscount: "",
    images: defaultImage,
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseInt(form.price, 10);
    const stock = parseInt(form.stock, 10);
    if (!form.name || Number.isNaN(price) || price < 0 || Number.isNaN(stock) || stock < 0) return;
    const slug =
      form.slug ||
      form.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    addProduct({
      name: form.name,
      slug,
      brand: form.brand.trim() || undefined,
      shortDescription: form.shortDescription || form.name,
      description: form.description || form.shortDescription || form.name,
      price,
      category: form.category || "Other",
      stock,
      skinTypes: form.skinTypes.length ? form.skinTypes : ["combination"],
      concerns: form.concerns,
      ingredients: form.ingredients,
      membersOnly: form.membersOnly,
      memberDiscount: form.memberDiscount ? parseInt(form.memberDiscount, 10) : undefined,
      images: form.images ? form.images.split(",").map((s) => s.trim()).filter(Boolean) : [defaultImage],
      currency: "BDT",
    });
    setForm({
      name: "",
      slug: "",
      brand: "",
      shortDescription: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      skinTypes: [],
      concerns: [],
      ingredients: [],
      membersOnly: false,
      memberDiscount: "",
      images: defaultImage,
    });
    setShowForm(false);
  };

  const toggleArray = <T,>(arr: T[], val: T) =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
        Products
      </h1>
      <p className="mt-2 text-[var(--muted)]">
        Add or remove products. Changes are saved immediately.
      </p>

      <div className="mt-6 flex gap-4">
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--accent)] bg-[var(--accent)] px-5 py-2.5 font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90"
        >
          <Plus className="h-5 w-5" aria-hidden />
          Add product
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="mt-8 space-y-4 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6"
        >
          <h2 className="font-serif text-lg font-semibold text-[var(--foreground)]">
            New product
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="block text-sm font-medium text-[var(--foreground)]">Name *</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
              />
            </label>
            <label>
              <span className="block text-sm font-medium text-[var(--foreground)]">Slug (optional)</span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="url-slug"
                className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
              />
            </label>
            <label>
              <span className="block text-sm font-medium text-[var(--foreground)]">Brand (optional)</span>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                placeholder="Cosrx, Some By Mi, etc."
                className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
              />
            </label>
            <label>
              <span className="block text-sm font-medium text-[var(--foreground)]">Price (BDT) *</span>
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                required
                className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
              />
            </label>
            <label>
              <span className="block text-sm font-medium text-[var(--foreground)]">Stock *</span>
              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                required
                className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
              />
            </label>
            <label className="sm:col-span-2">
              <span className="block text-sm font-medium text-[var(--foreground)]">Category</span>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="Serums, Cleansers, etc."
                className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
              />
            </label>
            <label className="sm:col-span-2">
              <span className="block text-sm font-medium text-[var(--foreground)]">Short description</span>
              <input
                type="text"
                value={form.shortDescription}
                onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
                className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
              />
            </label>
            <label className="sm:col-span-2">
              <span className="block text-sm font-medium text-[var(--foreground)]">Description</span>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
              />
            </label>
            <label className="sm:col-span-2">
              <span className="block text-sm font-medium text-[var(--foreground)]">Image URL(s), comma-separated</span>
              <input
                type="text"
                value={form.images}
                onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
                className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
              />
            </label>
            <div className="sm:col-span-2 flex flex-wrap gap-4">
              <div>
                <span className="block text-sm font-medium text-[var(--foreground)]">Skin types</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {SKIN_TYPES.map((st) => (
                    <label key={st} className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={form.skinTypes.includes(st)}
                        onChange={() =>
                          setForm((f) => ({ ...f, skinTypes: toggleArray(f.skinTypes, st) }))
                        }
                        className="rounded border-[var(--border)] text-[var(--accent)]"
                      />
                      {SKIN_TYPE_LABELS[st]}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <span className="block text-sm font-medium text-[var(--foreground)]">Concerns</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {CONCERNS.map((c) => (
                    <label key={c} className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={form.concerns.includes(c)}
                        onChange={() =>
                          setForm((f) => ({ ...f, concerns: toggleArray(f.concerns, c) }))
                        }
                        className="rounded border-[var(--border)] text-[var(--accent)]"
                      />
                      {CONCERN_LABELS[c]}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <span className="block text-sm font-medium text-[var(--foreground)]">Ingredients</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {INGREDIENTS.map((i) => (
                    <label key={i} className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={form.ingredients.includes(i)}
                        onChange={() =>
                          setForm((f) => ({ ...f, ingredients: toggleArray(f.ingredients, i) }))
                        }
                        className="rounded border-[var(--border)] text-[var(--accent)]"
                      />
                      {INGREDIENT_LABELS[i]}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.membersOnly}
                onChange={(e) => setForm((f) => ({ ...f, membersOnly: e.target.checked }))}
                className="rounded border-[var(--border)] text-[var(--accent)]"
              />
              <span className="text-sm text-[var(--foreground)]">Members only</span>
            </label>
            <label>
              <span className="block text-sm font-medium text-[var(--foreground)]">Member discount %</span>
              <input
                type="number"
                min={0}
                max={100}
                value={form.memberDiscount}
                onChange={(e) => setForm((f) => ({ ...f, memberDiscount: e.target.value }))}
                className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
              />
            </label>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-full border-2 border-[var(--accent)] bg-[var(--accent)] px-5 py-2 font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90"
            >
              Add product
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full border-2 border-[var(--border)] px-5 py-2 font-medium text-[var(--foreground)] hover:border-[var(--accent)]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <ul className="mt-8 space-y-4">
        {products.map((p) => (
          <li
            key={p.id}
            className="flex flex-wrap items-center gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-[var(--border)]">
              <Image
                src={p.images[0] ?? defaultImage}
                alt=""
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/product/${p.slug}`}
                className="font-medium text-[var(--foreground)] hover:underline"
              >
                {p.name}
              </Link>
              <p className="text-sm text-[var(--muted)]">
                {p.category} · {formatBDT(p.price)} · Stock: {p.stock}
              </p>
            </div>
            <button
              type="button"
              onClick={() => removeProduct(p.id)}
              className="inline-flex items-center gap-1 rounded border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
              aria-label={`Remove ${p.name}`}
            >
              <Trash2 className="h-4 w-4" aria-hidden />
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
