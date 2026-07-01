"use client";

import { useCallback, useEffect, useState } from "react";
import { expenseService } from "@/services/expense.service";
import { computeIncomeTotals } from "@/lib/income";
import { getCurrentMonthKey } from "@/lib/utils";

export interface IncomeSummary {
  totalIncome: number;
  monthlyIncome: number;
  incomeCount: number;
}

const EMPTY: IncomeSummary = {
  totalIncome: 0,
  monthlyIncome: 0,
  incomeCount: 0,
};

export function useIncomeSummary() {
  const [summary, setSummary] = useState<IncomeSummary>(EMPTY);
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const data = await expenseService.getAll();
      const totals = computeIncomeTotals(data.expenses, getCurrentMonthKey());
      setSummary({
        totalIncome: totals.totalIncome,
        monthlyIncome: totals.monthlyIncome,
        incomeCount: totals.incomeCount,
      });
    } catch {
      setSummary(EMPTY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchSummary();
  }, [fetchSummary]);

  return { summary, loading, refetch: fetchSummary };
}
