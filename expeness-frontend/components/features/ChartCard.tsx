"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { getChartColor } from "@/constants/categories";
import { formatCurrency, formatMonth } from "@/lib/utils";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";
import type { SummaryByMonth, SummaryByCategory } from "@/types";

interface MonthlyChartProps {
  data: SummaryByMonth[];
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  const chartData = [...data].reverse().slice(-6).map((item) => ({
    month: formatMonth(item.month),
    amount: item.total_amount,
  }));

  return (
    <Card>
      <CardHeader className="mb-4">
        <CardTitle>Monthly Spending</CardTitle>
      </CardHeader>
      <div className="px-2 pb-6">
        {chartData.length === 0 ? (
          <EmptyState
            icon={BarChart3}
            title="No data yet"
            description="Monthly spending will appear here."
          />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `$${v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.75rem",
                  fontSize: "0.875rem",
                }}
                formatter={(value) => [formatCurrency(Number(value)), "Spent"]}
              />
              <Bar
                dataKey="amount"
                fill="var(--primary)"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}

interface CategoryChartProps {
  data: SummaryByCategory[];
}

export function CategoryChart({ data }: CategoryChartProps) {
  const chartData = data.slice(0, 8).map((item, index) => ({
    name: item.category,
    value: item.total_amount,
    color: getChartColor(index),
  }));

  return (
    <Card>
      <CardHeader className="mb-4">
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <div className="px-2 pb-6">
        {chartData.length === 0 ? (
          <EmptyState
            icon={PieChartIcon}
            title="No data yet"
            description="Category breakdown will appear here."
          />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.75rem",
                  fontSize: "0.875rem",
                }}
                formatter={(value) => [formatCurrency(Number(value)), "Spent"]}
              />
              <Legend
                formatter={(value: string) => (
                  <span className="text-xs text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
