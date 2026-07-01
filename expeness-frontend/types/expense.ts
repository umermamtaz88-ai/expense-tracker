export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  note?: string | null;
}

export interface ExpenseCreate {
  title: string;
  amount: number;
  category: string;
  date: string;
  note?: string | null;
}

export interface ExpenseUpdate {
  title?: string;
  amount?: number;
  category?: string;
  date?: string;
  note?: string | null;
}

export interface ExpensesListResponse {
  expenses: Expense[];
  count: number;
}

export interface CategoriesResponse {
  categories: string[];
}

export interface SummaryOverall {
  total_expenses: number;
  total_amount: number;
  average_amount: number;
}

export interface SummaryByMonth {
  month: string;
  total_amount: number;
  expense_count: number;
}

export interface SummaryByMonthResponse {
  months: SummaryByMonth[];
  count: number;
}

export interface SummaryByCategory {
  category: string;
  total_amount: number;
  expense_count: number;
  percentage: number;
}

export interface SummaryByCategoryResponse {
  categories: SummaryByCategory[];
  count: number;
}

export interface ExpenseFilters {
  category?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
}

export type SortField = "date" | "amount" | "title" | "category";
export type SortOrder = "asc" | "desc";

export interface SortConfig {
  field: SortField;
  order: SortOrder;
}
