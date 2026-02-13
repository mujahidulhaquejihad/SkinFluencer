"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (email.trim().toLowerCase() === "admin@skinfluencer.bd") {
      setError("Use Sign in (not Sign up) with Admin ID and Password: admin@skinfluencer.bd / admin123");
      return;
    }
    try {
      await signup(name, email, password);
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed.");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-serif text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
        Sign up
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Create an account for order history, saved addresses, and Skin-Insider. To use admin, go to Sign in and use the Admin ID and Password.
      </p>
      {error && (
        <p className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
        <div>
          <label htmlFor="signup-name" className="block text-sm font-medium text-[var(--foreground)]">
            Name
          </label>
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className="mt-1 w-full min-h-[48px] rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted)]"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium text-[var(--foreground)]">
            Email
          </label>
          <input
            id="signup-email"
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
          <label htmlFor="signup-password" className="block text-sm font-medium text-[var(--foreground)]">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            minLength={8}
            className="mt-1 w-full min-h-[48px] rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted)]"
            placeholder="••••••••"
          />
          <p className="mt-1 text-xs text-[var(--muted)]">At least 8 characters</p>
        </div>
        <button
          type="submit"
          className="w-full min-h-[48px] rounded-full border-2 border-[var(--accent)] bg-[var(--accent)] py-3.5 font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90 active:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          Create account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--muted)]">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-[var(--accent)] hover:underline">
          Sign in
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
