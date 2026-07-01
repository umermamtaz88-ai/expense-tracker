"use client";

import { useCallback, useState } from "react";
import type { ExpenseFilters } from "@/types";

export function useFilters() {
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const hasActiveFilters = !!(category || startDate || endDate);

  const toApiFilters = useCallback((): ExpenseFilters => {
    const filters: ExpenseFilters = {};
    if (category) filters.category = category;
    if (startDate) filters.start_date = startDate;
    if (endDate) filters.end_date = endDate;
    return filters;
  }, [category, startDate, endDate]);

  const clearFilters = () => {
    setCategory("");
    setStartDate("");
    setEndDate("");
  };

  return {
    category,
    setCategory,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    hasActiveFilters,
    toApiFilters,
    clearFilters,
  };
}
