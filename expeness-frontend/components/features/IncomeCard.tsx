"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpCircle } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { CategoryIcon } from "@/components/features/CategoryIcon";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import type { Expense } from "@/types";

interface IncomeCardProps {
  income: Expense;
}

export function IncomeCard({ income }: IncomeCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.15 }}>
      <Link
        href={`/income/${income.id}`}
        className="block rounded-xl border border-border bg-card p-4 hover:shadow-md hover:border-secondary/30 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <CategoryIcon category={income.category} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-sm truncate">{income.title}</p>
              <p className="font-semibold text-sm text-success shrink-0">
                +{formatCurrency(income.amount)}
              </p>
            </div>
            <div className="flex items-center justify-between gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {income.category}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDateShort(income.date)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

interface RecentIncomeProps {
  income: Expense[];
}

export function RecentIncome({ income }: RecentIncomeProps) {
  return (
    <Card>
      <CardHeader className="mb-4">
        <CardTitle>Recent Income</CardTitle>
      </CardHeader>
      {income.length === 0 ? (
        <EmptyState
          icon={ArrowUpCircle}
          title="No income recorded"
          description="Add your first income entry to track earnings."
        />
      ) : (
        <div className="px-6 pb-6 space-y-2">
          {income.slice(0, 5).map((item) => (
            <IncomeCard key={item.id} income={item} />
          ))}
        </div>
      )}
    </Card>
  );
}
