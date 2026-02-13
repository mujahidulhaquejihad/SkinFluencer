import Link from "next/link";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { SKIN_CARE_CATEGORIES } from "@/lib/data/products";
import { ArrowRight, Sparkles, Truck, Gift, Headphones } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero - Beauty Booth style */}
      <section
        className="relative flex min-h-[50vh] flex-col items-center justify-center bg-[var(--card)] px-4 py-12 text-center sm:min-h-[55vh]"
        aria-label="Hero"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--background)_0%,transparent_50%,var(--card)_100%)] dark:bg-[linear-gradient(to_bottom,var(--background)_0%,transparent_50%,var(--card)_100%)]" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="font-serif text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
            Best skin care products in Bangladesh
          </p>
          <h1 className="mt-4 font-serif text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl md:text-5xl lg:text-6xl">
            Skin Care Products Price in Bangladesh
          </h1>
          <p className="mt-6 text-lg text-[var(--muted)]">
            Maintaining the healthiest possible appearance of your skin. Cleansers, toners, serums, moisturizers, and sun protection. All prices in ৳ BDT.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4">
            <Link
              href="/shop"
              className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-full border-2 border-[var(--accent)] bg-[var(--accent)] px-6 py-3.5 font-medium text-[var(--accent-foreground)] transition hover:bg-[var(--accent)]/90 active:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Explore Skin Care
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
            <Link
              href="/skin-insider"
              className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-full border-2 border-[var(--border)] bg-[var(--card)] px-6 py-3.5 font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:bg-[var(--border)] active:bg-[var(--border)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
              Skin-Insider
            </Link>
          </div>
        </div>
      </section>

      {/* Category pills - Beauty Booth style */}
      <section className="border-y border-[var(--border)] bg-[var(--background)] py-6" aria-labelledby="category-pills">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="category-pills" className="sr-only">
            Skin Care categories
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {SKIN_CARE_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/shop?category=${c.slug}`}
                className="min-h-[44px] inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:bg-[var(--border)] active:bg-[var(--border)]"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Skin-Insider CTA strip */}
      <section
        className="border-b border-[var(--border)] bg-[var(--accent)] px-4 py-4 text-center text-[var(--accent-foreground)]"
        aria-label="Skin-Insider benefits"
      >
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 text-sm sm:gap-10">
          <span className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" aria-hidden />
            Early access to launches
          </span>
          <span className="flex items-center gap-2">
            <Gift className="h-5 w-5" aria-hidden />
            Members-only shop & discounts
          </span>
          <span className="flex items-center gap-2">
            <Truck className="h-5 w-5" aria-hidden />
            Subsidized shipping
          </span>
          <span className="flex items-center gap-2">
            <Headphones className="h-5 w-5" aria-hidden />
            Priority support
          </span>
        </div>
      </section>

      {/* Best new products */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8" aria-labelledby="best-new-heading">
        <div className="flex items-end justify-between">
          <h2 id="best-new-heading" className="font-serif text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
            Best new products
          </h2>
          <Link href="/shop" className="text-sm font-medium text-[var(--accent)] hover:underline">
            See all
          </Link>
        </div>
        <FeaturedProducts title="Best new products" limit={8} />
      </section>

      {/* Shop by concern */}
      <section className="border-t border-[var(--border)] bg-[var(--card)] py-12" aria-labelledby="categories-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="categories-heading" className="font-serif text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
            Shop by concern
          </h2>
          <div className="mt-6 flex flex-wrap gap-4">
            {["Acne", "Anti-aging", "Hyperpigmentation"].map((concern) => (
              <Link
                key={concern}
                href={`/shop?concern=${concern.toLowerCase().replace(" ", "-")}`}
                className="min-h-[44px] inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--background)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:bg-[var(--border)] active:bg-[var(--border)]"
              >
                {concern}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
