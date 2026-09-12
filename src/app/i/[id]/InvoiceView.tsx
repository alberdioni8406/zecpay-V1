"use client";

import { useState } from "react";
import { PaymentRequest } from "@/components/PaymentRequest";
import { formatZec } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  amount: number;
  memo?: string;
  status: string;
  address: string;
  payee: string;
};

const STATUS_COPY: Record<string, { label: string; note: string }> = {
  pending: {
    label: "Waiting for payment",
    note: "Send the exact amount from your own Zcash wallet. Status will not automatically flip to paid for shielded transfers unless a reliable verification signal is configured.",
  },
  awaiting_verification: {
    label: "Awaiting verification",
    note: "A payment may have been sent. Shielded Zcash cannot be reliably confirmed by this app without a viewing key or trusted indexer. Do not treat this as a confirmed receipt.",
  },
  paid: {
    label: "Payment received",
    note: "This status is only shown when a technically valid confirmation exists.",
  },
  expired: {
    label: "Expired",
    note: "This invoice is no longer requesting payment.",
  },
  cancelled: {
    label: "Cancelled",
    note: "This invoice is no longer requesting payment.",
  },
};

export function InvoiceView({
  title,
  description,
  amount,
  memo,
  status,
  address,
  payee,
}: Props) {
  const [showPay, setShowPay] = useState(status === "pending");
  const copy = STATUS_COPY[status] || STATUS_COPY.pending;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-3xl font-semibold">
          {formatZec(amount)} <span className="text-lg text-muted">ZEC</span>
        </p>
        {description && (
          <p className="mt-3 text-muted leading-relaxed">{description}</p>
        )}
      </div>

      <div className="rounded-xl border border-card-border bg-card px-4 py-3">
        <p className="text-sm font-medium">{copy.label}</p>
        <p className="text-xs text-muted mt-1 leading-relaxed">{copy.note}</p>
      </div>

      {status === "pending" && (
        <>
          {!showPay && (
            <button
              type="button"
              onClick={() => setShowPay(true)}
              className="w-full rounded-full bg-accent text-black py-3 font-medium hover:bg-accent-dim"
            >
              Pay with Zcash
            </button>
          )}
          {showPay && (
            <div className="rounded-2xl border border-card-border bg-card p-5">
              <PaymentRequest
                address={address}
                amount={amount}
                memo={memo}
                message={title}
                label={payee}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
