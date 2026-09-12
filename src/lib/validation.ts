import { z } from "zod";
import { isValidZcashAddress } from "./zip321";
import { RESERVED_USERNAMES } from "./config";

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Username must be at least 3 characters")
  .max(24, "Username must be at most 24 characters")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and single hyphens"
  )
  .refine((v) => !RESERVED_USERNAMES.has(v), "This username is reserved");

export const zcashAddressSchema = z
  .string()
  .trim()
  .min(1, "Zcash address is required")
  .refine(isValidZcashAddress, "Enter a valid Zcash address (Unified, Sapling, or transparent)");

export const amountSchema = z
  .number()
  .positive("Amount must be greater than 0")
  .max(21_000_000, "Amount exceeds the ZEC supply cap");

export const addressSlotSchema = z.object({
  type: z.enum(["unified", "orchard", "sapling", "transparent"]),
  address: zcashAddressSchema,
  label: z.string().max(40).optional(),
});

export const socialLinksSchema = z
  .object({
    website: z.string().url().optional().or(z.literal("")),
    twitter: z.string().optional(),
    github: z.string().optional(),
    nostr: z.string().optional(),
  })
  .optional();

export const paymentPageInputSchema = z.object({
  username: usernameSchema,
  displayName: z.string().trim().min(1).max(60),
  bio: z.string().trim().max(280).optional().or(z.literal("")),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  zcashAddress: zcashAddressSchema,
  addresses: z.array(addressSlotSchema).max(6).optional(),
  paymentButtons: z.array(amountSchema).min(1).max(8),
  socialLinks: socialLinksSchema,
  isPublished: z.boolean().optional(),
});

export const invoiceInputSchema = z.object({
  paymentPageId: z.string().min(1),
  title: z.string().trim().min(1).max(80),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  amount: amountSchema,
  memo: z.string().trim().max(200).optional().or(z.literal("")),
  expiresAt: z.string().datetime().optional().nullable(),
  manageSecret: z.string().min(16),
});
