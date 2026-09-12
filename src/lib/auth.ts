import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { store, newId } from "./store";
import type { User } from "./types";

const COOKIE = "zecpay_session";

function secretKey() {
  const secret = process.env.AUTH_SECRET || "dev-only-change-me-32-chars-min!!";
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string) {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secretKey());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE);
}

export async function getSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (!payload.sub) return null;
    const user = await store.getUserById(payload.sub);
    return user ?? null;
  } catch {
    return null;
  }
}

export async function registerUser(email: string, password: string): Promise<User> {
  const existing = await store.getUserByEmail(email);
  if (existing) throw new Error("EMAIL_TAKEN");
  const now = new Date().toISOString();
  const user: User = {
    id: newId("usr"),
    email: email.toLowerCase(),
    passwordHash: await hashPassword(password),
    createdAt: now,
    updatedAt: now,
  };
  return store.createUser(user);
}
