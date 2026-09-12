
"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { PagePreview } from "@/components/PagePreview";
import { DEFAULT_PAYMENT_BUTTONS } from "@/lib/config";

type AddressRow = {
  type: "unified" | "orchard" | "sapling" | "transparent";
  address: string;
};

export default function CreatePage() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [zcashAddress, setZcashAddress] = useState("");
  const [extra, setExtra] = useState<AddressRow[]>([
    { type: "orchard", address: "" },
    { type: "transparent", address: "" },
  ]);
  const [amountsText, setAmountsText] = useState(DEFAULT_PAYMENT_BUTTONS.join(", "));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<{
    username: string;
    manageSecret: string;
    managePath: string;
  } | null>(null);

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

    const addresses = extra
      .filter((a) => a.address.trim())
      .map((a) => ({ type: a.type, address: a.address.trim() }));

    const payload = {
      username,
      displayName,
      bio,
      avatarUrl,
      zcashAddress,
      addresses: addresses.length ? addresses : undefined,
      paymentButtons: paymentButtons.length ? paymentButtons : DEFAULT_PAYMENT_BUTTONS,
      isPublished: true,
    };

    const res = await fetch("/api/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Could not create page");
      return;
    }
    setCreated({
      username: data.username,
      manageSecret: data.manageSecret,
      managePath: data.managePath,
    });
  }

  if (created) {
    const publicUrl = `\( {typeof window !== "undefined" ? window.location.origin : ""}/ \){created.username}`;
    return (
      <div className="min-h-dvh flex flex-col">
        <header className="border-b border-card-border">
          <div className="mx-auto max-w-lg px-4 py-4">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <span className="text-accent font-mono text-lg">Ƶ</span>
              <span className="font-semibold">ZecPay</span>
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-lg px-4 py-12 space-y-6">
          <h1 className="text-2xl font-semibold tracking-tight">Your page is live</h1>
          <p className="text-muted text-sm leading-relaxed">
            Share the public link with anyone. No account was created — keep your
            manage secret safe. Anyone with it can edit this page.
          </p>
          <div className="rounded-xl border border-card-border bg-card p-4 space-y-2">
            <p className="text-xs uppercase tracking-wide text-muted">Public link</p>
            <p className="font-mono text-sm break-all text-accent">{publicUrl}</p>
            <Link href={`/${created.username}`} className="text-sm text-ghost hover:text-foreground">
              Open your page →
            </Link>
          </div>
          <div className="rounded-xl border border-accent/40 bg-card p-4 space-y-3">
            <p className="text-xs uppercase tracking-wide text-accent">Manage secret — save this now</p>
            <p className="font-mono text-xs break-all leading-relaxed">{created.manageSecret}</p>
            <p className="text-xs text-muted leading-relaxed">
              This is shown once. Store it offline. Use it at{" "}
              <Link href={created.managePath} className="text-accent underline">
                the manage page
              </Link>{" "}
              to edit addresses or create invoices. We never store the raw secret.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b border-card-border">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-accent font-mono text-lg">Ƶ</span>
            <span className="font-semibold">ZecPay</span>
          </Link>
          <Link href="/manage" className="text-sm text-muted hover:text-foreground">
            Manage existing page
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-10 grid gap-8 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Create your payment page</h1>
            <p className="text-sm text-muted mt-2 leading-relaxed">
              No email. No password. No custodial wallet. Add addresses you already control —
              then share your link.
            </p>
          </div>

          <label className="block space-y-1.5">
            <span className="text-sm">Username / handle</span>
            <input
              required
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="alberdioni"
              className="input"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm">Display name</span>
            <input
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Alberto"
              className="input"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm">Short bio</span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={280}
              className="input resize-none"
              placeholder="Building for a more private internet."
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm">Primary Zcash address (Unified preferred)</span>
            <input
              required
              value={zcashAddress}
              onChange={(e) => setZcashAddress(e.target.value)}
              className="input font-mono text-xs sm:text-sm"
              placeholder="u1…"
            />
          </label>

          <div className="space-y-3 rounded-xl border border-card-border p-4">
            <p className="text-sm font-medium">Optional extra addresses</p>
            <p className="text-xs text-muted">
              Add Orchard, Sapling, or transparent receivers if you want them listed.
            </p>
            {extra.map((row, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={row.type}
                  onChange={(e) => {
                    const next = [...extra];
                    next[i] = { ...next[i], type: e.target.value as AddressRow["type"] };
                    setExtra(next);
                  }}
                  className="input"
                >
                  <option value="unified">Unified</option>
                  <option value="orchard">Orchard</option>
                  <option value="sapling">Sapling</option>
                  <option value="transparent">Transparent</option>
                </select>
                <input
                  value={row.address}
                  onChange={(e) => {
                    const next = [...extra];
                    next[i] = { ...next[i], address: e.target.value };
                    setExtra(next);
                  }}
                  className="input font-mono text-xs sm:col-span-2"
                  placeholder="Address (optional)"
                />
              </div>
            ))}
          </div>

          <label className="block space-y-1.5">
            <span className="text-sm">Payment amounts (ZEC)</span>
            <input
              value={amountsText}
              onChange={(e) => setAmountsText(e.target.value)}
              className="input"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm">Avatar URL (optional)</span>
            <input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="input"
            />
          </label>

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
