"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/campaigns", label: "Campaigns" },
  { href: "/admin/quick-add", label: "Quick Add" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (user === null) return; // still loading
    if (isAdmin && pathname === "/admin/login") {
      router.replace("/admin");
      return;
    }
    if (!isAdmin && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [user, isAdmin, pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (user !== null && !isAdmin) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-56 shrink-0">
          <h2 className="font-serif text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">
            Epsira Tech Admin
          </h2>
          <nav className="mt-4 space-y-1" aria-label="Admin navigation">
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block rounded px-3 py-2 text-sm text-[var(--muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)]"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              className="mt-4 block rounded px-3 py-2 text-sm font-medium text-[var(--accent)] hover:bg-[var(--border)]"
            >
              Admin sign in
            </Link>
          </nav>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
