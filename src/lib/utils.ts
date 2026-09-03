import { clsx, type ClassValue } from "clsx";
import type { Locale } from "./types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Formats a number as Algerian Dinar, e.g. 9,900 دج / 9 900 DA */
export function formatPrice(amount: number, locale: Locale = "ar") {
  const rounded = Math.round(amount);
  const grouped = rounded.toLocaleString(locale === "ar" ? "ar-DZ" : "fr-DZ");
  return locale === "ar" ? `${grouped} دج` : `${grouped} DA`;
}

export function discountPercent(price: number, oldPrice?: number | null) {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export function slugify(input: string) {
  return input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function localized<T extends Record<string, any>>(
  obj: T,
  field: string,
  locale: Locale
): string {
  return obj[`${field}_${locale}`] ?? obj[`${field}_ar`] ?? "";
}
