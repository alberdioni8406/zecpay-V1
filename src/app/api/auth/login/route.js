import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation";
import { createSession, verifyPassword } from "@/lib/auth";
import { store } from "@/lib/store";
import { clientKey, rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  if (!rateLimit(clientKey(req, "login"), 10)) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
    }
    const user = await store.getUserByEmail(parsed.data.email);
    if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    await createSession(user.id);
    return NextResponse.json({ id: user.id, email: user.email });
  } catch {
    return NextResponse.json({ error: "Could not sign in" }, { status: 500 });
  }
}
