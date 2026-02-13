import Link from "next/link";
import { Sparkles, Clock, Gift, Truck, Headphones, Lock } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Early access",
    description: "48-hour early access to new product launches.",
  },
  {
    icon: Lock,
    title: "Members-only shop",
    description: "Exclusive products and collections.",
  },
  {
    icon: Gift,
    title: "Member discounts",
    description: "Member-only pricing and subsidized shipping.",
  },
  {
    icon: Headphones,
    title: "VIP support",
    description: "Priority customer support and birthday offers.",
  },
  {
    icon: Truck,
    title: "Subsidized shipping",
    description: "Reduced shipping rates across Bangladesh.",
  },
];

export default function SkinInsiderPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)] bg-[var(--accent)]/10 px-4 py-1.5 text-sm font-medium text-[var(--accent)]">
          <Sparkles className="h-4 w-4" aria-hidden />
          Skin-Insider
        </span>
        <h1 className="mt-6 font-serif text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
          Premium membership for skincare enthusiasts
        </h1>
        <p className="mt-4 text-lg text-[var(--muted)]">
          Early access, exclusive shop, member discounts, and priority support.
          Monthly or yearly plans in BDT ৳.
        </p>
      </div>

      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
        {benefits.map(({ icon: Icon, title, description }) => (
          <li
            key={title}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6"
          >
            <Icon className="h-8 w-8 text-[var(--accent)]" aria-hidden />
            <h2 className="mt-4 font-serif text-lg font-semibold text-[var(--foreground)]">
              {title}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
          </li>
        ))}
      </ul>

      <div className="mt-12 rounded-lg border border-[var(--border)] bg-[var(--card)] p-8 text-center">
        <h2 className="font-serif text-xl font-semibold text-[var(--foreground)]">
          Join Skin-Insider
        </h2>
        <p className="mt-2 text-[var(--muted)]">
          <Link href="/login" className="text-[var(--accent)] hover:underline">Sign in</Link> or <Link href="/signup" className="text-[var(--accent)] hover:underline">sign up</Link> to subscribe. BDT ৳ monthly or yearly.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/login"
            className="rounded-full border-2 border-[var(--accent)] bg-[var(--accent)] px-6 py-3 font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            View plans
          </Link>
          <Link
            href="/shop?membersOnly=true"
            className="rounded-full border-2 border-[var(--border)] bg-[var(--card)] px-6 py-3 font-medium text-[var(--foreground)] hover:border-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            Browse members-only shop
          </Link>
        </div>
      </div>
    </div>
  );
}
