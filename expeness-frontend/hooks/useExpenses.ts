"use client";

import { useCallback, useEffect, useState } from "react";
import { expenseService } from "@/services/expense.service";
import { INCOME_CATEGORIES } from "@/constants/income";
import { filterExpenseRecords } from "@/lib/income";
import type {
  Expense,
  ExpenseCreate,
  ExpenseFilters,
  ExpenseUpdate,
  SortConfig,
} from "@/types";

const PAGE_SIZE = 10;

function filterBySearch(expenses: Expense[], search: string): Expense[] {
  if (!search.trim()) return expenses;
  const q = search.toLowerCase();
  return expenses.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      (e.note?.toLowerCase().includes(q) ?? false),
  );
}

function sortExpenses(expenses: Expense[], sort: SortConfig): Expense[] {
  return [...expenses].sort((a, b) => {
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

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortConfig>({ field: "date", order: "desc" });
  const [page, setPage] = useState(1);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [expenseData, categoryData] = await Promise.all([
        expenseService.getAll(filters),
        expenseService.getCategories(),
      ]);
      setExpenses(filterExpenseRecords(expenseData.expenses));
      setCategories(
        categoryData.categories.filter(
          (c) => !(INCOME_CATEGORIES as readonly string[]).includes(c),
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchExpenses();
  }, [fetchExpenses]);

  const filtered = filterBySearch(expenses, search);
  const sorted = sortExpenses(filtered, sort);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (field: SortConfig["field"]) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === "desc" ? "asc" : "desc",
    }));
    setPage(1);
  };

  const createExpense = async (data: ExpenseCreate) => {
    const created = await expenseService.create(data);
    await fetchExpenses();
    return created;
  };

  const updateExpense = async (id: string, data: ExpenseUpdate) => {
    const updated = await expenseService.update(id, data);
    await fetchExpenses();
    return updated;
  };

  const deleteExpense = async (id: string) => {
    await expenseService.delete(id);
    await fetchExpenses();
  };

  return {
    expenses: paginated,
    allExpenses: sorted,
    totalCount: sorted.length,
    categories,
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
    pageSize: PAGE_SIZE,
    refetch: fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
  };
}
