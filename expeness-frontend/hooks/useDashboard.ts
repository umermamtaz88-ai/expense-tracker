"use client";

import { useCallback, useEffect, useState } from "react";
import { expenseService } from "@/services/expense.service";
import { computeDashboardStatistics } from "@/lib/dashboard";
import { filterExpenseRecords } from "@/lib/income";
import { getSettings } from "@/lib/settings";
import { getCurrentMonthKey, getTodayISO } from "@/lib/utils";
import type {
  DashboardStatistics,
  Expense,
  SummaryByCategoryResponse,
  SummaryByMonthResponse,
  SummaryOverall,
} from "@/types";

export interface DashboardData {
  summary: SummaryOverall | null;
  monthlySummary: SummaryByMonthResponse | null;
  categorySummary: SummaryByCategoryResponse | null;
  recentExpenses: Expense[];
  recentIncome: Expense[];
  statistics: DashboardStatistics;
}

const EMPTY_STATISTICS: DashboardStatistics = {
  totalBalance: 0,
  totalIncome: 0,
  totalExpenses: 0,
  monthlySpending: 0,
  monthlyIncome: 0,
  remainingBudget: 0,
  expenseCount: 0,
  incomeCount: 0,
  todaySpending: 0,
};

const EMPTY_DATA: DashboardData = {
  summary: null,
  monthlySummary: null,
  categorySummary: null,
  recentExpenses: [],
  recentIncome: [],
  statistics: EMPTY_STATISTICS,
};

export function useDashboard() {
  const [data, setData] = useState<DashboardData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const settings = getSettings();
      const currentMonth = getCurrentMonthKey();
      const today = getTodayISO();

      const [summary, monthlySummary, categorySummary, expensesData] =
        await Promise.all([
          expenseService.getSummary(),
          expenseService.getSummaryByMonth(),
          expenseService.getSummaryByCategory(),
          expenseService.getAll(),
        ]);

      const expenses = expensesData.expenses;
      const monthlySpending =
        monthlySummary.months.find((m) => m.month === currentMonth)
          ?.total_amount ?? 0;

      const statistics = computeDashboardStatistics(
        expenses,
        monthlySpending,
        settings.monthlyBudget,
        today,
        currentMonth,
      );

      const expenseOnly = filterExpenseRecords(expenses);

      setData({
        summary,
        monthlySummary,
        categorySummary,
        recentExpenses: expenseOnly.slice(0, 5),
        recentIncome: statistics.recentIncome,
        statistics,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchDashboard();
  }, [fetchDashboard]);

  return { data, loading, error, refetch: fetchDashboard };
}
