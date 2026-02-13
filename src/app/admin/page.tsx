import Link from "next/link";
import { Package, Mail, Plus } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
        Admin dashboard
      </h1>
      <p className="mt-2 text-[var(--muted)]">
        Epsira Tech admin panel. Manage inventory, campaigns, and products.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/inventory"
          className="flex items-center gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 transition hover:border-[var(--accent)]"
        >
          <Package className="h-10 w-10 text-[var(--accent)]" aria-hidden />
          <div>
            <h2 className="font-serif font-semibold text-[var(--foreground)]">
              Inventory
            </h2>
            <p className="text-sm text-[var(--muted)]">
              Track reorder levels and stock status
            </p>
          </div>
        </Link>
        <Link
          href="/admin/campaigns"
          className="flex items-center gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 transition hover:border-[var(--accent)]"
        >
          <Mail className="h-10 w-10 text-[var(--accent)]" aria-hidden />
          <div>
            <h2 className="font-serif font-semibold text-[var(--foreground)]">
              Campaigns
            </h2>
            <p className="text-sm text-[var(--muted)]">
              Newsletter campaigns, drag-and-drop editor
            </p>
          </div>
        </Link>
        <Link
          href="/admin/products"
          className="flex items-center gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 transition hover:border-[var(--accent)]"
        >
          <Plus className="h-10 w-10 text-[var(--accent)]" aria-hidden />
          <div>
            <h2 className="font-serif font-semibold text-[var(--foreground)]">
              Products
            </h2>
            <p className="text-sm text-[var(--muted)]">
              Add or remove products, update inventory
            </p>
          </div>
        </Link>
        <Link
          href="/admin/quick-add"
          className="flex items-center gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 transition hover:border-[var(--accent)]"
        >
          <Plus className="h-10 w-10 text-[var(--accent)]" aria-hidden />
          <div>
            <h2 className="font-serif font-semibold text-[var(--foreground)]">
              Quick Add
            </h2>
            <p className="text-sm text-[var(--muted)]">
              Batch-upload products via CSV
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
