"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpCircle, Wallet } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { useIncomeSummary } from "@/hooks/useIncomeSummary";
import { formatCurrency } from "@/lib/utils";

export function SidebarIncomeSummary() {
  const { summary, loading } = useIncomeSummary();

  return (
    <div className="mx-4 mb-4 rounded-xl border border-secondary/20 bg-secondary/5 p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
          <Wallet className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">Total Income</p>
          <p className="text-lg font-bold text-secondary">
            {loading ? "—" : formatCurrency(summary.totalIncome)}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <span className="flex items-center gap-1">
          <ArrowUpCircle className="h-3 w-3 text-success" />
          This month
        </span>
        <span className="font-medium text-foreground">
          {loading ? "—" : formatCurrency(summary.monthlyIncome)}
        </span>
      </div>
      <ButtonLink
        href="/income/new"
        size="sm"
        variant="secondary"
        className="w-full"
      >
        Add Income
      </ButtonLink>
      <Link
        href="/income"
        className="mt-2 block text-center text-xs text-secondary hover:underline"
      >
        View all income ({loading ? "—" : summary.incomeCount})
      </Link>
    </div>
  );
}
