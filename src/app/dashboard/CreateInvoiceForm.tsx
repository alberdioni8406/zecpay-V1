"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type PageOpt = { id: string; username: string; displayName: string };

export function CreateInvoiceForm({ pages }: { pages: PageOpt[] }) {
  const router = useRouter();
  const [paymentPageId, setPaymentPageId] = useState(pages[0]?.id || "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentPageId,
        title,
        description,
        amount: Number(amount),
        memo,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Could not create invoice");
      return;
    }
    router.push(`/i/${data.publicId}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-card-border bg-card p-5 grid gap-4 sm:grid-cols-2">
      <label className="space-y-1.5 sm:col-span-2">
        <span className="text-sm">Page</span>
        <select
          value={paymentPageId}
          onChange={(e) => setPaymentPageId(e.target.value)}
          className="input"
        >
          {pages.map((p) => (
            <option key={p.id} value={p.id}>
              {p.displayName} (@{p.username})
            </option>
          ))}
        </select>
      </label>
      <label className="space-y-1.5">
        <span className="text-sm">Title</span>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} className="input" placeholder="Website development" />
      </label>
      <label className="space-y-1.5">
        <span className="text-sm">Amount (ZEC)</span>
        <input required inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className="input" placeholder="25" />
      </label>
      <label className="space-y-1.5 sm:col-span-2">
        <span className="text-sm">Description</span>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="input resize-none" />
      </label>
      <label className="space-y-1.5">
        <span className="text-sm">Memo (optional)</span>
        <input value={memo} onChange={(e) => setMemo(e.target.value)} className="input" />
      </label>
      <label className="space-y-1.5">
        <span className="text-sm">Expires (optional)</span>
        <input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="input" />
      </label>
      {error && <p className="text-sm text-red-400 sm:col-span-2">{error}</p>}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-accent text-black px-5 py-2.5 text-sm font-medium hover:bg-accent-dim disabled:opacity-60"
        >
          {busy ? "Creating…" : "Create invoice"}
        </button>
      </div>
    </form>
  );
}
