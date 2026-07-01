import { isIncomeCategory } from "@/constants/income";
import type { Expense } from "@/types";

export type Income = Expense;

export function filterIncomeRecords(records: Expense[]): Income[] {
  return records
    .filter((r) => isIncomeCategory(r.category))
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}

export function filterExpenseRecords(records: Expense[]): Expense[] {
  return records.filter((r) => !isIncomeCategory(r.category));
}

export function computeIncomeTotals(records: Expense[], currentMonth: string) {
  const incomeRecords = filterIncomeRecords(records);
  const totalIncome = incomeRecords.reduce((sum, r) => sum + r.amount, 0);
  const monthlyIncome = incomeRecords
    .filter((r) => r.date.startsWith(currentMonth))
    .reduce((sum, r) => sum + r.amount, 0);

  return {
    totalIncome,
    monthlyIncome,
    incomeCount: incomeRecords.length,
    recentIncome: incomeRecords.slice(0, 5),
  };
}
