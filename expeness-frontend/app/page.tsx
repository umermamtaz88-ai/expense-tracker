"use client";

import { motion } from "framer-motion";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Plus,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardCard } from "@/components/features/DashboardCard";
import { RecentExpenses } from "@/components/features/ExpenseCard";
import { RecentIncome } from "@/components/features/IncomeCard";
import { MonthlyChart, CategoryChart } from "@/components/features/ChartCard";
import { CategoryIcon } from "@/components/features/CategoryIcon";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { useDashboard } from "@/hooks/useDashboard";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const { data, loading, error, refetch } = useDashboard();
  const stats = data.statistics;

  return (
    <DashboardLayout
      title="Dashboard"
      description="Overview of your spending and finances"
      showAddButton
    >
      {error && (
        <ErrorState message={error} onRetry={refetch} className="mb-6" />
      )}

      {loading ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardCard
              title="Total Balance"
              value={stats.totalBalance}
              formatAsCurrency
              icon={Wallet}
              variant="primary"
              subtitle="Income minus expenses"
            />
            <DashboardCard
              title="Total Income"
              value={stats.totalIncome}
              formatAsCurrency
              icon={ArrowUpCircle}
              variant="secondary"
              subtitle="Salary, Business, Investment"
            />
            <DashboardCard
              title="Total Expenses"
              value={stats.totalExpenses}
              formatAsCurrency
              icon={ArrowDownCircle}
              subtitle={`${stats.expenseCount} transactions`}
            />
            <DashboardCard
              title="Monthly Income"
              value={stats.monthlyIncome}
              formatAsCurrency
              icon={TrendingUp}
              subtitle={`${formatCurrency(stats.monthlySpending)} spent this month`}
            />
          </div>

          <Card>
            <CardHeader className="mb-4">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <div className="flex flex-wrap gap-3 px-6 pb-6">
              <ButtonLink href="/income/new" variant="secondary">
                <ArrowUpCircle className="h-4 w-4" />
                Add Income
              </ButtonLink>
              <ButtonLink href="/expenses/new">
                <Plus className="h-4 w-4" />
                Add Expense
              </ButtonLink>
              <ButtonLink href="/analytics" variant="outline">
                <TrendingUp className="h-4 w-4" />
                Analytics
              </ButtonLink>
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <MonthlyChart data={data.monthlySummary?.months ?? []} />
            <CategoryChart data={data.categorySummary?.categories ?? []} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <RecentIncome income={data.recentIncome} />
            <RecentExpenses expenses={data.recentExpenses} />
          </div>

          <Card>
            <CardHeader className="mb-4">
              <CardTitle>Category Breakdown</CardTitle>
            </CardHeader>
            <div className="px-6 pb-6 space-y-3">
              {(data.categorySummary?.categories ?? []).slice(0, 5).map((cat) => (
                <div key={cat.category} className="flex items-center gap-3">
                  <CategoryIcon category={cat.category} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{cat.category}</p>
                      <p className="text-sm font-semibold">
                        {formatCurrency(cat.total_amount)}
                      </p>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
