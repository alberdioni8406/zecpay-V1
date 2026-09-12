import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { invoiceInputSchema } from "@/lib/validation";
import { newId, newPublicId, store } from "@/lib/store";
import type { Invoice } from "@/lib/types";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = invoiceInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const page = await store.getPageById(parsed.data.paymentPageId);
  if (!page || page.userId !== user.id) {
    return NextResponse.json({ error: "Payment page not found" }, { status: 404 });
  }

  const now = new Date().toISOString();
  const invoice: Invoice = {
    id: newId("inv"),
    publicId: newPublicId(),
    paymentPageId: page.id,
    title: parsed.data.title,
    description: parsed.data.description || undefined,
    amount: parsed.data.amount,
    currency: "ZEC",
    memo: parsed.data.memo || undefined,
    status: "pending",
    expiresAt: parsed.data.expiresAt ?? null,
    createdAt: now,
    paidAt: null,
    transactionId: null,
  };

  const created = await store.createInvoice(invoice);
  return NextResponse.json(created, { status: 201 });
}
