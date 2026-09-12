import { NextResponse } from "next/server";
import { paymentPageInputSchema } from "@/lib/validation";
import { store } from "@/lib/store";
import { verifyManageSecret } from "@/lib/tokens";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const page = await store.getPageById(id);
  if (!page) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const secret = typeof body.manageSecret === "string" ? body.manageSecret : "";
  if (!verifyManageSecret(secret, page.manageTokenHash)) {
    return NextResponse.json({ error: "Invalid manage secret" }, { status: 401 });
  }

  const parsed = paymentPageInputSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  try {
    const updated = await store.updatePage(id, {
      ...parsed.data,
      bio: parsed.data.bio || undefined,
      avatarUrl: parsed.data.avatarUrl || undefined,
      manageTokenHash: page.manageTokenHash,
    });
    const { manageTokenHash: _h, ...safe } = updated;
    return NextResponse.json(safe);
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message === "USERNAME_TAKEN") {
      return NextResponse.json({ error: "Username is taken" }, { status: 409 });
    }
    return NextResponse.json({ error: "Could not update page" }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const page = await store.getPageById(id);
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const secret = new URL(req.url).searchParams.get("secret") || "";
  if (!verifyManageSecret(secret, page.manageTokenHash)) {
    return NextResponse.json({ error: "Invalid manage secret" }, { status: 401 });
  }

  const { manageTokenHash: _h, ...safe } = page;
  return NextResponse.json(safe);
}
