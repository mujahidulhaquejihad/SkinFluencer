"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { User, Package, MapPin, CreditCard, Mail, Shield, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: User },
  { id: "orders", label: "Order history", icon: Package },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "membership", label: "Skin-Insider", icon: CreditCard },
];

function AccountContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "dashboard";
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-[var(--muted)]">Loading account…</p>
      </div>
    );
  }

  // Guest view: prompt to sign in / sign up
  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
          Account
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Sign in to access your dashboard, order history, and saved addresses.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-full border-2 border-[var(--accent)] bg-[var(--accent)] px-5 py-2.5 font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-full border-2 border-[var(--border)] bg-[var(--card)] px-5 py-2.5 font-medium text-[var(--foreground)] hover:border-[var(--accent)]"
          >
            Sign up
          </Link>
        </div>
        <div className="mt-12 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="font-serif text-lg font-semibold text-[var(--foreground)]">
            Why create an account?
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            <li>• View and track your orders</li>
            <li>• Save delivery addresses</li>
            <li>• Join Skin-Insider for exclusive benefits</li>
          </ul>
        </div>
      </div>
    );
  }

  // Logged-in user: full account with details
  const roleLabel = user.role === "ADMIN" ? "Administrator" : "Member";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-serif text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
        Account
      </h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Welcome back, {user.name}. Manage your profile and orders here.
      </p>

      <nav
        className="mt-6 flex flex-wrap gap-2 border-b border-[var(--border)] pb-4"
        aria-label="Account sections"
      >
        {tabs.map(({ id, label, icon: Icon }) => (
          <Link
            key={id}
            href={`/account?tab=${id}`}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === id
                ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                : "text-[var(--muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)]"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-6 space-y-6">
        {tab === "dashboard" && (
          <>
            <section
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6"
              aria-labelledby="profile-heading"
            >
              <h2 id="profile-heading" className="font-serif text-lg font-semibold text-[var(--foreground)]">
                Profile details
              </h2>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-5 w-5 shrink-0 text-[var(--muted)]" aria-hidden />
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Full name</dt>
                    <dd className="mt-0.5 text-[var(--foreground)]">{user.name}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[var(--muted)]" aria-hidden />
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Email</dt>
                    <dd className="mt-0.5 text-[var(--foreground)]">{user.email}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-[var(--muted)]" aria-hidden />
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Account type</dt>
                    <dd className="mt-0.5 text-[var(--foreground)]">{roleLabel}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[var(--muted)]/50 text-xs font-mono text-[var(--muted)]" aria-hidden>ID</span>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Account ID</dt>
                    <dd className="mt-0.5 font-mono text-sm text-[var(--foreground)]">{user.id}</dd>
                  </div>
                </div>
              </dl>
            </section>

            <section className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
              <h2 className="font-serif text-lg font-semibold text-[var(--foreground)]">
                Quick actions
              </h2>
              <ul className="mt-4 flex flex-wrap gap-3">
                <li>
                  <Link
                    href="/account/orders"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90"
                  >
                    <Package className="h-4 w-4" aria-hidden />
                    My orders
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--border)]"
                  >
                    Continue shopping
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <LogOut className="h-4 w-4" aria-hidden />
                    Sign out
                  </button>
                </li>
              </ul>
            </section>
          </>
        )}

        {tab === "orders" && (
          <section className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="font-serif text-lg font-semibold text-[var(--foreground)]">
              Order history
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              View and track your orders.
            </p>
            <Link href="/account/orders" className="mt-4 inline-flex items-center gap-2 text-[var(--accent)] hover:underline">
              <Package className="h-4 w-4" aria-hidden />
              My orders →
            </Link>
          </section>
        )}

        {tab === "addresses" && (
          <section className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="font-serif text-lg font-semibold text-[var(--foreground)]">
              Saved addresses
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Save delivery addresses for faster checkout. You can add and manage addresses here (coming soon).
            </p>
          </section>
        )}

        {tab === "membership" && (
          <section className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="font-serif text-lg font-semibold text-[var(--foreground)]">
              Skin-Insider membership
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Subscribe to Skin-Insider for early access, members-only shop, discounts, and VIP support. Plans in BDT ৳.
            </p>
            <Link
              href="/skin-insider"
              className="mt-4 inline-flex items-center gap-2 text-[var(--accent)] hover:underline"
            >
              <CreditCard className="h-4 w-4" aria-hidden />
              View plans
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-4xl px-4 py-8">Loading…</div>}>
      <AccountContent />
    </Suspense>
  );
}
