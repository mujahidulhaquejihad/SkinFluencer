"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const user = await loginAdmin(email, password);
    if (user) {
      router.push("/admin");
    } else {
      setError("Invalid admin credentials. Use the Admin ID and Password below.");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-serif text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
        Admin sign in
      </h1>
      <div className="mt-4 rounded-lg border border-[var(--accent)] bg-[var(--accent)]/10 p-4">
        <p className="text-sm font-medium text-[var(--foreground)]">Admin ID &amp; Password (copy these):</p>
        <p className="mt-1 font-mono text-sm text-[var(--accent)]">Email: admin@skinfluencer.bd</p>
        <p className="font-mono text-sm text-[var(--accent)]">Password: admin123</p>
      </div>
      {error && (
        <p className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
        <div>
          <label htmlFor="admin-email" className="block text-sm font-medium text-[var(--foreground)]">
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="mt-1 w-full min-h-[48px] rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted)]"
            placeholder="admin@skinfluencer.bd"
          />
        </div>
        <div>
          <label htmlFor="admin-password" className="block text-sm font-medium text-[var(--foreground)]">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="mt-1 w-full min-h-[48px] rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted)]"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full min-h-[48px] rounded-full border-2 border-[var(--accent)] bg-[var(--accent)] py-3.5 font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90 active:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          Sign in to admin
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--muted)]">
        <Link href="/admin" className="text-[var(--accent)] hover:underline">
          Back to admin
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-[var(--muted)]">
        <Link href="/login" className="text-[var(--accent)] hover:underline">
          Customer sign in
        </Link>
      </p>
    </div>
  );
}
