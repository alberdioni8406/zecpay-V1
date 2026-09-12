
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-card-border">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-accent font-mono text-lg">Ƶ</span>
          <span className="font-semibold">ZecPay</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/manage" className="text-muted hover:text-foreground transition-colors">
            Manage page
          </Link>
          <Link
            href="/create"
            className="rounded-full bg-accent text-black px-4 py-1.5 font-medium hover:bg-accent-dim transition-colors"
          >
            Create page
          </Link>
        </nav>
      </div>
    </header>
  );
}
