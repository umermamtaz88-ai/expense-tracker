"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { CategoryIcon } from "./CategoryIcon";
import { formatCurrency } from "@/lib/utils";
import type { SummaryByCategory } from "@/types";

interface CategoryCardProps {
  category: SummaryByCategory;
  index?: number;
}

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
    >
      <Link
        href={`/expenses?category=${encodeURIComponent(category.category)}`}
      >
        <Card className="p-5 hover:shadow-md hover:border-primary/20 transition-all duration-200 h-full">
          <div className="flex items-start gap-3">
            <CategoryIcon category={category.category} size="md" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">{category.category}</h3>
              <p className="text-xl font-bold mt-1">
                {formatCurrency(category.total_amount)}
              </p>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{category.expense_count} transactions</span>
                <span>{category.percentage}%</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
