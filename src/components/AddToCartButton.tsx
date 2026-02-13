"use client";

import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  className?: string;
  children?: React.ReactNode;
}

export function AddToCartButton({
  product,
  quantity = 1,
  className = "",
  children,
}: AddToCartButtonProps) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem(product, quantity);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={product.stock <= 0}
      className={className}
    >
      {children ?? "Add to cart"}
    </button>
  );
}
