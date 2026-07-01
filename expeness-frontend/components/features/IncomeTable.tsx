"use client";

import { ArrowUpDown, Eye, Pencil, Trash2, ArrowUpCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { CategoryIcon } from "./CategoryIcon";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Expense, SortConfig } from "@/types";

interface IncomeTableProps {
  income: Expense[];
  sort: SortConfig;
  onSort: (field: SortConfig["field"]) => void;
  onDelete: (item: Expense) => void;
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
      className={`inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider transition-colors ${
        isActive ? "text-secondary" : "text-muted-foreground hover:text-foreground"
      }`}
      aria-label={`Sort by ${label}`}
    >
      {label}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  );
}

export function IncomeTable({ income, sort, onSort, onDelete }: IncomeTableProps) {
  if (income.length === 0) {
    return (
      <EmptyState
        icon={ArrowUpCircle}
        title="No income found"
        description="Add your first income entry to start tracking earnings."
      />
    );
  }

  return (
    <>
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm" aria-label="Income table">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left" scope="col">
                <SortButton field="title" label="Title" sort={sort} onSort={onSort} />
              </th>
              <th className="px-4 py-3 text-left" scope="col">
                <SortButton field="category" label="Source" sort={sort} onSort={onSort} />
              </th>
              <th className="px-4 py-3 text-left" scope="col">
                <SortButton field="amount" label="Amount" sort={sort} onSort={onSort} />
              </th>
              <th className="px-4 py-3 text-left" scope="col">
                <SortButton field="date" label="Date" sort={sort} onSort={onSort} />
              </th>
              <th className="px-4 py-3 text-right" scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {income.map((item) => (
              <tr key={item.id} className="bg-card hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <CategoryIcon category={item.category} size="sm" />
                    <span className="font-medium">{item.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="secondary">{item.category}</Badge>
                </td>
                <td className="px-4 py-3 font-semibold text-success">
                  +{formatCurrency(item.amount)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(item.date)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <ButtonLink
                      href={`/income/${item.id}`}
                      variant="ghost"
                      size="icon"
                      aria-label={`View ${item.title}`}
                    >
                      <Eye className="h-4 w-4" />
                    </ButtonLink>
                    <ButtonLink
                      href={`/income/${item.id}/edit`}
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${item.title}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </ButtonLink>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(item)}
                      aria-label={`Delete ${item.title}`}
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

      <div className="md:hidden space-y-3">
        {income.map((item) => (
          <div key={item.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start gap-3">
              <CategoryIcon category={item.category} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium truncate">{item.title}</p>
                  <p className="font-semibold text-success shrink-0">
                    +{formatCurrency(item.amount)}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {item.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(item.date)}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-3">
                  <ButtonLink
                    href={`/income/${item.id}`}
                    variant="outline"
                    size="sm"
                    className="flex-1 w-full"
                  >
                    <Eye className="h-3.5 w-3.5" /> View
                  </ButtonLink>
                  <ButtonLink
                    href={`/income/${item.id}/edit`}
                    variant="outline"
                    size="sm"
                    className="flex-1 w-full"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </ButtonLink>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(item)}
                    aria-label={`Delete ${item.title}`}
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
