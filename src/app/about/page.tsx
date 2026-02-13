export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
        About SkinFluencer
      </h1>
      <p className="mt-6 text-[var(--muted)]">
        SkinFluencer is a premium skincare platform based in Bangladesh. We
        offer a sophisticated shopping experience with curated products,
        skincare-specific filters (skin type, concerns, ingredients), and
        membership benefits through Skin-Insider.
      </p>
      <p className="mt-4 text-[var(--muted)]">
        All prices are in Bangladeshi Taka (BDT ৳). We support bKash, Nagad,
        and Visa/Mastercard with secure, encrypted checkout. Light and dark
        themes are available with automatic system detection.
      </p>
      <p className="mt-4 text-[var(--muted)]">
        Our design draws inspiration from the elegance and minimalism of
        Ralph Lauren and Lacoste—clean, timeless, and premium.
      </p>
    </div>
  );
}
