import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatBDT(amount: number): string {
  return new Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getStockStatus(stock: number): "in-stock" | "low-stock" | "out-of-stock" {
  if (stock <= 0) return "out-of-stock";
  if (stock <= 10) return "low-stock";
  return "in-stock";
}
