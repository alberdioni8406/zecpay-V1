import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 text-center">
      <p className="text-accent font-mono mb-3">404</p>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-muted mt-2 text-sm">This payment page or invoice does not exist.</p>
      <Link href="/" className="mt-6 text-sm text-accent hover:underline">
        Back home
      </Link>
    </div>
  );
}
