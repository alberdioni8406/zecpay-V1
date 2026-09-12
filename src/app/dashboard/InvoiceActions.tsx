"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function InvoiceActions({
  publicId,
  status,
}: {
  publicId: string;
  status: string;
}) {
  const router = useRouter();
  const [txId, setTxId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function setStatus(next: string, requireTx = false) {
    setBusy(true);
    setError("");
    const res = await fetch(`/api/invoices/${publicId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: next,
        transactionId: requireTx ? txId.trim() || undefined : undefined,
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Update failed");
      return;
    }
    router.refresh();
  }

  if (status === "paid" || status === "cancelled") {
    return null;
  }

  return (
    <div className="space-y-2 border-t border-card-border pt-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => setStatus("awaiting_verification")}
          className="rounded-lg border border-card-border px-3 py-1.5 text-xs hover:border-muted disabled:opacity-60"
        >
          Mark awaiting verification
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => setStatus("cancelled")}
          className="rounded-lg border border-card-border px-3 py-1.5 text-xs hover:border-muted disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={txId}
          onChange={(e) => setTxId(e.target.value)}
          placeholder="Transaction id (required to mark paid)"
          className="input text-xs font-mono"
        />
        <button
          type="button"
          disabled={busy || !txId.trim()}
          onClick={() => setStatus("paid", true)}
          className="rounded-lg bg-accent/20 text-accent px-3 py-2 text-xs font-medium disabled:opacity-60"
        >
          Confirm paid
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
