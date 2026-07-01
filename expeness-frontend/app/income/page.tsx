"use client";

import { useState } from "react";
import { ArrowUpCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { IncomeTable } from "@/components/features/IncomeTable";
import { SearchBar } from "@/components/ui/SearchBar";
import { Button, ButtonLink } from "@/components/ui/Button";
import { DeleteModal } from "@/components/ui/Modal";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { DashboardCard } from "@/components/features/DashboardCard";
import { useIncome } from "@/hooks/useIncome";
import type { Expense } from "@/types";

export default function IncomePage() {
  const {
    income,
    totalCount,
    totalAmount,
    loading,
    error,
    search,
    setSearch,
    sort,
    toggleSort,
    page,
    setPage,
    totalPages,
    refetch,
    deleteIncome,
  } = useIncome();

  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteIncome(deleteTarget.id);
      toast.success("Income deleted successfully");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete income");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout
      title="Income"
      description="Track salary, business, and investment earnings"
    >
      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        <DashboardCard
          title="Total Income"
          value={totalAmount}
          formatAsCurrency
          icon={ArrowUpCircle}
          variant="secondary"
          subtitle={`${totalCount} income entries`}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-6">
        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search income..."
          className="flex-1"
        />
        <ButtonLink href="/income/new" variant="secondary" className="sm:hidden w-full">
          <Plus className="h-4 w-4" />
          Add Income
        </ButtonLink>
      </div>

      {error && <ErrorState message={error} onRetry={refetch} className="mb-6" />}

      {loading ? (
        <SkeletonTable />
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            {totalCount} income {totalCount === 1 ? "entry" : "entries"} found
          </p>
          <IncomeTable
            income={income}
            sort={sort}
            onSort={toggleSort}
            onDelete={setDeleteTarget}
          />
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <DeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Income"
        description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.title}"?`
            : undefined
        }
      />
    </DashboardLayout>
  );
}
