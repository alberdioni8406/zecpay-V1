export const APP_NAME = "ZecPay";

export function getAppUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

export const RESERVED_USERNAMES = new Set([
  "create",
  "login",
  "register",
  "dashboard",
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
  "static",
  "favicon.ico",
]);

export const DEFAULT_PAYMENT_BUTTONS = [0.01, 0.1, 1];
