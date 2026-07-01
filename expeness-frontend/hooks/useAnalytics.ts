"use client";

import { useCallback, useEffect, useState } from "react";
import { expenseService } from "@/services/expense.service";
import type {
  SummaryByCategoryResponse,
  SummaryByMonthResponse,
  SummaryOverall,
} from "@/types";

export interface AnalyticsData {
  summary: SummaryOverall | null;
  monthlySummary: SummaryByMonthResponse | null;
  categorySummary: SummaryByCategoryResponse | null;
}

const EMPTY: AnalyticsData = {
  summary: null,
  monthlySummary: null,
  categorySummary: null,
};

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [summary, monthlySummary, categorySummary] = await Promise.all([
        expenseService.getSummary(),
        expenseService.getSummaryByMonth(),
        expenseService.getSummaryByCategory(),
      ]);
      setData({ summary, monthlySummary, categorySummary });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchAnalytics();
  }, [fetchAnalytics]);

  return { data, loading, error, refetch: fetchAnalytics };
}
