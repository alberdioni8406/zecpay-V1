"use client";

import { useState } from "react";
import { PaymentRequest } from "@/components/PaymentRequest";

export function SupportTip({ address }: { address: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-card-border bg-card/80 p-5 ghost-glow">
      <p className="text-sm text-ghost leading-relaxed">
        If this tool helps you accept private payments, you can quietly support the work behind it.
      </p>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 w-full sm:w-auto rounded-full border border-accent/50 text-accent px-5 py-2.5 text-sm font-medium hover:bg-accent/10 transition-colors"
        >
          Send a private thank-you in ZEC
        </button>
      ) : (
        <div className="mt-5 space-y-3">
          <p className="text-xs text-muted">
            Optional tip — any amount. Opens a standard ZIP-321 request to the project support address.
          </p>
          <PaymentRequest
            address={address}
            amount={null}
            message="Support for ZecPay"
            label="ZecPay"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-xs text-muted hover:text-foreground"
          >
            Hide
          </button>
        </div>
      )}
    </div>
  );
}
