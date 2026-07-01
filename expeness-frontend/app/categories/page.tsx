"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FolderOpen } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CategoryCard } from "@/components/features/CategoryCard";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function CategoriesPage() {
  const { data, loading, error, refetch } = useAnalytics();
  const categories = data.categorySummary?.categories ?? [];

  return (
    <DashboardLayout
      title="Categories"
      description="Overview of spending by category"
    >
      {error && (
        <ErrorState message={error} onRetry={refetch} className="mb-6" />
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20">
          <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No categories yet</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Add expenses to see category breakdowns.
          </p>
          <Link
            href="/expenses/new"
            className="inline-block mt-4 text-sm text-primary hover:underline"
          >
            Add your first expense
          </Link>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((cat, index) => (
            <CategoryCard key={cat.category} category={cat} index={index} />
          ))}
        </motion.div>
      )}
    </DashboardLayout>
  );
}
