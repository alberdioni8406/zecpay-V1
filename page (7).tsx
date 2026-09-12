"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PagePreview } from "@/components/PagePreview";
import { DEFAULT_PAYMENT_BUTTONS } from "@/lib/config";

type PageData = {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  zcashAddress: string;
  paymentButtons: number[];
  isPublished: boolean;
};

export default function EditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [zcashAddress, setZcashAddress] = useState("");
  const [amountsText, setAmountsText] = useState(DEFAULT_PAYMENT_BUTTONS.join(", "));
  const [isPublished, setIsPublished] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const paymentButtons = useMemo(() => {
    return amountsText
      .split(/[,\s]+/)
      .map((s) => Number(s))
      .filter((n) => Number.isFinite(n) && n > 0);
  }, [amountsText]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/pages");
      if (res.status === 401) {
        router.push("/login?next=/dashboard");
        return;
      }
      const pages = (await res.json()) as PageData[];
      const page = pages.find((p) => p.id === id);
      if (!page) {
        setError("Page not found");
        setLoading(false);
        return;
      }
      setUsername(page.username);
      setDisplayName(page.displayName);
      setBio(page.bio || "");
      setAvatarUrl(page.avatarUrl || "");
      setZcashAddress(page.zcashAddress);
      setAmountsText(page.paymentButtons.join(", "));
      setIsPublished(page.isPublished);
      setLoading(false);
    }
    load();
  }, [id, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch(`/api/pages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        displayName,
        bio,
        avatarUrl,
        zcashAddress,
        paymentButtons: paymentButtons.length ? paymentButtons : DEFAULT_PAYMENT_BUTTONS,
        isPublished,
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Could not save");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center text-muted text-sm">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b border-card-border">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-sm text-muted hover:text-foreground">
            ← Dashboard
          </Link>
          <span className="font-semibold">Edit page</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-10 grid gap-8 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-5">
          <label className="block space-y-1.5">
            <span className="text-sm">Username</span>
            <input required value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} className="input" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm">Display name</span>
            <input required value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="input" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm">Bio</span>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} maxLength={280} className="input resize-none" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm">Avatar URL</span>
            <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="input" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm">Zcash receiving address</span>
            <input required value={zcashAddress} onChange={(e) => setZcashAddress(e.target.value)} className="input font-mono text-xs sm:text-sm" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm">Payment amounts (ZEC)</span>
            <input value={amountsText} onChange={(e) => setAmountsText(e.target.value)} className="input" />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
            Published (visible at /{username || "…"})
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-accent text-black px-6 py-3 font-medium hover:bg-accent-dim disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save changes"}
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
