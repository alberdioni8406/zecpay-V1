import { NextResponse } from "next/server";
import { paymentPageInputSchema } from "@/lib/validation";
import { newId, store } from "@/lib/store";
import type { PaymentPage } from "@/lib/types";
import { clientKey, rateLimit } from "@/lib/rateLimit";
import { generateManageSecret, hashManageSecret } from "@/lib/tokens";

export async function POST(req: Request) {
  if (!rateLimit(clientKey(req, "pages"), 20)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json();
  const parsed = paymentPageInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const existing = await store.getPageByUsername(parsed.data.username);
  if (existing) {
    return NextResponse.json({ error: "Username is taken" }, { status: 409 });
  }

  const manageSecret = generateManageSecret();
  const now = new Date().toISOString();
  const page: PaymentPage = {
    id: newId("pg"),
    manageTokenHash: hashManageSecret(manageSecret),
    username: parsed.data.username,
    displayName: parsed.data.displayName,
    bio: parsed.data.bio || undefined,
    avatarUrl: parsed.data.avatarUrl || undefined,
    zcashAddress: parsed.data.zcashAddress.trim(),
    addresses: parsed.data.addresses,
    paymentButtons: parsed.data.paymentButtons,
    socialLinks: parsed.data.socialLinks,
    isPublished: parsed.data.isPublished ?? true,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const created = await store.createPage(page);
    return NextResponse.json(
      {
        id: created.id,
        username: created.username,
        displayName: created.displayName,
        isPublished: created.isPublished,
        manageSecret,
        managePath: `/manage?secret=${encodeURIComponent(manageSecret)}`,
      },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message === "USERNAME_TAKEN") {
      return NextResponse.json({ error: "Username is taken" }, { status: 409 });
    }
    return NextResponse.json({ error: "Could not create page" }, { status: 500 });
  }
}
