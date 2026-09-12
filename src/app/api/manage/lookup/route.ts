import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { hashManageSecret } from "@/lib/tokens";

export async function POST(req: Request) {
  const body = await req.json();
  const secret = typeof body.secret === "string" ? body.secret.trim() : "";
  if (secret.length < 16) {
    return NextResponse.json({ error: "Invalid manage secret" }, { status: 400 });
  }

  const hash = hashManageSecret(secret);
  const page = await store.getPageByManageTokenHash(hash);
  if (!page) {
    return NextResponse.json({ error: "No page found for this secret" }, { status: 404 });
  }

  const invoices = await store.getInvoicesByPage(page.id);
  const { manageTokenHash: _, ...safe } = page;
  return NextResponse.json({ page: safe, invoices });
}
