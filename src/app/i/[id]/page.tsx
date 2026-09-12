import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { store } from "@/lib/store";
import { getAppUrl } from "@/lib/config";
import { InvoiceView } from "./InvoiceView";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const invoice = await store.getInvoiceByPublicId(id);
  if (!invoice) return { title: "Invoice not found" };
  return {
    title: `${invoice.title} | ZecPay`,
    description: invoice.description || `Pay ${invoice.amount} ZEC with Zcash.`,
    openGraph: {
      title: invoice.title,
      description: invoice.description || undefined,
      url: `${getAppUrl()}/i/${invoice.publicId}`,
    },
  };
}

export default async function InvoicePage({ params }: Props) {
  const { id } = await params;
  const invoice = await store.getInvoiceByPublicId(id);
  if (!invoice) notFound();
  const page = await store.getPageById(invoice.paymentPageId);
  if (!page) notFound();

  const expired =
    invoice.expiresAt && new Date(invoice.expiresAt).getTime() < Date.now();
  const status = expired && invoice.status === "pending" ? "expired" : invoice.status;

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b border-card-border">
        <div className="mx-auto max-w-lg px-4 py-4 flex items-center gap-2">
          <span className="text-accent font-mono">Ƶ</span>
          <span className="text-sm text-muted">Invoice</span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-lg px-4 py-10">
        <InvoiceView
          title={invoice.title}
          description={invoice.description}
          amount={invoice.amount}
          memo={invoice.memo}
          status={status}
          address={page.zcashAddress}
          payee={page.displayName}
        />
      </main>
    </div>
  );
}
