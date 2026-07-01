import { isIncomeCategory } from "@/constants/income";
import { computeIncomeTotals } from "@/lib/income";
import type { Expense } from "@/types";

export function computeDashboardStatistics(
  expenses: Expense[],
  monthlySpending: number,
  monthlyBudget: number,
  today: string,
  currentMonth: string,
) {
  let totalIncome = 0;
  let totalExpenses = 0;
  let expenseCount = 0;

  for (const expense of expenses) {
    if (isIncomeCategory(expense.category)) {
      totalIncome += expense.amount;
    } else {
      totalExpenses += expense.amount;
      expenseCount += 1;
    }
  }

  const todaySpending = expenses
    .filter((e) => e.date === today && !isIncomeCategory(e.category))
    .reduce((sum, e) => sum + e.amount, 0);

  const incomeTotals = computeIncomeTotals(expenses, currentMonth);

  return {
    totalBalance: totalIncome - totalExpenses,
    totalIncome,
    totalExpenses,
    monthlySpending,
    monthlyIncome: incomeTotals.monthlyIncome,
    incomeCount: incomeTotals.incomeCount,
    remainingBudget: monthlyBudget - monthlySpending,
    expenseCount,
    todaySpending,
    recentIncome: incomeTotals.recentIncome,
  };
}
