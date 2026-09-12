import { clsx } from "clsx";

export function cn(...inputs: Array<string | false | null | undefined>) {
  return clsx(inputs);
}

export function formatZec(amount: number): string {
  if (Number.isInteger(amount)) return `${amount}`;
  return amount.toFixed(8).replace(/0+$/, "").replace(/\.$/, "");
}
