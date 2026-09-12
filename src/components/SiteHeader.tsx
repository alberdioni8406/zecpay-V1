import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { LogoutButton } from "./LogoutButton";

export async function SiteHeader() {
  const user = await getSessionUser();
  return (
    <header className="border-b border-card-border">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-accent font-mono text-lg tracking-tight">Ƶ</span>
          <span className="font-semibold tracking-tight">ZecPay</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link href="/dashboard" className="text-muted hover:text-foreground">
                Dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-muted hover:text-foreground">
                Sign in
              </Link>
              <Link
                href="/create"
                className="rounded-full bg-accent text-black px-4 py-1.5 font-medium hover:bg-accent-dim"
              >
                Create page
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
