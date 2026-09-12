import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";
import type { Invoice, PaymentPage, User } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const PAGES_FILE = path.join(DATA_DIR, "pages.json");
const INVOICES_FILE = path.join(DATA_DIR, "invoices.json");

type Tables = {
  users: User[];
  pages: PaymentPage[];
  invoices: Invoice[];
};

async function ensureFiles() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  for (const file of [USERS_FILE, PAGES_FILE, INVOICES_FILE]) {
    try {
      await fs.access(file);
    } catch {
      await fs.writeFile(file, "[]\n", "utf8");
    }
  }
}

async function readJson<T>(file: string): Promise<T[]> {
  await ensureFiles();
  const raw = await fs.readFile(file, "utf8");
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

async function writeJson<T>(file: string, data: T[]) {
  await ensureFiles();
  await fs.writeFile(file, JSON.stringify(data, null, 2) + "\n", "utf8");
}

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

export const store = {
  async getUserByEmail(email: string): Promise<User | undefined> {
    const users = await readJson<User>(USERS_FILE);
    return users.find((u) => u.email === email.toLowerCase());
  },

  async getUserById(id: string): Promise<User | undefined> {
    const users = await readJson<User>(USERS_FILE);
    return users.find((u) => u.id === id);
  },

  async createUser(user: User): Promise<User> {
    const users = await readJson<User>(USERS_FILE);
    if (users.some((u) => u.email === user.email)) {
      throw new Error("EMAIL_TAKEN");
    }
    users.push(user);
    await writeJson(USERS_FILE, users);
    return user;
  },

  async getPageByUsername(username: string): Promise<PaymentPage | undefined> {
    const pages = await readJson<PaymentPage>(PAGES_FILE);
    return pages.find((p) => p.username === username.toLowerCase());
  },

  async getPageById(id: string): Promise<PaymentPage | undefined> {
    const pages = await readJson<PaymentPage>(PAGES_FILE);
    return pages.find((p) => p.id === id);
  },

  async getPagesByUser(userId: string): Promise<PaymentPage[]> {
    const pages = await readJson<PaymentPage>(PAGES_FILE);
    return pages.filter((p) => p.userId === userId);
  },

  async createPage(page: PaymentPage): Promise<PaymentPage> {
    const pages = await readJson<PaymentPage>(PAGES_FILE);
    if (pages.some((p) => p.username === page.username)) {
      throw new Error("USERNAME_TAKEN");
    }
    pages.push(page);
    await writeJson(PAGES_FILE, pages);
    return page;
  },

  async updatePage(id: string, patch: Partial<PaymentPage>): Promise<PaymentPage> {
    const pages = await readJson<PaymentPage>(PAGES_FILE);
    const idx = pages.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("NOT_FOUND");
    if (
      patch.username &&
      pages.some((p) => p.username === patch.username && p.id !== id)
    ) {
      throw new Error("USERNAME_TAKEN");
    }
    pages[idx] = { ...pages[idx], ...patch, updatedAt: new Date().toISOString() };
    await writeJson(PAGES_FILE, pages);
    return pages[idx];
  },

  async getInvoiceByPublicId(publicId: string): Promise<Invoice | undefined> {
    const invoices = await readJson<Invoice>(INVOICES_FILE);
    return invoices.find((i) => i.publicId === publicId);
  },

  async getInvoicesByPage(paymentPageId: string): Promise<Invoice[]> {
    const invoices = await readJson<Invoice>(INVOICES_FILE);
    return invoices
      .filter((i) => i.paymentPageId === paymentPageId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async createInvoice(invoice: Invoice): Promise<Invoice> {
    const invoices = await readJson<Invoice>(INVOICES_FILE);
    invoices.push(invoice);
    await writeJson(INVOICES_FILE, invoices);
    return invoice;
  },

  async updateInvoice(id: string, patch: Partial<Invoice>): Promise<Invoice> {
    const invoices = await readJson<Invoice>(INVOICES_FILE);
    const idx = invoices.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error("NOT_FOUND");
    invoices[idx] = { ...invoices[idx], ...patch };
    await writeJson(INVOICES_FILE, invoices);
    return invoices[idx];
  },
};

export type { Tables };
