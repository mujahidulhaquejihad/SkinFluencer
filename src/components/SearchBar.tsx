"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { popularSearchTerms } from "@/lib/data/products";
import { useProducts } from "@/context/ProductsContext";

export function SearchBar() {
  const router = useRouter();
  const { products } = useProducts();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const updateSuggestions = useCallback((q: string) => {
    const trimmed = q.trim().toLowerCase();
    if (!trimmed) {
      setSuggestions(popularSearchTerms.slice(0, 6));
      return;
    }
    const fromProducts = products
      .flatMap((p) => [p.name, p.category, ...p.concerns, ...p.ingredients])
      .filter((t) => String(t).toLowerCase().includes(trimmed))
      .slice(0, 4);
    const fromPopular = popularSearchTerms.filter((t) =>
      t.toLowerCase().includes(trimmed)
    );
    const combined = Array.from(new Set([...fromProducts, ...fromPopular])).slice(0, 8);
    setSuggestions(combined);
  }, [products]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    updateSuggestions(v);
    setOpen(true);
    setActiveIndex(-1);
  };

  const handleFocus = () => {
    updateSuggestions(query);
    setOpen(true);
  };

  const handleBlur = () => {
    setTimeout(() => setOpen(false), 150);
  };

  const submit = (term: string) => {
    setQuery(term);
    setOpen(false);
    setActiveIndex(-1);
    router.push(`/shop?q=${encodeURIComponent(term)}`);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0 && suggestions[activeIndex]) {
      e.preventDefault();
      submit(suggestions[activeIndex]);
    }
  };

  return (
    <div className="relative w-full max-w-xl">
      <label htmlFor="header-search" className="sr-only">
        Search products
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted)]"
          aria-hidden
        />
        <input
          ref={inputRef}
          id="header-search"
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-activedescendant={
            activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined
          }
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Search products, ingredients..."
          className="w-full min-h-[44px] rounded-full border border-[var(--border)] bg-[var(--card)] py-3 pl-11 pr-4 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          autoComplete="off"
        />
      </div>
      {open && (
        <ul
          ref={listRef}
          id="search-suggestions"
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[70vh] overflow-auto rounded-xl border border-[var(--border)] bg-[var(--card)] py-1 shadow-lg"
        >
          {suggestions.length === 0 ? (
            <li className="px-4 py-3 text-[var(--muted)]">No suggestions</li>
          ) : (
            suggestions.map((s, i) => (
              <li
                key={s}
                id={`suggestion-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                className={cn(
                  "cursor-pointer min-h-[44px] px-4 py-3 text-[var(--foreground)] hover:bg-[var(--border)] active:bg-[var(--border)]",
                  i === activeIndex && "bg-[var(--border)]"
                )}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  submit(s);
                }}
              >
                {s}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
