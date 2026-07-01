"use client";

import { motion } from "framer-motion";
import { BarChart3, DollarSign, Receipt, TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatisticsCard } from "@/components/features/StatisticsCard";
import { MonthlyChart, CategoryChart } from "@/components/features/ChartCard";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAnalytics } from "@/hooks/useAnalytics";
import { getCategoryColor, getCategoryIcon } from "@/constants/categories";
import { cn, formatCurrency, formatMonth } from "@/lib/utils";

export default function AnalyticsPage() {
  const { data, loading, error, refetch } = useAnalytics();

  return (
    <DashboardLayout
      title="Analytics"
      description="Insights and trends for your spending"
    >
      {error && (
        <ErrorAlert message={error} onRetry={refetch} className="mb-6" />
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
            <StatisticsCard
              title="Total Spent"
              value={data.summary?.total_amount ?? 0}
              formatAsCurrency
              icon={DollarSign}
              variant="primary"
            />
            <StatisticsCard
              title="Total Expenses"
              value={data.summary?.total_expenses ?? 0}
              icon={Receipt}
              variant="secondary"
            />
            <StatisticsCard
              title="Average Expense"
              value={data.summary?.average_amount ?? 0}
              formatAsCurrency
              icon={TrendingUp}
            />
            <StatisticsCard
              title="Categories Used"
              value={data.categorySummary?.count ?? 0}
              icon={BarChart3}
              variant="warning"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <MonthlyChart data={data.monthlySummary?.months ?? []} />
            <CategoryChart data={data.categorySummary?.categories ?? []} />
          </div>

          <Card>
            <CardHeader className="mb-4">
              <CardTitle>Monthly Breakdown</CardTitle>
            </CardHeader>
            <div className="px-6 pb-6 space-y-3">
              {(data.monthlySummary?.months ?? []).map((month) => (
                <div
                  key={month.month}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {formatMonth(month.month)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {month.expense_count} transactions
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatCurrency(month.total_amount)}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader className="mb-4">
              <CardTitle>Category Details</CardTitle>
            </CardHeader>
            <div className="px-6 pb-6 space-y-3">
              {(data.categorySummary?.categories ?? []).map((cat) => {
                const Icon = getCategoryIcon(cat.category);
                const colorClass = getCategoryColor(cat.category);
                return (
                  <div
                    key={cat.category}
                    className="flex items-center gap-3 py-2"
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg shrink-0",
                        colorClass,
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{cat.category}</p>
                        <p className="text-sm font-semibold">
                          {formatCurrency(cat.total_amount)}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {cat.expense_count} expenses · {cat.percentage}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
