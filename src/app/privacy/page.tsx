import Link from "next/link";

export const metadata = {
  title: "Privacy",
  description: "What ZecPay stores and what it does not.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh">
      <header className="border-b border-card-border">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <span className="text-accent font-mono">Ƶ</span>
            <span className="font-semibold">ZecPay</span>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-12 space-y-8 text-sm leading-relaxed">
        <h1 className="text-2xl font-semibold tracking-tight">Privacy</h1>
        <p className="text-muted">
          Privacy is a product feature, not a slogan. This page documents what the
          application stores today.
        </p>

        <section className="space-y-3">
          <h2 className="font-medium text-base">What we store</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted">
            <li>Creator email and password hash (to manage pages)</li>
            <li>Public profile fields the creator enters (name, bio, optional avatar URL)</li>
            <li>The Zcash receiving address the creator supplies</li>
            <li>Invoice metadata the creator creates (title, amount, optional memo, expiry)</li>
            <li>Optional transaction id if a creator manually marks an invoice paid</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-base">What we do not store by default</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted">
            <li>Payer identity or account</li>
            <li>Seed phrases or private keys</li>
            <li>Wallet balances</li>
            <li>Invasive analytics profiles</li>
            <li>Automatic full transaction histories for shielded funds</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-base">Payments</h2>
          <p className="text-muted">
            Payments are constructed as ZIP-321 requests and sent from the payer&apos;s
            own wallet to the creator&apos;s address. ZecPay never holds ZEC.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-base">Hosting notes</h2>
          <p className="text-muted">
            Your hosting provider may log basic HTTP request metadata (IP, user agent).
            That is outside this application&apos;s data model. Prefer hosts and logging
            policies that match your threat model.
          </p>
        </section>
      </main>
    </div>
  );
}
