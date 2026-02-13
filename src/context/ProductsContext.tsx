"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/types";
import { initialProducts } from "@/lib/data/initialProducts";

const PRODUCTS_KEY = "skinfluencer-products-v2";

function loadProducts(): Product[] {
  if (typeof window === "undefined") return initialProducts;
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) return initialProducts;
    const parsed = JSON.parse(raw) as Product[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialProducts;
  } catch {
    return initialProducts;
  }
}

function saveProducts(products: Product[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

type AddProductInput = Omit<Product, "id" | "slug"> & { slug?: string };

const ProductsContext = createContext<{
  products: Product[];
  addProduct: (product: AddProductInput) => Product;
  removeProduct: (id: string) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  getProductBySlug: (slug: string) => Product | undefined;
  getRelatedProducts: (product: Product, limit?: number) => Product[];
} | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProducts(loadProducts());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) saveProducts(products);
  }, [mounted, products]);

  const addProduct = useCallback((input: AddProductInput): Product => {
    const id = crypto.randomUUID();
    const slug =
      input.slug ||
      input.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") ||
      id;
    const product: Product = {
      ...input,
      id,
      slug,
      currency: "BDT",
      images: input.images?.length ? input.images : ["https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800"],
    };
    setProducts((prev) => [...prev, product]);
    return product;
  }, []);

  const removeProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const getProductBySlug = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products]
  );

  const getRelatedProducts = useCallback(
    (product: Product, limit = 3): Product[] => {
      const sameCategory = products.filter(
        (p) => p.category === product.category && p.id !== product.id
      );
      const sameConcern = products.filter(
        (p) =>
          p.id !== product.id &&
          p.concerns.some((c) => product.concerns.includes(c)) &&
          !sameCategory.some((s) => s.id === p.id)
      );
      return [...sameCategory, ...sameConcern].slice(0, limit);
    },
    [products]
  );

  const value = useMemo(
    () => ({
      products: mounted ? products : initialProducts,
      addProduct,
      removeProduct,
      updateProduct,
      getProductBySlug,
      getRelatedProducts,
    }),
    [mounted, products, addProduct, removeProduct, updateProduct, getProductBySlug, getRelatedProducts]
  );

  return (
    <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
