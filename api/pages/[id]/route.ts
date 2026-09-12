import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { paymentPageInputSchema } from "@/lib/validation";
import { store } from "@/lib/store";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const page = await store.getPageById(id);
  if (!page || page.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
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
    });
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message === "USERNAME_TAKEN") {
      return NextResponse.json({ error: "Username is taken" }, { status: 409 });
    }
    return NextResponse.json({ error: "Could not update page" }, { status: 500 });
  }
}
