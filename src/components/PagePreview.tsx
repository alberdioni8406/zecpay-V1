import { formatZec } from "@/lib/utils";

type Props = {
  displayName: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
  paymentButtons: number[];
};

export function PagePreview({
  displayName,
  username,
  bio,
  avatarUrl,
  paymentButtons,
}: Props) {
  return (
    <div className="rounded-2xl border border-card-border bg-card p-6 space-y-5">
      <p className="text-xs uppercase tracking-wide text-muted">Live preview</p>
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-background border border-card-border overflow-hidden flex items-center justify-center text-accent font-semibold">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            (displayName || "?").slice(0, 1).toUpperCase()
          )}
        </div>
        <div>
          <p className="font-medium">{displayName || "Display name"}</p>
          <p className="text-sm text-muted">@{username || "username"}</p>
        </div>
      </div>
      <p className="text-sm text-muted leading-relaxed">
        {bio || "Short biography appears here."}
      </p>
      <p className="text-sm font-medium">Send Zcash</p>
      <div className="grid grid-cols-2 gap-2">
        {paymentButtons.map((amt) => (
          <div
            key={amt}
            className="rounded-lg border border-card-border px-3 py-2.5 text-center text-sm"
          >
            {formatZec(amt)} ZEC
          </div>
        ))}
        <div className="rounded-lg border border-dashed border-card-border px-3 py-2.5 text-center text-sm text-muted col-span-2">
          Custom amount
        </div>
      </div>
    </div>
  );
}
