"use client";

import { motion } from "framer-motion";
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn, formatCurrency } from "@/lib/utils";

export interface StatisticsCardProps {
  title: string;
  value: number;
  formatAsCurrency?: boolean;
  icon: LucideIcon;
  subtitle?: string;
  trend?: number;
  variant?: "default" | "primary" | "secondary" | "warning";
}

const variantStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  warning: "bg-warning/10 text-warning",
};

export function StatisticsCard({
  title,
  value,
  formatAsCurrency = false,
  icon: Icon,
  subtitle,
  trend,
  variant = "default",
}: StatisticsCardProps) {
  const displayValue = formatAsCurrency ? formatCurrency(value) : value.toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="p-5 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1 min-w-0">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className="text-2xl font-bold tracking-tight truncate">
              {displayValue}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend !== undefined && (
              <div
                className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  trend >= 0 ? "text-destructive" : "text-success",
                )}
              >
                {trend >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(trend)}% vs last month
              </div>
            )}
          </div>
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl shrink-0",
              variantStyles[variant],
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
