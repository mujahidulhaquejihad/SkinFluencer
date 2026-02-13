"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, Menu, ChevronDown, LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBar } from "./SearchBar";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { SKIN_CARE_CATEGORIES } from "@/lib/data/products";

const baseNav = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Skin Care", hasDropdown: true },
  { href: "/skin-insider", label: "Skin-Insider" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const nav = [
    ...baseNav,
    ...(user
      ? isAdmin
        ? [{ href: "/admin", label: "Admin" }]
        : [{ href: "/account", label: "Account" }]
      : [{ href: "/login", label: "Sign in" }]),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/80 safe-area-pt">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2 sm:gap-4 sm:px-6 lg:px-8 sm:py-3">
        <div className="flex min-h-[44px] items-center gap-2">
          <button
            type="button"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] active:bg-[var(--border)] lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link
            href="/"
            className="min-h-[44px] flex items-center text-lg font-semibold tracking-tight text-[var(--foreground)] sm:text-xl sm:text-2xl"
          >
            SkinFluencer
          </Link>
        </div>

        <nav
          className={cn(
            "absolute left-0 right-0 top-full max-h-[calc(100dvh-120px)] overflow-y-auto border-b border-[var(--border)] bg-[var(--card)] shadow-lg lg:static lg:max-h-none lg:overflow-visible lg:shadow-none",
            !mobileOpen && "hidden lg:flex"
          )}
          aria-label="Main navigation"
        >
          <ul className="flex flex-col lg:flex-row lg:items-center lg:gap-6 lg:px-0 lg:py-0">
            {nav.map((item) =>
              item.hasDropdown ? (
                <li key={item.href} className="relative group border-b border-[var(--border)] last:border-0 lg:border-0">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex min-h-[48px] items-center gap-1 rounded-none px-4 py-3 text-[var(--foreground)] active:bg-[var(--border)] lg:min-h-0 lg:rounded-lg lg:px-3 lg:py-2 lg:hover:bg-[var(--border)] lg:hover:underline",
                      pathname === item.href && "font-medium lg:underline"
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                    <ChevronDown className="h-4 w-4 lg:group-hover:rotate-180 transition-transform" aria-hidden />
                  </Link>
                  <ul className="bg-[var(--background)] lg:absolute lg:left-0 lg:top-full lg:pt-1 lg:opacity-0 lg:invisible lg:group-hover:opacity-100 lg:group-hover:visible lg:transition-all lg:z-50 lg:min-w-[220px] lg:rounded-lg lg:border lg:border-[var(--border)] lg:bg-[var(--card)] lg:shadow-lg lg:py-2">
                    {SKIN_CARE_CATEGORIES.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/shop?category=${c.slug}`}
                          className="block min-h-[44px] px-4 py-3 text-[var(--foreground)] active:bg-[var(--border)] lg:min-h-0 lg:py-2 lg:hover:bg-[var(--border)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                    <li className="border-t border-[var(--border)] lg:mt-0 lg:border-t-0">
                      <Link
                        href={item.href}
                        className="block min-h-[44px] px-4 py-3 font-medium text-[var(--accent)] active:bg-[var(--border)] lg:min-h-0 lg:py-2"
                        onClick={() => setMobileOpen(false)}
                      >
                        All Skin Care
                      </Link>
                    </li>
                  </ul>
                </li>
              ) : (
                <li key={item.href} className="border-b border-[var(--border)] last:border-0 lg:border-0">
                  <Link
                    href={item.href}
                    className={cn(
                      "block min-h-[48px] rounded-none px-4 py-3 text-[var(--foreground)] active:bg-[var(--border)] lg:min-h-0 lg:rounded-lg lg:px-3 lg:py-2 lg:hover:bg-[var(--border)] lg:hover:underline",
                      pathname === item.href && "font-medium lg:underline"
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>

        <div className="flex min-h-[44px] items-center gap-1 sm:gap-2">
          <div className="hidden flex-1 md:block md:max-w-xs lg:max-w-md">
            <SearchBar />
          </div>
          <ThemeToggle />
          <Link
            href="/cart"
            className="relative inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] active:bg-[var(--border)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            aria-label={`View cart (${totalItems} items)`}
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--accent)] text-xs font-medium text-[var(--accent-foreground)]">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>
          {!isAdmin && (
            <Link
              href="/account"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] active:bg-[var(--border)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>
          )}
          {user ? (
            <button
              type="button"
              onClick={() => logout()}
              className="hidden min-h-[44px] items-center rounded-full border-2 border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--border)] sm:inline-flex"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Sign out
            </button>
          ) : (
            <Link
              href="/signup"
              className="hidden min-h-[44px] items-center rounded-full border-2 border-[var(--accent)] bg-transparent px-4 py-2.5 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent)]/10 sm:inline-flex"
            >
              Sign up
            </Link>
          )}
        </div>
      </div>
      <div className="border-t border-[var(--border)] px-3 py-2 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
