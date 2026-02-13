import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatBDT, getStockStatus } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const status = getStockStatus(product.stock);
  const statusLabels = {
    "in-stock": "In Stock",
    "low-stock": "Low Stock",
    "out-of-stock": "Out of Stock",
  };

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] transition hover:border-[var(--accent)]",
        className
      )}
    >
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden">
        <span className="sr-only">{product.name}</span>
        <Image
          src={product.images[0] ?? "/placeholder.jpg"}
          alt=""
          width={400}
          height={500}
          className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        />
        {product.membersOnly && (
          <span
            className="absolute right-2 top-2 flex items-center gap-1 rounded bg-[var(--accent)] px-2 py-1 text-xs font-medium text-[var(--accent-foreground)]"
            aria-label="Members only"
          >
            <Lock className="h-3.5 w-5" aria-hidden />
            Members
          </span>
        )}
        <span
          className={cn(
            "absolute left-2 top-2 rounded px-2 py-1 text-xs font-medium",
            status === "in-stock" && "bg-emerald-600/90 text-white",
            status === "low-stock" && "bg-amber-600/90 text-white",
            status === "out-of-stock" && "bg-red-600/90 text-white"
          )}
          aria-live="polite"
        >
          {statusLabels[status]}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        {product.brand && (
          <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
            {product.brand}
          </p>
        )}
        <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
          {product.category}
        </p>
        <h2 className="mt-1 font-serif text-lg font-semibold text-[var(--foreground)]">
          <Link href={`/product/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </h2>
        <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">
          {product.shortDescription}
        </p>
        <div className="mt-auto flex items-baseline gap-2 pt-3">
          <span className="font-semibold text-[var(--foreground)]">
            {formatBDT(product.price)}
          </span>
          {product.compareAtPrice != null && product.compareAtPrice > product.price && (
            <span className="text-sm text-[var(--muted)] line-through">
              {formatBDT(product.compareAtPrice)}
            </span>
          )}
          {product.memberDiscount != null && product.memberDiscount > 0 && (
            <span className="text-xs text-[var(--accent)]">
              {product.memberDiscount}% off for members
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
