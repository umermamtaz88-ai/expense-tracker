"use client";

import { useCallback, useEffect, useState } from "react";
import { expenseService } from "@/services/expense.service";
import { INCOME_CATEGORIES } from "@/constants/income";
import { filterIncomeRecords } from "@/lib/income";
import type {
  Expense,
  ExpenseCreate,
  ExpenseFilters,
  ExpenseUpdate,
  SortConfig,
} from "@/types";

const PAGE_SIZE = 10;

function filterBySearch(items: Expense[], search: string): Expense[] {
  if (!search.trim()) return items;
  const q = search.toLowerCase();
  return items.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      (e.note?.toLowerCase().includes(q) ?? false),
  );
}

function sortItems(items: Expense[], sort: SortConfig): Expense[] {
  return [...items].sort((a, b) => {
    let cmp = 0;
    switch (sort.field) {
      case "amount":
        cmp = a.amount - b.amount;
        break;
      case "title":
        cmp = a.title.localeCompare(b.title);
        break;
      case "category":
        cmp = a.category.localeCompare(b.category);
        break;
      case "date":
      default:
        cmp = a.date.localeCompare(b.date);
        break;
    }
    return sort.order === "asc" ? cmp : -cmp;
  });
}

export function useIncome() {
  const [allRecords, setAllRecords] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortConfig>({ field: "date", order: "desc" });
  const [page, setPage] = useState(1);

  const incomeCategories = [...INCOME_CATEGORIES];

  const fetchIncome = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await expenseService.getAll(filters);
      setAllRecords(filterIncomeRecords(data.expenses));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load income");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchIncome();
  }, [fetchIncome]);

  const filtered = filterBySearch(allRecords, search);
  const sorted = sortItems(filtered, sort);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (field: SortConfig["field"]) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === "desc" ? "asc" : "desc",
    }));
    setPage(1);
  };

  const createIncome = async (data: ExpenseCreate) => {
    const created = await expenseService.create(data);
    await fetchIncome();
    return created;
  };

  const updateIncome = async (id: string, data: ExpenseUpdate) => {
    const updated = await expenseService.update(id, data);
    await fetchIncome();
    return updated;
  };

  const deleteIncome = async (id: string) => {
    await expenseService.delete(id);
    await fetchIncome();
  };

  return {
    income: paginated,
    totalCount: sorted.length,
    totalAmount: sorted.reduce((sum, item) => sum + item.amount, 0),
    incomeCategories,
    loading,
    error,
    filters,
    setFilters,
    search,
    setSearch,
    sort,
    toggleSort,
    page,
    setPage,
    totalPages,
    refetch: fetchIncome,
    createIncome,
    updateIncome,
    deleteIncome,
  };
}
