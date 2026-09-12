import Link from "next/link";
import { ArrowRight, Shield, Link2, Wallet } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-dvh">
      {/* Header */}
      <header className="border-b border-card-border">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-accent font-mono text-lg tracking-tight">
              Ƶ
            </span>
            <span className="font-semibold tracking-tight">ZecPay</span>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/create"
              className="text-muted hover:text-foreground transition-colors"
            >
              Create page
            </Link>
            <Link
              href="/create"
              className="rounded-full bg-accent text-black px-4 py-1.5 font-medium hover:bg-accent-dim transition-colors"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-4 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="max-w-2xl">
            <p className="text-accent font-mono text-sm mb-4 tracking-wide">
              Non-custodial · Privacy-first
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.15] text-balance">
              Private Zcash payments.
              <br />
              <span className="text-muted">Made simple.</span>
            </h1>
            <p className="mt-6 text-lg text-muted leading-relaxed max-w-xl">
              Create a simple Zcash payment page, accept tips, and create
              invoices without giving up custody of your funds.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-full bg-accent text-black px-6 py-3 font-medium hover:bg-accent-dim transition-colors"
              >
                Create your payment page
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-full border border-card-border px-6 py-3 font-medium text-muted hover:text-foreground hover:border-muted transition-colors"
              >
                See how it works
              </a>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="border-t border-card-border bg-card/40"
        >
          <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
            <h2 className="text-2xl font-semibold tracking-tight mb-12">
              How it works
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-card-border bg-background text-accent font-mono text-sm">
                  1
                </div>
                <h3 className="font-medium text-lg">Create</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Add your Zcash receiving address and customize your page.
                  Choose preset amounts or allow custom tips.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-card-border bg-background text-accent font-mono text-sm">
                  2
                </div>
                <h3 className="font-medium text-lg">Share</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Share your personal payment link. Anyone can open it on their
                  phone or computer—no account required.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-card-border bg-background text-accent font-mono text-sm">
                  3
                </div>
                <h3 className="font-medium text-lg">Receive</h3>
                <p className="text-muted text-sm leading-relaxed">
                  People pay directly to your Zcash address using their own
                  wallet. Funds never touch ZecPay.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="border-t border-card-border">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
            <h2 className="text-2xl font-semibold tracking-tight mb-10">
              Built for privacy
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Principle
                icon={<Shield className="h-5 w-5" />}
                title="Non-custodial"
                body="ZecPay never holds your ZEC, never sees your private keys, and never asks for a seed phrase."
              />
              <Principle
                icon={<Wallet className="h-5 w-5" />}
                title="Your wallet, your rules"
                body="Payers use their own Zcash wallet. We generate standard ZIP-321 payment requests and QR codes."
              />
              <Principle
                icon={<Link2 className="h-5 w-5" />}
                title="No account for payers"
                body="Anyone with a link can pay. No sign-up, no KYC, no tracking of the person sending funds."
              />
            </div>
            <p className="mt-10 text-sm text-muted max-w-2xl leading-relaxed">
              ZecPay is a payment interface and request layer—not a wallet, not
              an exchange, and not a custodian. You supply a receiving address;
              the money goes directly there.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-card-border py-8">
        <div className="mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <p>ZecPay — working name. Domain and branding TBD.</p>
          <div className="flex items-center gap-4 font-mono text-xs">
            <a href="/privacy" className="hover:text-foreground">
              Privacy
            </a>
            <span>Non-custodial · ZIP-321</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Principle({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-card-border bg-card p-5 space-y-3">
      <div className="text-accent">{icon}</div>
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{body}</p>
    </div>
  );
}
