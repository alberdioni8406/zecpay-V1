import { createHash, randomBytes } from "crypto";

/** High-entropy manage secret shown once at page creation. */
export function generateManageSecret(): string {
  return randomBytes(24).toString("base64url");
}

export function hashManageSecret(secret: string): string {
  return createHash("sha256").update(secret).digest("hex");
}

export function verifyManageSecret(secret: string, hash: string): boolean {
  if (!secret || !hash) return false;
  const incoming = hashManageSecret(secret);
  // constant-time-ish compare
  if (incoming.length !== hash.length) return false;
  let ok = 0;
  for (let i = 0; i < incoming.length; i++) {
    ok |= incoming.charCodeAt(i) ^ hash.charCodeAt(i);
  }
  return ok === 0;
}
