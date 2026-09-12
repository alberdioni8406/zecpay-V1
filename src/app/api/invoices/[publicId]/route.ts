import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import type { InvoiceStatus } from "@/lib/types";
import { verifyManageSecret } from "@/lib/tokens";

const ALLOWED_STATUSES: InvoiceStatus[] = [
  "pending",
  "awaiting_verification",
  "paid",
  "expired",
  "cancelled",
];

function isInvoiceStatus(value: unknown): value is InvoiceStatus {
  return typeof value === "string" && (ALLOWED_STATUSES as string[]).includes(value);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ publicId: string }> }
) {
  const { publicId } = await params;
  const invoice = await store.getInvoiceByPublicId(publicId);
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(invoice);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ publicId: string }> }
) {
  const { publicId } = await params;
  const invoice = await store.getInvoiceByPublicId(publicId);
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const page = await store.getPageById(invoice.paymentPageId);
  if (!page) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const secret = typeof body.manageSecret === "string" ? body.manageSecret : "";
  if (!verifyManageSecret(secret, page.manageTokenHash)) {
    return NextResponse.json({ error: "Invalid manage secret" }, { status: 401 });
  }

  const statusRaw = body.status as unknown;
  const transactionId = body.transactionId as string | undefined;

  if (statusRaw !== undefined && !isInvoiceStatus(statusRaw)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const status: InvoiceStatus | undefined = isInvoiceStatus(statusRaw)
    ? statusRaw
    : undefined;

  if (status === "paid" && !transactionId && !invoice.transactionId) {
    return NextResponse.json(
      {
        error:
          "Refusing to mark paid without a transaction id. Shielded payments cannot be auto-verified here.",
      },
      { status: 400 }
    );
  }

  const updated = await store.updateInvoice(invoice.id, {
    status: status ?? invoice.status,
    transactionId: transactionId ?? invoice.transactionId,
    paidAt: status === "paid" ? new Date().toISOString() : invoice.paidAt,
  });

  return NextResponse.json(updated);
}
