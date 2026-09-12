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
          Privacy is a product feature, not a slogan. ZecPay does not require email or
          password accounts. This page documents what is stored today.
        </p>

        <section className="space-y-3">
          <h2 className="font-medium text-base">What we store</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted">
            <li>
              Public profile fields you enter when creating a page (username, display name,
              optional bio and avatar URL)
            </li>
            <li>Zcash receiving address(es) you supply (Unified and any optional extras)</li>
            <li>
              A one-way hash of your manage secret (never the raw secret) so only you can
              edit the page later
            </li>
            <li>Invoice metadata you create (title, amount, optional memo, status)</li>
            <li>
              Optional transaction id if you manually mark an invoice paid (operator note,
              not chain proof)
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-base">What we do not store</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted">
            <li>Email addresses or passwords (no account system for creators or payers)</li>
            <li>Payer identity</li>
            <li>Seed phrases or private keys</li>
            <li>Wallet balances</li>
            <li>Invasive analytics profiles</li>
            <li>Automatic full histories of shielded payments</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-base">Manage access</h2>
          <p className="text-muted">
            When you publish a page you receive a manage secret once. Store it offline.
            Anyone with that secret can edit the page; we only keep a hash of it. Lose the
            secret and you cannot recover edit access through this app.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-base">Payments</h2>
          <p className="text-muted">
            Payments are ZIP-321 requests paid from the payer&apos;s own wallet to your
            address. ZecPay never holds ZEC and is not a wallet.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-medium text-base">Hosting notes</h2>
          <p className="text-muted">
            Your host (e.g. Vercel) and database provider (e.g. Neon) may log basic
            connection metadata. Prefer providers and logging policies that match your
            threat model.
          </p>
        </section>
      </main>
    </div>
  );
}
