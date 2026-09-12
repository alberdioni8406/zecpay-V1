/**
 * ZIP-321 Payment Request URI helpers
 * Spec: https://zips.z.cash/zip-0321/
 *
 * This module implements the core URI construction for single-recipient
 * Zcash payments. It does not invent a proprietary format.
 */

/**
 * Encode a UTF-8 string as base64url without padding (RFC 4648 §5).
 * Used for memo fields.
 */
export function memoToBase64Url(memo: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(memo, "utf8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
  // Browser fallback
  const bytes = new TextEncoder().encode(memo);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Validate a Zcash address at a basic structural level.
 * Accepts transparent (t1/t3), Sapling (zs), and Unified (u1) addresses.
 * Full cryptographic validation should be done by wallets.
 */
export function isValidZcashAddress(address: string): boolean {
  if (!address || typeof address !== "string") return false;
  const trimmed = address.trim();
  // Transparent
  if (/^t[13][a-km-zA-HJ-NP-Z1-9]{33}$/.test(trimmed)) return true;
  // Sapling
  if (/^zs1[a-z0-9]{75,}$/.test(trimmed)) return true;
  // Unified Address (Bech32m)
  if (/^u1[a-z0-9]{50,}$/.test(trimmed)) return true;
  // Testnet variants
  if (/^tm[a-km-zA-HJ-NP-Z1-9]{33}$/.test(trimmed)) return true;
  if (/^ztestsapling1[a-z0-9]{75,}$/.test(trimmed)) return true;
  if (/^utest1[a-z0-9]{50,}$/.test(trimmed)) return true;
  return false;
}

export interface PaymentRequestOptions {
  address: string;
  amount?: number; // in ZEC
  memo?: string;
  message?: string;
  label?: string;
}

/**
 * Build a ZIP-321 payment URI for a single recipient.
 *
 * Example:
 *   zcash:u1...?amount=0.1&memo=...&message=Tip
 *
 * Amount is decimal ZEC with up to 8 fractional digits.
 * Memo is base64url-encoded and limited to 512 bytes decoded.
 */
export function buildZip321Uri(opts: PaymentRequestOptions): string {
  const { address, amount, memo, message, label } = opts;

  if (!isValidZcashAddress(address)) {
    throw new Error("Invalid Zcash address");
  }

  const params: string[] = [];

  if (amount !== undefined && amount !== null) {
    if (amount < 0 || amount > 21_000_000) {
      throw new Error("Amount out of valid range (0 – 21 000 000 ZEC)");
    }
    // Format with up to 8 decimal places, strip trailing zeros
    const formatted = Number(amount.toFixed(8)).toString();
    params.push(`amount=${formatted}`);
  }

  if (memo) {
    const encoded = memoToBase64Url(memo);
    // Decoded memo must be ≤ 512 bytes
    const decodedLen =
      typeof Buffer !== "undefined"
        ? Buffer.from(encoded, "base64").length
        : atob(encoded.replace(/-/g, "+").replace(/_/g, "/")).length;
    if (decodedLen > 512) {
      throw new Error("Memo exceeds 512 bytes");
    }
    params.push(`memo=${encoded}`);
  }

  if (message) {
    params.push(`message=${encodeURIComponent(message)}`);
  }

  if (label) {
    params.push(`label=${encodeURIComponent(label)}`);
  }

  const query = params.length > 0 ? `?${params.join("&")}` : "";
  return `zcash:${address}${query}`;
}

/**
 * Convenience helper used by payment pages and invoices.
 */
export function createPaymentRequest(
  address: string,
  amount: number | null,
  options: { memo?: string; message?: string; label?: string } = {}
): string {
  return buildZip321Uri({
    address,
    amount: amount ?? undefined,
    ...options,
  });
}
