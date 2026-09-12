import Link from "next/link";
import { ArrowRight, Shield, Link2, Wallet, Ghost } from "lucide-react";
import { getSupportZecAddress } from "@/lib/config";
import { SupportTip } from "@/components/SupportTip";

export default function HomePage() {
  const support = getSupportZecAddress();

  return (
    <div className="flex flex-col min-h-dvh">
      <header className="border-b border-card-border">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-accent font-mono text-lg tracking-tight">Ƶ</span>
            <span className="font-semibold tracking-tight">ZecPay</span>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/manage" className="text-muted hover:text-foreground transition-colors">
              Manage page
            </Link>
            <Link
              href="/create"
              className="rounded-full bg-accent text-black px-4 py-1.5 font-medium hover:bg-accent-dim transition-colors"
            >
              Create page
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="max-w-2xl">
            <p className="text-accent font-mono text-sm mb-4 tracking-wide flex items-center gap-2">
              <Ghost className="h-4 w-4" />
              Ghost mode · No accounts · Non-custodial
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.15] text-balance">
              Private Zcash payments.
              <br />
              <span className="text-muted">Made simple.</span>
            </h1>
            <p className="mt-6 text-lg text-muted leading-relaxed max-w-xl">
              Create a payment link, share it, get paid to addresses you control.
              No email signup. No passwords. No custody of your ZEC.
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

        <section id="how-it-works" className="border-t border-card-border bg-card/40">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
            <h2 className="text-2xl font-semibold tracking-tight mb-12">How it works</h2>
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                {
                  n: "1",
                  t: "Create",
                  b: "Add a Unified address (and optional Orchard / transparent receivers). Publish instantly — no account.",
                },
                {
                  n: "2",
                  t: "Share",
                  b: "Send your personal link. Payers never sign up. They open the page and pay from their own wallet.",
                },
                {
                  n: "3",
                  t: "Receive",
                  b: "Funds go straight to your address. Keep your manage secret offline if you need to edit later.",
                },
              ].map((s) => (
                <div key={s.n} className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-card-border bg-background text-accent font-mono text-sm">
                    {s.n}
                  </div>
                  <h3 className="font-medium text-lg">{s.t}</h3>
                  <p className="text-muted text-sm leading-relaxed">{s.b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-card-border">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
            <h2 className="text-2xl font-semibold tracking-tight mb-10">Built for privacy</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Principle
                icon={<Shield className="h-5 w-5" />}
                title="Non-custodial"
                body="We never hold ZEC, never see private keys, and never ask for a seed phrase."
              />
              <Principle
                icon={<Wallet className="h-5 w-5" />}
                title="Your addresses"
                body="Primary Unified address plus optional Orchard, Sapling, and transparent slots you control."
              />
              <Principle
                icon={<Link2 className="h-5 w-5" />}
                title="No accounts for anyone"
                body="Creators manage with a secret link — not email. Payers never register."
              />
            </div>
          </div>
        </section>

        {support && (
          <section className="border-t border-card-border">
            <div className="mx-auto max-w-5xl px-4 py-16">
              <SupportTip address={support} />
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-card-border py-8">
        <div className="mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <p>ZecPay — working name. Domain and branding TBD.</p>
          <div className="flex items-center gap-4 font-mono text-xs">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <span>Ghost · Non-custodial · ZIP-321</span>
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
