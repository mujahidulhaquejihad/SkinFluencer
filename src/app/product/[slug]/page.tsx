"use client";

import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useProducts } from "@/context/ProductsContext";
import { formatBDT, getStockStatus } from "@/lib/utils";
import {
  SKIN_TYPE_LABELS,
  CONCERN_LABELS,
  INGREDIENT_LABELS,
  type SkinType,
  type Concern,
  type Ingredient,
} from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { AddToCartButton } from "@/components/AddToCartButton";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

export default function ProductPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const { getProductBySlug, getRelatedProducts } = useProducts();
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);
  const status = getStockStatus(product.stock);
  const statusLabels = {
    "in-stock": "In Stock",
    "low-stock": "Low Stock",
    "out-of-stock": "Out of Stock",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-[var(--muted)]">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/" className="hover:text-[var(--foreground)]">Home</Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/shop" className="hover:text-[var(--foreground)]">Shop</Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-[var(--foreground)]">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-4">
          <div className="zoom-container relative aspect-[4/5] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <Image
              src={product.images[0] ?? "/placeholder.jpg"}
              alt=""
              width={800}
              height={1000}
              className="h-full w-full object-cover"
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            {product.membersOnly && (
              <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-[var(--accent-foreground)]">
                <Lock className="h-4 w-4" aria-hidden />
                Members only
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.slice(0, 4).map((src, i) => (
                <div
                  key={i}
                  className="zoom-container relative h-20 w-20 shrink-0 overflow-hidden rounded border border-[var(--border)]"
                >
                  <Image
                    src={src}
                    alt=""
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
            {product.category}
          </p>
          <h1 className="mt-2 font-serif text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
            {product.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span
              className={cn(
                "rounded px-2.5 py-1 text-sm font-medium",
                status === "in-stock" && "bg-emerald-600/15 text-emerald-700 dark:text-emerald-300",
                status === "low-stock" && "bg-amber-600/15 text-amber-700 dark:text-amber-300",
                status === "out-of-stock" && "bg-red-600/15 text-red-700 dark:text-red-300"
              )}
              aria-live="polite"
            >
              {statusLabels[status]}
            </span>
            {product.memberDiscount != null && product.memberDiscount > 0 && (
              <span className="text-sm text-[var(--accent)]">
                {product.memberDiscount}% off for Skin-Insider
              </span>
            )}
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-semibold text-[var(--foreground)]">
              {formatBDT(product.price)}
            </span>
            {product.compareAtPrice != null && product.compareAtPrice > product.price && (
              <span className="text-lg text-[var(--muted)] line-through">
                {formatBDT(product.compareAtPrice)}
              </span>
            )}
          </div>
          <p className="mt-6 text-[var(--foreground)]">{product.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="text-sm font-medium text-[var(--muted)]">Skin type:</span>
            {product.skinTypes.map((st) => (
              <span
                key={st}
                className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-sm"
              >
                {SKIN_TYPE_LABELS[st as SkinType]}
              </span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-sm font-medium text-[var(--muted)]">Concerns:</span>
            {product.concerns.map((c) => (
              <span
                key={c}
                className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-sm"
              >
                {CONCERN_LABELS[c as Concern]}
              </span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-sm font-medium text-[var(--muted)]">Key ingredients:</span>
            {product.ingredients.map((i) => (
              <span
                key={i}
                className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-sm"
              >
                {INGREDIENT_LABELS[i as Ingredient]}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <AddToCartButton
              product={product}
              className="min-h-[48px] w-full rounded-full border-2 border-[var(--accent)] bg-[var(--accent)] px-6 py-3.5 font-medium text-[var(--accent-foreground)] transition hover:bg-[var(--accent)]/90 active:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:w-auto"
            />
            <button
              type="button"
              className="min-h-[48px] w-full rounded-full border-2 border-[var(--border)] bg-[var(--card)] px-6 py-3.5 font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] active:bg-[var(--border)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:w-auto"
            >
              Wishlist
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 border-t border-[var(--border)] pt-12" aria-labelledby="routine-heading">
          <h2 id="routine-heading" className="font-serif text-2xl font-semibold text-[var(--foreground)]">
            Complete your routine
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            Products that work well with {product.name}
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
