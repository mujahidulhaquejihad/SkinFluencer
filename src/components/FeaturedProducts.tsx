"use client";

import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/context/ProductsContext";

interface FeaturedProductsProps {
  /** Section title (e.g. "Best new products") */
  title?: string;
  /** Max number of products to show (default 8) */
  limit?: number;
}

export function FeaturedProducts({ title = "Best new products", limit = 8 }: FeaturedProductsProps) {
  const { products } = useProducts();
  const featured = products.filter((p) => p.featured && !p.membersOnly);
  const toShow = featured.length > 0 ? featured.slice(0, limit) : products.filter((p) => !p.membersOnly).slice(0, limit);

  return (
    <>
      <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {toShow.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </>
  );
}
