"use client";

import { useState } from "react";
import { useProducts } from "@/context/ProductsContext";

export default function AdminQuickAddPage() {
  const { addProduct, products } = useProducts();
  const [csv, setCsv] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleUpload = () => {
    if (!csv.trim()) {
      setResult("Paste a CSV with columns: name, price, category, stock (optional: shortDescription). One product per line.");
      return;
    }
    const lines = csv.trim().split("\n").map((l) => l.trim()).filter(Boolean);
    const header = lines[0].toLowerCase();
    const dataLines = header.includes("name") ? lines.slice(1) : lines;
    let added = 0;
    const defaultImage = "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800";
    for (const line of dataLines) {
      const parts = line.split(",").map((p) => p.trim());
      if (parts.length < 2) continue;
      const name = parts[0];
      const price = parseInt(parts[1], 10);
      const category = parts[2] || "Other";
      const stock = parseInt(parts[3], 10) || 0;
      const shortDesc = parts[4] || name;
      if (!name || Number.isNaN(price)) continue;
      const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || `product-${products.length + added}`;
      addProduct({
        name,
        slug,
        shortDescription: shortDesc,
        description: shortDesc,
        price,
        category,
        stock,
        skinTypes: ["combination"],
        concerns: [],
        ingredients: [],
        images: [defaultImage],
        currency: "BDT",
      });
      added++;
    }
    setResult(added > 0 ? `Added ${added} product(s).` : "No valid rows. Use: name, price, category, stock, shortDescription");
    setCsv("");
  };

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
        Quick Add products
      </h1>
      <p className="mt-2 text-[var(--muted)]">
        Paste CSV: name, price (BDT), category, stock, shortDescription (optional).
      </p>

      <div className="mt-8 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="font-serif text-lg font-semibold text-[var(--foreground)]">
          Paste CSV
        </h2>
        <textarea
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          placeholder="Product Name,2499,Serums,50,Short description"
          rows={6}
          className="mt-4 w-full rounded border border-[var(--border)] bg-[var(--background)] px-4 py-2 font-mono text-sm text-[var(--foreground)] placeholder:text-[var(--muted)]"
        />
        <button
          type="button"
          onClick={handleUpload}
          className="mt-4 rounded-full border-2 border-[var(--accent)] bg-[var(--accent)] px-6 py-2.5 font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90"
        >
          Process & add products
        </button>
        {result && (
          <p className="mt-4 text-sm text-[var(--muted)]" role="status">
            {result}
          </p>
        )}
      </div>
    </div>
  );
}
