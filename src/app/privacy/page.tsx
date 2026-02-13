export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-serif text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
        Privacy policy
      </h1>
      <p className="mt-4 text-[var(--muted)]">
        We protect your data. Payment data is handled with PCI-DSS compliant
        processors. SSL/TLS encryption for all data in transit.
      </p>
    </div>
  );
}
