import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { store } from "@/lib/store";
import { getAppUrl } from "@/lib/config";
import { CreateInvoiceForm } from "./CreateInvoiceForm";
import { LogoutButton } from "@/components/LogoutButton";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { InvoiceActions } from "./InvoiceActions";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard");

  const pages = await store.getPagesByUser(user.id);
  const invoices = (
    await Promise.all(pages.map((p) => store.getInvoicesByPage(p.id)))
  ).flat();
  const base = getAppUrl();

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b border-card-border">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-accent font-mono text-lg">Ƶ</span>
            <span className="font-semibold">ZecPay</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted hidden sm:inline">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-10 space-y-10">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <Link
            href="/create"
            className="rounded-full bg-accent text-black px-4 py-2 text-sm font-medium"
          >
            New page
          </Link>
        </div>

        <section className="space-y-4">
          <h2 className="font-medium">Payment pages</h2>
          {pages.length === 0 && (
            <p className="text-sm text-muted">
              No pages yet.{" "}
              <Link href="/create" className="text-accent">
                Create one
              </Link>
              .
            </p>
          )}
          <div className="grid gap-3">
            {pages.map((p) => {
              const url = `${base}/${p.username}`;
              return (
                <div
                  key={p.id}
                  className="rounded-xl border border-card-border bg-card p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {p.displayName}{" "}
                      {!p.isPublished && (
                        <span className="text-xs text-muted font-normal">(unpublished)</span>
                      )}
                    </p>
                    <p className="text-sm text-muted break-all">{url}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <CopyLinkButton url={url} />
                    <Link href={`/${p.username}`} className="text-sm text-accent hover:underline">
                      Open
                    </Link>
                    <Link
                      href={`/dashboard/edit/${p.id}`}
                      className="text-sm text-muted hover:text-foreground"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {pages[0] && (
          <section className="space-y-4">
            <h2 className="font-medium">Create invoice</h2>
            <CreateInvoiceForm
              pages={pages.map((p) => ({
                id: p.id,
                username: p.username,
                displayName: p.displayName,
              }))}
            />
          </section>
        )}

        <section className="space-y-4">
          <h2 className="font-medium">Invoices</h2>
          {invoices.length === 0 && (
            <p className="text-sm text-muted">No invoices yet.</p>
          )}
          <div className="grid gap-3">
            {invoices.map((inv) => {
              const url = `${base}/i/${inv.publicId}`;
              return (
                <div
                  key={inv.id}
                  className="rounded-xl border border-card-border bg-card p-4 space-y-3"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-medium">{inv.title}</p>
                      <p className="text-sm text-muted">
                        {inv.amount} ZEC · {inv.status}
                      </p>
                      <p className="text-xs text-muted break-all mt-1">{url}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <CopyLinkButton url={url} />
                      <Link
                        href={`/i/${inv.publicId}`}
                        className="text-sm text-accent hover:underline"
                      >
                        Open
                      </Link>
                    </div>
                  </div>
                  <InvoiceActions publicId={inv.publicId} status={inv.status} />
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted leading-relaxed max-w-2xl">
            Marking an invoice as paid requires a transaction id you observed
            yourself. ZecPay does not auto-confirm shielded payments.
          </p>
        </section>
      </main>
    </div>
  );
}
