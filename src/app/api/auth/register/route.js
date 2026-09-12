import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validation";
import { createSession, registerUser } from "@/lib/auth";
import { clientKey, rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  if (!rateLimit(clientKey(req, "register"), 8)) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const user = await registerUser(parsed.data.email, parsed.data.password);
    await createSession(user.id);
    return NextResponse.json({ id: user.id, email: user.email });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message === "EMAIL_TAKEN") {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    return NextResponse.json({ error: "Could not register" }, { status: 500 });
  }
}
