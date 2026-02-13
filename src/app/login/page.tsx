"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const loggedInUser = await login(email, password);
    if (loggedInUser) {
      router.push(loggedInUser.role === "ADMIN" ? "/admin" : "/account");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-serif text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
        Sign in
      </h1>
      <div className="mt-4 rounded-lg border border-[var(--accent)] bg-[var(--accent)]/10 p-4">
        <p className="text-sm font-medium text-[var(--foreground)]">Admin login (copy these):</p>
        <p className="mt-1 font-mono text-sm text-[var(--accent)]">Email: admin@skinfluencer.bd</p>
        <p className="font-mono text-sm text-[var(--accent)]">Password: admin123</p>
      </div>
      <p className="mt-4 text-sm text-[var(--muted)]">
        Customers: sign in with the email and password you used when signing up.
      </p>
      {error && (
        <p className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-[var(--foreground)]">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="mt-1 w-full min-h-[48px] rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted)]"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-[var(--foreground)]">
            Password
          </label>
          <input
            id="login-password"
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
          Sign in
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--muted)]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-[var(--accent)] hover:underline">
          Sign up
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-[var(--muted)]">
        <Link href="/account" className="text-[var(--accent)] hover:underline">
          Back to account
        </Link>
      </p>
    </div>
  );
}
