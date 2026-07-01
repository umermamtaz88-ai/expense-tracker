"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Receipt } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { CategoryIcon } from "@/components/features/CategoryIcon";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import type { Expense } from "@/types";

interface ExpenseCardProps {
  expense: Expense;
  onClick?: () => void;
}

export function ExpenseCard({ expense, onClick }: ExpenseCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
    >
      <Link
        href={`/expenses/${expense.id}`}
        onClick={onClick}
        className="block rounded-xl border border-border bg-card p-4 hover:shadow-md hover:border-primary/20 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <CategoryIcon category={expense.category} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-sm truncate">{expense.title}</p>
              <p className="font-semibold text-sm shrink-0">
                {formatCurrency(expense.amount)}
              </p>
            </div>
            <div className="flex items-center justify-between gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {expense.category}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDateShort(expense.date)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

interface RecentExpensesProps {
  expenses: Expense[];
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  return (
    <Card>
      <CardHeader className="mb-4">
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      {expenses.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No transactions yet"
          description="Add your first expense to see it here."
        />
      ) : (
        <div className="px-6 pb-6 space-y-2">
          {expenses.slice(0, 5).map((expense) => (
            <ExpenseCard key={expense.id} expense={expense} />
          ))}
        </div>
      )}
    </Card>
  );
}
