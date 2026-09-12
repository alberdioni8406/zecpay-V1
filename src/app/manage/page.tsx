"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CopyLinkButton } from "@/components/CopyLinkButton";

function ManageInner() {
  const params = useSearchParams();
  const initial = params.get("secret") || "";
  const [secret, setSecret] = useState(initial);
  const [page, setPage] = useState<{
    id: string;
    username: string;
    displayName: string;
    zcashAddress: string;
    addresses?: { type: string; address: string }[];
    isPublished: boolean;
  } | null>(null);
  const [invoices, setInvoices] = useState<
    { publicId: string; title: string; amount: number; status: string }[]
  >([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [invTitle, setInvTitle] = useState("");
  const [invAmount, setInvAmount] = useState("");
  const [invDesc, setInvDesc] = useState("");

  async function load(sec: string) {
    setBusy(true);
    setError("");
    const res = await fetch("/api/manage/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: sec }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Could not open page");
      setPage(null);
      return;
    }
    setPage(data.page);
    setInvoices(data.invoices || []);
  }

  useEffect(() => {
    if (initial.length >= 16) load(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  async function onUnlock(e: FormEvent) {
    e.preventDefault();
    await load(secret.trim());
  }

  async function createInvoice(e: FormEvent) {
    e.preventDefault();
    if (!page) return;
    setBusy(true);
    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentPageId: page.id,
        title: invTitle,
        description: invDesc,
        amount: Number(invAmount),
        manageSecret: secret.trim(),
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Could not create invoice");
      return;
    }
    setInvTitle("");
    setInvAmount("");
    setInvDesc("");
    await load(secret.trim());
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b border-card-border">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-accent font-mono text-lg">Ƶ</span>
            <span className="font-semibold">ZecPay</span>
          </Link>
          <Link href="/create" className="text-sm text-muted hover:text-foreground">
            Create new page
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Manage your page</h1>
          <p className="text-sm text-muted mt-2 leading-relaxed">
            No email login. Paste the manage secret you saved when you published.
            Only that secret can edit this page.
          </p>
        </div>

        <form
          onSubmit={onUnlock}
          className="space-y-3 rounded-xl border border-card-border bg-card p-5"
        >
          <label className="block space-y-1.5">
            <span className="text-sm">Manage secret</span>
            <input
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="input font-mono text-xs"
              placeholder="Paste your secret"
              required
            />
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-accent text-black px-5 py-2.5 text-sm font-medium disabled:opacity-60"
          >
            {busy ? "Opening…" : "Unlock"}
          </button>
        </form>

        {page && (
          <>
            <section className="rounded-xl border border-card-border bg-card p-5 space-y-3">
              <p className="font-medium text-lg">{page.displayName}</p>
              <p className="text-sm text-muted">@{page.username}</p>
              <p className="text-xs font-mono break-all text-ghost">{page.zcashAddress}</p>
              {page.addresses?.map((a, i) => (
                <p key={i} className="text-xs text-muted">
                  <span className="text-accent">{a.type}</span>:{" "}
                  <span className="font-mono break-all">{a.address}</span>
                </p>
              ))}
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href={`/${page.username}`}
                  className="text-sm text-accent hover:underline"
                >
                  Open public page
                </Link>
                <CopyLinkButton
                  url={`\( {typeof window !== "undefined" ? window.location.origin : ""}/ \){page.username}`}
                />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-medium">Create invoice</h2>
              <form
                onSubmit={createInvoice}
                className="rounded-xl border border-card-border bg-card p-5 grid gap-3 sm:grid-cols-2"
              >
                <input
                  required
                  value={invTitle}
                  onChange={(e) => setInvTitle(e.target.value)}
                  placeholder="Title"
                  className="input sm:col-span-2"
                />
                <input
                  required
                  value={invAmount}
                  onChange={(e) => setInvAmount(e.target.value)}
                  placeholder="Amount ZEC"
                  className="input"
                  inputMode="decimal"
                />
                <input
                  value={invDesc}
                  onChange={(e) => setInvDesc(e.target.value)}
                  placeholder="Description"
                  className="input"
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="sm:col-span-2 rounded-full bg-accent text-black py-2.5 text-sm font-medium disabled:opacity-60"
                >
                  Create invoice
                </button>
              </form>
            </section>

            <section className="space-y-3">
              <h2 className="font-medium">Invoices</h2>
              {invoices.length === 0 && (
                <p className="text-sm text-muted">None yet.</p>
              )}
              {invoices.map((inv) => (
                <div
                  key={inv.publicId}
                  className="rounded-xl border border-card-border bg-card p-4 flex justify-between gap-3"
                >
                  <div>
                    <p className="font-medium text-sm">{inv.title}</p>
                    <p className="text-xs text-muted">
                      {inv.amount} ZEC · {inv.status}
                    </p>
                  </div>
                  <Link
                    href={`/i/${inv.publicId}`}
                    className="text-sm text-accent hover:underline"
                  >
                    Open
                  </Link>
                </div>
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default function ManagePage() {
  return (
    <Suspense>
      <ManageInner />
    </Suspense>
  );
}
