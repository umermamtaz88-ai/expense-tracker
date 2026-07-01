import { apiDelete, apiGet, apiPost, apiPut } from "./api";
import type {
  CategoriesResponse,
  Expense,
  ExpenseCreate,
  ExpenseFilters,
  ExpensesListResponse,
  ExpenseUpdate,
  SummaryByCategoryResponse,
  SummaryByMonthResponse,
  SummaryOverall,
} from "@/types";

export const expenseService = {
  getAll(filters?: ExpenseFilters): Promise<ExpensesListResponse> {
    return apiGet<ExpensesListResponse>("/expenses", {
      category: filters?.category,
      start_date: filters?.start_date,
      end_date: filters?.end_date,
    });
  },

  getById(id: string): Promise<Expense> {
    return apiGet<Expense>(`/expenses/${id}`);
  },

  create(data: ExpenseCreate): Promise<Expense> {
    return apiPost<Expense>("/expenses", data);
  },

  update(id: string, data: ExpenseUpdate): Promise<Expense> {
    return apiPut<Expense>(`/expenses/${id}`, data);
  },

  delete(id: string): Promise<null> {
    return apiDelete<null>(`/expenses/${id}`);
  },

  getCategories(): Promise<CategoriesResponse> {
    return apiGet<CategoriesResponse>("/categories");
  },

  getSummary(): Promise<SummaryOverall> {
    return apiGet<SummaryOverall>("/summary");
  },

  getSummaryByMonth(): Promise<SummaryByMonthResponse> {
    return apiGet<SummaryByMonthResponse>("/summary/month");
  },

  getSummaryByCategory(): Promise<SummaryByCategoryResponse> {
    return apiGet<SummaryByCategoryResponse>("/summary/category");
  },
};
