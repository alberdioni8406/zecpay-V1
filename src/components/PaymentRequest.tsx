"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Check, ExternalLink } from "lucide-react";
import { createPaymentRequest } from "@/lib/zip321";
import { formatZec } from "@/lib/utils";

type Props = {
  address: string;
  amount: number | null;
  memo?: string;
  message?: string;
  label?: string;
};

export function PaymentRequest({ address, amount, memo, message, label }: Props) {
  const [uri, setUri] = useState("");
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState<"uri" | "address" | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const next = createPaymentRequest(address, amount, { memo, message, label });
      setUri(next);
      setError("");
      QRCode.toDataURL(next, {
        errorCorrectionLevel: "M",
        margin: 2,
        width: 320,
        color: { dark: "#050505", light: "#ffffff" },
      }).then(setQr);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not build payment request");
      setUri("");
      setQr("");
    }
  }, [address, amount, memo, message, label]);

  async function copy(text: string, which: "uri" | "address") {
    await navigator.clipboard.writeText(text);
    setCopied(which);
    setTimeout(() => setCopied(null), 1600);
  }

  if (error) {
    return (
      <p className="text-sm text-red-400" role="alert">
        {error}
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {amount !== null && (
        <p className="text-center text-2xl font-semibold tracking-tight">
          {formatZec(amount)} <span className="text-muted text-lg">ZEC</span>
        </p>
      )}

      {qr && (
        <div className="flex justify-center">
          <img
            src={qr}
            alt="Zcash payment QR code"
            width={280}
            height={280}
            className="rounded-xl bg-white p-3 w-[min(100%,280px)] h-auto"
          />
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-muted">Payment request</p>
        <p className="break-all font-mono text-xs leading-relaxed text-muted bg-card border border-card-border rounded-lg p-3">
          {uri}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => copy(uri, "uri")}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-card-border px-3 py-2.5 text-sm hover:border-accent transition-colors"
        >
          {copied === "uri" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          Copy request
        </button>
        <button
          type="button"
          onClick={() => copy(address, "address")}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-card-border px-3 py-2.5 text-sm hover:border-accent transition-colors"
        >
          {copied === "address" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          Copy address
        </button>
        <a
          href={uri}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent text-black px-3 py-2.5 text-sm font-medium hover:bg-accent-dim transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          Open wallet
        </a>
      </div>

      <p className="text-xs text-muted leading-relaxed">
        Scan the QR with a ZIP-321 compatible wallet, or copy the request. If your wallet
        does not open from the link, paste the request or address manually. Payments go
        directly to the receiving address — ZecPay never holds funds.
      </p>
    </div>
  );
}
