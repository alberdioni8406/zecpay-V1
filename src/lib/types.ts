export type SocialLinks = {
  website?: string;
  twitter?: string;
  github?: string;
  nostr?: string;
};

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
};

export type PaymentPage = {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  zcashAddress: string;
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
