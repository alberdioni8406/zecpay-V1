export type SocialLinks = {
  website?: string;
  twitter?: string;
  github?: string;
  nostr?: string;
};

/** Optional legacy user type — no longer required for page creation. */
export type User = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
};

export type AddressSlot = {
  type: "unified" | "orchard" | "sapling" | "transparent";
  address: string;
  label?: string;
};

export type PaymentPage = {
  id: string;
  /** SHA-256 of the one-time manage secret. Never store the raw secret. */
  manageTokenHash: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  /** Preferred receiving address (usually Unified). */
  zcashAddress: string;
  /** Optional extra receivers: Orchard, Sapling, transparent, etc. */
  addresses?: AddressSlot[];
  paymentButtons: number[];
  socialLinks?: SocialLinks;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type InvoiceStatus =
  | "pending"
  | "awaiting_verification"
  | "paid"
  | "expired"
  | "cancelled";

export type Invoice = {
  id: string;
  publicId: string;
  paymentPageId: string;
  title: string;
  description?: string;
  amount: number;
  currency: "ZEC";
  memo?: string;
  status: InvoiceStatus;
  expiresAt?: string | null;
  createdAt: string;
  paidAt?: string | null;
  transactionId?: string | null;
};
