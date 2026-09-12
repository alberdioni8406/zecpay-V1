"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PagePreview } from "@/components/PagePreview";
import { DEFAULT_PAYMENT_BUTTONS } from "@/lib/config";

export default function CreatePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [zcashAddress, setZcashAddress] = useState("");
  const [amountsText, setAmountsText] = useState(DEFAULT_PAYMENT_BUTTONS.join(", "));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const paymentButtons = useMemo(() => {
    return amountsText
      .split(/[,\s]+/)
      .map((s) => Number(s))
      .filter((n) => Number.isFinite(n) && n > 0);
  }, [amountsText]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");

    const payload = {
      username,
      displayName,
      bio,
      avatarUrl,
      zcashAddress,
      paymentButtons: paymentButtons.length ? paymentButtons : DEFAULT_PAYMENT_BUTTONS,
      isPublished: true,
    };

    const res = await fetch("/api/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.status === 401) {
      setBusy(false);
      router.push("/login?next=/create");
      return;
    }

    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Could not create page");
      return;
    }
    router.push(`/${data.username}`);
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b border-card-border">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-accent font-mono text-lg">Ƶ</span>
            <span className="font-semibold">ZecPay</span>
          </Link>
          <Link href="/dashboard" className="text-sm text-muted hover:text-foreground">
            Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-10 grid gap-8 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Create your payment page</h1>
            <p className="text-sm text-muted mt-2">
              Add a receiving address you control. ZecPay never holds your keys or funds.
            </p>
          </div>

          <Field label="Username / handle">
            <input
              required
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="alberdioni"
              className="input"
            />
          </Field>
          <Field label="Display name">
            <input
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Alberto"
              className="input"
            />
          </Field>
          <Field label="Short biography">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={280}
              placeholder="Building useful things for a more private internet."
              className="input resize-none"
            />
          </Field>
          <Field label="Profile image URL (optional)">
            <input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.png"
              className="input"
            />
          </Field>
          <Field label="Zcash receiving address">
            <input
              required
              value={zcashAddress}
              onChange={(e) => setZcashAddress(e.target.value)}
              placeholder="u1… / zs1… / t1…"
              className="input font-mono text-xs sm:text-sm"
            />
          </Field>
          <Field label="Payment amounts (ZEC, comma-separated)">
            <input
              value={amountsText}
              onChange={(e) => setAmountsText(e.target.value)}
              className="input"
            />
          </Field>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-accent text-black px-6 py-3 font-medium hover:bg-accent-dim disabled:opacity-60"
          >
            {busy ? "Publishing…" : "Publish payment page"}
          </button>
        </form>

        <PagePreview
          displayName={displayName}
          username={username}
          bio={bio}
          avatarUrl={avatarUrl}
          paymentButtons={paymentButtons.length ? paymentButtons : DEFAULT_PAYMENT_BUTTONS}
        />
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm">{label}</span>
      {children}
    </label>
  );
}
