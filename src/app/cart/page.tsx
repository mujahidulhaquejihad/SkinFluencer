"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatBDT } from "@/lib/utils";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-serif text-2xl font-semibold text-[var(--foreground)]">
          Your cart is empty
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          Session-based cart. Add products to checkout.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full border-2 border-[var(--accent)] bg-[var(--accent)] px-6 py-3 font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90"
        >
          Shop now
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-serif text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
        Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
      </h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Prices in Bangladeshi Taka (৳ BDT)
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <ul className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <li
              key={product.id}
              className="flex gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 sm:gap-4 sm:p-4"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded border border-[var(--border)] sm:h-24 sm:w-24">
                <Image
                  src={product.images[0] ?? "/placeholder.jpg"}
                  alt=""
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/product/${product.slug}`}
                  className="font-medium text-[var(--foreground)] hover:underline"
                >
                  {product.name}
                </Link>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {formatBDT(product.price)} each
                </p>
                <div className="mt-2 flex items-center gap-1 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.id, Math.max(0, quantity - 1))}
                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] active:bg-[var(--border)]"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-[2rem] text-center text-sm font-medium" aria-live="polite">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] active:bg-[var(--border)] disabled:opacity-50"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(product.id)}
                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-red-200 text-red-600 active:bg-red-50 dark:border-red-800 dark:text-red-400 dark:active:bg-red-900/20"
                    aria-label="Remove from cart"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-right font-medium text-[var(--foreground)]">
                {formatBDT(product.price * quantity)}
              </div>
            </li>
          ))}
        </ul>

        <div className="lg:col-span-1">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6 lg:sticky lg:top-24">
            <h2 className="font-serif text-lg font-semibold text-[var(--foreground)]">
              Summary
            </h2>
            <p className="mt-4 flex justify-between text-[var(--muted)]">
              Subtotal <span className="text-[var(--foreground)]">{formatBDT(subtotal)}</span>
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Shipping & tax calculated at checkout (BDT)
            </p>
            <Link
              href="/checkout"
              className="mt-6 block w-full min-h-[48px] rounded-full border-2 border-[var(--accent)] bg-[var(--accent)] py-3.5 text-center font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90 active:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Checkout
            </Link>
            <p className="mt-4 text-center text-xs text-[var(--muted)]">
              <Link href="/login" className="text-[var(--accent)] hover:underline">Sign in</Link> or <Link href="/signup" className="text-[var(--accent)] hover:underline">sign up</Link> to save addresses and order history.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
