import { randomBytes } from "crypto";
import { prisma } from "./db";
import type { AddressSlot, Invoice, InvoiceStatus, PaymentPage, SocialLinks } from "./types";

export function newId(prefix = ""): string {
  const id = randomBytes(8).toString("hex");
  return prefix ? `${prefix}_${id}` : id;
}

export function newPublicId(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  const bytes = randomBytes(6);
  for (let i = 0; i < 6; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

function mapPage(row: {
  id: string;
  manageTokenHash: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  zcashAddress: string;
  addresses: unknown;
  paymentButtons: unknown;
  socialLinks: unknown;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}): PaymentPage {
  return {
    id: row.id,
    manageTokenHash: row.manageTokenHash,
    username: row.username,
    displayName: row.displayName,
    avatarUrl: row.avatarUrl ?? undefined,
    bio: row.bio ?? undefined,
    zcashAddress: row.zcashAddress,
    addresses: (row.addresses as AddressSlot[] | null) ?? undefined,
    paymentButtons: (row.paymentButtons as number[]) ?? [],
    socialLinks: (row.socialLinks as SocialLinks | null) ?? undefined,
    isPublished: row.isPublished,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function mapInvoice(row: {
  id: string;
  publicId: string;
  paymentPageId: string;
  title: string;
  description: string | null;
  amount: number;
  currency: string;
  memo: string | null;
  status: string;
  expiresAt: Date | null;
  createdAt: Date;
  paidAt: Date | null;
  transactionId: string | null;
}): Invoice {
  return {
    id: row.id,
    publicId: row.publicId,
    paymentPageId: row.paymentPageId,
    title: row.title,
    description: row.description ?? undefined,
    amount: row.amount,
    currency: "ZEC",
    memo: row.memo ?? undefined,
    status: row.status as InvoiceStatus,
    expiresAt: row.expiresAt ? row.expiresAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
    paidAt: row.paidAt ? row.paidAt.toISOString() : null,
    transactionId: row.transactionId,
  };
}

export const store = {
  async getPageByUsername(username: string): Promise<PaymentPage | undefined> {
    const row = await prisma.paymentPage.findUnique({
      where: { username: username.toLowerCase() },
    });
    return row ? mapPage(row) : undefined;
  },

  async getPageById(id: string): Promise<PaymentPage | undefined> {
    const row = await prisma.paymentPage.findUnique({ where: { id } });
    return row ? mapPage(row) : undefined;
  },

  async getPageByManageTokenHash(hash: string): Promise<PaymentPage | undefined> {
    const row = await prisma.paymentPage.findFirst({
      where: { manageTokenHash: hash },
    });
    return row ? mapPage(row) : undefined;
  },

  async createPage(page: PaymentPage): Promise<PaymentPage> {
    const existing = await prisma.paymentPage.findUnique({
      where: { username: page.username.toLowerCase() },
    });
    if (existing) throw new Error("USERNAME_TAKEN");

    const row = await prisma.paymentPage.create({
      data: {
        id: page.id,
        manageTokenHash: page.manageTokenHash,
        username: page.username.toLowerCase(),
        displayName: page.displayName,
        avatarUrl: page.avatarUrl ?? null,
        bio: page.bio ?? null,
        zcashAddress: page.zcashAddress,
        addresses: page.addresses ?? undefined,
        paymentButtons: page.paymentButtons,
        socialLinks: page.socialLinks ?? undefined,
        isPublished: page.isPublished,
      },
    });
    return mapPage(row);
  },

  async updatePage(id: string, patch: Partial<PaymentPage>): Promise<PaymentPage> {
    if (patch.username) {
      const clash = await prisma.paymentPage.findFirst({
        where: { username: patch.username.toLowerCase(), NOT: { id } },
      });
      if (clash) throw new Error("USERNAME_TAKEN");
    }

    try {
      const row = await prisma.paymentPage.update({
        where: { id },
        data: {
          ...(patch.username !== undefined
            ? { username: patch.username.toLowerCase() }
            : {}),
          ...(patch.displayName !== undefined ? { displayName: patch.displayName } : {}),
          ...(patch.bio !== undefined ? { bio: patch.bio || null } : {}),
          ...(patch.avatarUrl !== undefined ? { avatarUrl: patch.avatarUrl || null } : {}),
          ...(patch.zcashAddress !== undefined ? { zcashAddress: patch.zcashAddress } : {}),
          ...(patch.addresses !== undefined ? { addresses: patch.addresses } : {}),
          ...(patch.paymentButtons !== undefined
            ? { paymentButtons: patch.paymentButtons }
            : {}),
          ...(patch.socialLinks !== undefined ? { socialLinks: patch.socialLinks } : {}),
          ...(patch.isPublished !== undefined ? { isPublished: patch.isPublished } : {}),
          ...(patch.manageTokenHash !== undefined
            ? { manageTokenHash: patch.manageTokenHash }
            : {}),
        },
      });
      return mapPage(row);
    } catch {
      throw new Error("NOT_FOUND");
    }
  },

  async getInvoiceByPublicId(publicId: string): Promise<Invoice | undefined> {
    const row = await prisma.invoice.findUnique({ where: { publicId } });
    return row ? mapInvoice(row) : undefined;
  },

  async getInvoicesByPage(paymentPageId: string): Promise<Invoice[]> {
    const rows = await prisma.invoice.findMany({
      where: { paymentPageId },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(mapInvoice);
  },

  async createInvoice(invoice: Invoice): Promise<Invoice> {
    const row = await prisma.invoice.create({
      data: {
        id: invoice.id,
        publicId: invoice.publicId,
        paymentPageId: invoice.paymentPageId,
        title: invoice.title,
        description: invoice.description ?? null,
        amount: invoice.amount,
        currency: "ZEC",
        memo: invoice.memo ?? null,
        status: invoice.status,
        expiresAt: invoice.expiresAt ? new Date(invoice.expiresAt) : null,
        paidAt: invoice.paidAt ? new Date(invoice.paidAt) : null,
        transactionId: invoice.transactionId ?? null,
      },
    });
    return mapInvoice(row);
  },

  async updateInvoice(id: string, patch: Partial<Invoice>): Promise<Invoice> {
    try {
      const row = await prisma.invoice.update({
        where: { id },
        data: {
          ...(patch.status !== undefined ? { status: patch.status } : {}),
          ...(patch.transactionId !== undefined
            ? { transactionId: patch.transactionId }
            : {}),
          ...(patch.paidAt !== undefined
            ? { paidAt: patch.paidAt ? new Date(patch.paidAt) : null }
            : {}),
          ...(patch.title !== undefined ? { title: patch.title } : {}),
          ...(patch.description !== undefined
            ? { description: patch.description ?? null }
            : {}),
        },
      });
      return mapInvoice(row);
    } catch {
      throw new Error("NOT_FOUND");
    }
  },
};
