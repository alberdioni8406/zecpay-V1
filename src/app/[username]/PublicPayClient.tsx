"use client";

import { useState } from "react";
import { PaymentRequest } from "@/components/PaymentRequest";
import { formatZec } from "@/lib/utils";

type Props = {
  displayName: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
  zcashAddress: string;
  paymentButtons: number[];
};

export function PublicPayClient({
  displayName,
  username,
  bio,
  avatarUrl,
  zcashAddress,
  paymentButtons,
}: Props) {
  const [selected, setSelected] = useState<number | "custom" | null>(null);
  const [custom, setCustom] = useState("");
  const customAmount = Number(custom);
  const amount =
    selected === "custom"
      ? Number.isFinite(customAmount) && customAmount > 0
        ? customAmount
        : null
      : selected;

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 shrink-0 rounded-full bg-card border border-card-border overflow-hidden flex items-center justify-center text-accent text-xl font-semibold">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            displayName.slice(0, 1).toUpperCase()
          )}
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{displayName}</h1>
          <p className="text-sm text-muted">@{username}</p>
          {bio && <p className="mt-3 text-sm leading-relaxed text-muted">{bio}</p>}
        </div>
      </div>

      <div>
        <h2 className="font-medium mb-3">Send Zcash</h2>
        <div className="grid grid-cols-2 gap-2">
          {paymentButtons.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setSelected(amt)}
              className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                selected === amt
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-card-border hover:border-muted"
              }`}
            >
              {formatZec(amt)} ZEC
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSelected("custom")}
            className={`col-span-2 rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
              selected === "custom"
                ? "border-accent bg-accent/10 text-accent"
                : "border-card-border hover:border-muted"
            }`}
          >
            Custom amount
          </button>
        </div>
      </div>

      {selected === "custom" && (
        <label className="block space-y-1.5">
          <span className="text-sm">Amount in ZEC</span>
          <input
            inputMode="decimal"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="0.25"
            className="input"
          />
        </label>
      )}

      {amount !== null && selected !== null && (
        <div className="rounded-2xl border border-card-border bg-card p-5">
          <PaymentRequest
            address={zcashAddress}
            amount={amount}
            message={`Payment to ${displayName}`}
            label={displayName}
          />
        </div>
      )}
    </div>
  );
}
