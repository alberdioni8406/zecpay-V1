"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/create";
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b border-card-border">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <span className="text-accent font-mono text-lg">Ƶ</span>
            <span className="font-semibold">ZecPay</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-sm space-y-5 rounded-2xl border border-card-border bg-card p-6"
        >
          <div>
            <h1 className="text-xl font-semibold">
              {mode === "login" ? "Sign in" : "Create account"}
            </h1>
            <p className="text-sm text-muted mt-1">
              Only needed to manage your payment page. Payers never sign in.
            </p>
          </div>
          <label className="block space-y-1.5">
            <span className="text-sm">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-card-border bg-background px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm">Password</span>
            <input
              type="password"
              required
              minLength={mode === "register" ? 8 : 1}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-card-border bg-background px-3 py-2.5 text-sm"
            />
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-accent text-black py-2.5 font-medium hover:bg-accent-dim disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="w-full text-sm text-muted hover:text-foreground"
          >
            {mode === "login" ? "Need an account? Register" : "Have an account? Sign in"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
