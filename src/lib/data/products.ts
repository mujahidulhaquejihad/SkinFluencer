import type { Product } from "@/lib/types";
import { initialProducts, popularSearchTerms as terms, SKIN_CARE_CATEGORIES, BRANDS } from "./initialProducts";

export { initialProducts as products };
export { terms as popularSearchTerms };
export { SKIN_CARE_CATEGORIES, BRANDS };

export function getCategoryLabelFromSlug(slug: string): string | null {
  const c = SKIN_CARE_CATEGORIES.find((x) => x.slug === slug);
  return c ? c.label : null;
}

export function getProductBySlug(slug: string): Product | undefined {
  return initialProducts.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  const sameCategory = initialProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  );
  const sameConcern = initialProducts.filter(
    (p) =>
      p.id !== product.id &&
      p.concerns.some((c) => product.concerns.includes(c)) &&
      !sameCategory.some((s) => s.id === p.id)
  );
  return [...sameCategory, ...sameConcern].slice(0, limit);
}
