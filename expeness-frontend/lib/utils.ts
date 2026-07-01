import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, isValid } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) return dateStr;
    return format(date, "MMM d, yyyy");
  } catch {
    return dateStr;
  }
}

export function formatDateShort(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) return dateStr;
    return format(date, "MMM d");
  } catch {
    return dateStr;
  }
}

export function formatMonth(monthStr: string): string {
  try {
    const [year, month] = monthStr.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return format(date, "MMM yyyy");
  } catch {
    return monthStr;
  }
}

export function toISODate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function getTodayISO(): string {
  return toISODate(new Date());
}

export function getCurrentMonthKey(): string {
  return format(new Date(), "yyyy-MM");
}
