"use client";

import { ArrowUpDown, Eye, Pencil, Receipt, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { CategoryIcon } from "./CategoryIcon";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { Expense, SortConfig } from "@/types";

interface ExpenseTableProps {
  expenses: Expense[];
  sort: SortConfig;
  onSort: (field: SortConfig["field"]) => void;
  onDelete: (expense: Expense) => void;
}

function SortButton({
  field,
  label,
  sort,
  onSort,
}: {
  field: SortConfig["field"];
  label: string;
  sort: SortConfig;
  onSort: (field: SortConfig["field"]) => void;
}) {
  const isActive = sort.field === field;
  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider transition-colors",
        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
      )}
      aria-label={`Sort by ${label}${isActive ? ` (${sort.order === "asc" ? "ascending" : "descending"})` : ""}`}
    >
      {label}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  );
}

export function ExpenseTable({
  expenses,
  sort,
  onSort,
  onDelete,
}: ExpenseTableProps) {
  if (expenses.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No expenses found"
        description="Try adjusting your filters or add a new expense."
      />
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm" aria-label="Expenses table">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left" scope="col">
                <SortButton field="title" label="Title" sort={sort} onSort={onSort} />
              </th>
              <th className="px-4 py-3 text-left" scope="col">
                <SortButton field="category" label="Category" sort={sort} onSort={onSort} />
              </th>
              <th className="px-4 py-3 text-left" scope="col">
                <SortButton field="amount" label="Amount" sort={sort} onSort={onSort} />
              </th>
              <th className="px-4 py-3 text-left" scope="col">
                <SortButton field="date" label="Date" sort={sort} onSort={onSort} />
              </th>
              <th className="px-4 py-3 text-left" scope="col">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </span>
              </th>
              <th className="px-4 py-3 text-right" scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="bg-card hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <CategoryIcon category={expense.category} size="sm" />
                      <span className="font-medium">{expense.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{expense.category}</Badge>
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(expense.date)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="success">Recorded</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <ButtonLink
                        href={`/expenses/${expense.id}`}
                        variant="ghost"
                        size="icon"
                        aria-label={`View ${expense.title}`}
                      >
                        <Eye className="h-4 w-4" />
                      </ButtonLink>
                      <ButtonLink
                        href={`/expenses/${expense.id}/edit`}
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${expense.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </ButtonLink>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(expense)}
                        aria-label={`Delete ${expense.title}`}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {expenses.map((expense) => (
            <div
              key={expense.id}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-start gap-3">
                <CategoryIcon category={expense.category} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium truncate">{expense.title}</p>
                    <p className="font-semibold shrink-0">
                      {formatCurrency(expense.amount)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <Badge variant="outline" className="text-xs">
                      {expense.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(expense.date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-3">
                    <ButtonLink
                      href={`/expenses/${expense.id}`}
                      variant="outline"
                      size="sm"
                      className="flex-1 w-full"
                    >
                      <Eye className="h-3.5 w-3.5" /> View
                    </ButtonLink>
                    <ButtonLink
                      href={`/expenses/${expense.id}/edit`}
                      variant="outline"
                      size="sm"
                      className="flex-1 w-full"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </ButtonLink>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(expense)}
                      aria-label={`Delete ${expense.title}`}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
