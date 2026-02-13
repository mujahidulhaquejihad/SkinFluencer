import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  Shop: [
    { href: "/shop", label: "All Products" },
    { href: "/shop?category=serums", label: "Serums" },
    { href: "/shop?category=moisturizers", label: "Moisturizers" },
    { href: "/skin-insider", label: "Members Only" },
  ],
  Support: [
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
    { href: "/shipping", label: "Shipping & Returns" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)] safe-area-pb">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="font-serif text-lg font-semibold text-[var(--foreground)]">
              SkinFluencer
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Premium skincare for Bangladesh. BDT ৳. Light & dark mode.
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-[var(--muted)]">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" aria-hidden />
                Dhaka, Bangladesh
              </span>
              <a href="mailto:hello@skinfluencer.bd" className="flex items-center gap-2 hover:text-[var(--foreground)]">
                <Mail className="h-4 w-4" aria-hidden />
                hello@skinfluencer.bd
              </a>
              <a href="tel:+8801700000000" className="flex items-center gap-2 hover:text-[var(--foreground)]">
                <Phone className="h-4 w-4" aria-hidden />
                +880 1700-000000
              </a>
            </div>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">
                {title}
              </h3>
              <ul className="mt-4 space-y-0">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="block min-h-[44px] py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] active:text-[var(--foreground)] sm:min-h-0 sm:py-0"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-[var(--border)] pt-8 text-center text-sm text-[var(--muted)]">
          <p>© {new Date().getFullYear()} SkinFluencer. Bangladesh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
