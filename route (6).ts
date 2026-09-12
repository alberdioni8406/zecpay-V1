import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { store } from "@/lib/store";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ publicId: string }> }
) {
  const { publicId } = await params;
  const invoice = await store.getInvoiceByPublicId(publicId);
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(invoice);
}

/** Operator-only: mark awaiting verification or paid only with explicit action. */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ publicId: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { publicId } = await params;
  const invoice = await store.getInvoiceByPublicId(publicId);
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const page = await store.getPageById(invoice.paymentPageId);
  if (!page || page.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const status = body.status as string | undefined;
  const transactionId = body.transactionId as string | undefined;

  if (status && !["pending", "awaiting_verification", "paid", "expired", "cancelled"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  // Paid only allowed when operator explicitly confirms with a tx id note.
  // This is not blockchain proof — it records an operator decision.
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
