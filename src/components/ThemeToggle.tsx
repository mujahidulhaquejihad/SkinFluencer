"use client";

import { useTheme } from "@/lib/theme";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <span className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)]" aria-hidden />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] transition hover:bg-[var(--border)] active:bg-[var(--border)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? <Moon className="h-5 w-5" aria-hidden /> : <Sun className="h-5 w-5" aria-hidden />}
    </button>
  );
}
