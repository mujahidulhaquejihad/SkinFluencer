"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, Suspense } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/context/ProductsContext";
import { getCategoryLabelFromSlug, SKIN_CARE_CATEGORIES, BRANDS } from "@/lib/data/products";
import {
  SKIN_TYPE_LABELS,
  CONCERN_LABELS,
  INGREDIENT_LABELS,
  type SkinType,
  type Concern,
  type Ingredient,
} from "@/lib/types";

const SKIN_TYPES: SkinType[] = ["oily", "dry", "combination", "sensitive"];
const CONCERNS: Concern[] = ["acne", "anti-aging", "hyperpigmentation"];
const INGREDIENTS: Ingredient[] = ["vitamin-c", "retinol", "niacinamide"];

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name A–Z" },
  { value: "new", label: "New arrival" },
];

function ShopContent() {
  const { products } = useProducts();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const skinType = searchParams.get("skinType") as SkinType | null;
  const concern = searchParams.get("concern") as Concern | null;
  const ingredient = searchParams.get("ingredient") as Ingredient | null;
  const categorySlug = searchParams.get("category") ?? "";
  const brand = searchParams.get("brand") ?? "";
  const sort = searchParams.get("sort") ?? "";
  const membersOnly = searchParams.get("membersOnly") === "true";

  const categoryLabel = categorySlug ? getCategoryLabelFromSlug(categorySlug) : null;

  const filtered = useMemo(() => {
    let list = [...products];
    if (q.trim()) {
      const lower = q.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.category.toLowerCase().includes(lower) ||
          (p.brand && p.brand.toLowerCase().includes(lower)) ||
          p.concerns.some((c) => String(c).includes(lower)) ||
          p.ingredients.some((i) => String(i).includes(lower))
      );
    }
    if (categoryLabel) list = list.filter((p) => p.category === categoryLabel);
    if (brand) list = list.filter((p) => p.brand === brand);
    if (skinType) list = list.filter((p) => p.skinTypes.includes(skinType));
    if (concern) list = list.filter((p) => p.concerns.includes(concern));
    if (ingredient) list = list.filter((p) => p.ingredients.includes(ingredient));
    if (membersOnly) list = list.filter((p) => p.membersOnly === true);

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "new") list.reverse();

    return list;
  }, [products, q, skinType, concern, ingredient, categoryLabel, brand, sort, membersOnly]);

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    return `?${params.toString()}`;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <h1 className="font-serif text-xl font-semibold text-[var(--foreground)] sm:text-2xl sm:text-3xl">
        {categoryLabel || "Skin Care"}
      </h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Skin Care Products Price in Bangladesh. All prices in ৳ BDT.
      </p>

      <div className="mt-6 flex flex-col gap-6 lg:mt-8 lg:flex-row lg:gap-8">
        <aside className="lg:w-56 shrink-0" aria-label="Filters">
          <div className="space-y-5 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
            <div>
              <h2 className="font-serif text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">
                Category
              </h2>
              <ul className="mt-2 space-y-0">
                <li>
                  <Link
                    href={updateParam("category", null)}
                    className={`block min-h-[44px] rounded px-3 py-3 text-sm ${
                      !categorySlug ? "font-medium text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--foreground)] active:text-[var(--foreground)]"
                    }`}
                  >
                    All
                  </Link>
                </li>
                {SKIN_CARE_CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={updateParam("category", categorySlug === c.slug ? null : c.slug)}
                      className={`block min-h-[44px] rounded px-3 py-3 text-sm ${
                        categorySlug === c.slug ? "font-medium text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--foreground)] active:text-[var(--foreground)]"
                      }`}
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">
                Brand
              </h2>
              <ul className="mt-2 max-h-48 space-y-0 overflow-y-auto">
                <li>
                  <Link
                    href={updateParam("brand", null)}
                    className={`block min-h-[44px] rounded px-3 py-3 text-sm ${
                      !brand ? "font-medium text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--foreground)] active:text-[var(--foreground)]"
                    }`}
                  >
                    All
                  </Link>
                </li>
                {BRANDS.slice(0, 20).map((b) => (
                  <li key={b}>
                    <Link
                      href={updateParam("brand", brand === b ? null : b)}
                      className={`block min-h-[44px] rounded px-3 py-3 text-sm ${
                        brand === b ? "font-medium text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--foreground)] active:text-[var(--foreground)]"
                      }`}
                    >
                      {b}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">
                Skin type
              </h2>
              <ul className="mt-2 space-y-0">
                {SKIN_TYPES.map((st) => (
                  <li key={st}>
                    <Link
                      href={updateParam("skinType", skinType === st ? null : st)}
                      className={`block min-h-[44px] rounded px-3 py-3 text-sm ${
                        skinType === st ? "font-medium text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--foreground)] active:text-[var(--foreground)]"
                      }`}
                    >
                      {SKIN_TYPE_LABELS[st]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">
                Concerns
              </h2>
              <ul className="mt-2 space-y-0">
                {CONCERNS.map((c) => (
                  <li key={c}>
                    <Link
                      href={updateParam("concern", concern === c ? null : c)}
                      className={`block min-h-[44px] rounded px-3 py-3 text-sm ${
                        concern === c ? "font-medium text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--foreground)] active:text-[var(--foreground)]"
                      }`}
                    >
                      {CONCERN_LABELS[c]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <label className="flex min-h-[44px] cursor-pointer items-center gap-3 py-2">
                <input
                  type="checkbox"
                  checked={membersOnly}
                  onChange={() => {
                    window.location.href = updateParam("membersOnly", membersOnly ? null : "true");
                  }}
                  className="h-5 w-5 shrink-0 rounded border-[var(--border)] text-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]"
                />
                <span className="text-sm text-[var(--foreground)]">Members only</span>
              </label>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-[var(--muted)]">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--muted)]">Sort:</span>
              <select
                value={sort}
                onChange={(e) => {
                  window.location.href = updateParam("sort", e.target.value || null);
                }}
                className="min-h-[44px] rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm text-[var(--foreground)]"
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
          {filtered.length === 0 && (
            <p className="py-12 text-center text-[var(--muted)]">
              No products match your filters. Try adjusting or clear filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-8">Loading…</div>}>
      <ShopContent />
    </Suspense>
  );
}
