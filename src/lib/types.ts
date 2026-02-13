export type SkinType = "oily" | "dry" | "combination" | "sensitive";
export type Concern = "acne" | "anti-aging" | "hyperpigmentation";
export type Ingredient = "vitamin-c" | "retinol" | "niacinamide";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number; // BDT
  compareAtPrice?: number;
  currency: "BDT";
  images: string[];
  videoUrl?: string;
  skinTypes: SkinType[];
  concerns: Concern[];
  ingredients: Ingredient[];
  category: string;
  brand?: string;
  stock: number;
  membersOnly?: boolean;
  memberDiscount?: number; // percentage
  featured?: boolean; // best new / highlighted on home
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type UserRole = "guest" | "regular" | "skin-insider" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  skinInsiderExpiry?: string; // ISO date
  addresses: DeliveryAddress[];
}

export interface DeliveryAddress {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  deliveryAddress: DeliveryAddress;
}

export const SKIN_TYPE_LABELS: Record<SkinType, string> = {
  oily: "Oily",
  dry: "Dry",
  combination: "Combination",
  sensitive: "Sensitive",
};

export const CONCERN_LABELS: Record<Concern, string> = {
  acne: "Acne",
  "anti-aging": "Anti-aging",
  hyperpigmentation: "Hyperpigmentation",
};

export const INGREDIENT_LABELS: Record<Ingredient, string> = {
  "vitamin-c": "Vitamin C",
  retinol: "Retinol",
  niacinamide: "Niacinamide",
};
