export const APP_NAME = "ZecPay";

export function getAppUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

/** Optional project support address — never required for the product to work. */
export function getSupportZecAddress(): string | null {
  const a = process.env.NEXT_PUBLIC_SUPPORT_ZEC_ADDRESS?.trim();
  return a && a.length > 10 ? a : null;
}

export const RESERVED_USERNAMES = new Set([
  "create",
  "login",
  "register",
  "dashboard",
  "manage",
  "i",
  "api",
  "about",
  "how",
  "og",
  "admin",
  "settings",
  "account",
  "invoices",
  "pay",
  "support",
  "privacy",
  "static",
  "favicon.ico",
]);

export const DEFAULT_PAYMENT_BUTTONS = [0.01, 0.1, 1];
