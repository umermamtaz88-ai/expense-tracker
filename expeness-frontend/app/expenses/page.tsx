"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ExpenseTable } from "@/components/features/ExpenseTable";
import { FilterBar } from "@/components/features/FilterBar";
import { SearchBar } from "@/components/ui/SearchBar";
import { Button, ButtonLink } from "@/components/ui/Button";
import { DeleteModal } from "@/components/ui/Modal";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { useExpenses } from "@/hooks/useExpenses";
import { useFilters } from "@/hooks/useFilters";
import type { Expense } from "@/types";

function ExpensesContent() {
  const searchParams = useSearchParams();
  const filterState = useFilters();
  const {
    expenses,
    totalCount,
    categories,
    loading,
    error,
    setFilters,
    search,
    setSearch,
    sort,
    toggleSort,
    page,
    setPage,
    totalPages,
    refetch,
    deleteExpense,
  } = useExpenses();

  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      filterState.setCategory(categoryParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    setFilters({
      category: filterState.category || undefined,
      start_date: filterState.startDate || undefined,
      end_date: filterState.endDate || undefined,
    });
    setPage(1);
  }, [filterState.category, filterState.startDate, filterState.endDate, setFilters, setPage]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteExpense(deleteTarget.id);
      toast.success("Expense deleted successfully");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete expense");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout
      title="Expenses"
      description="Manage and track all your expenses"
      showAddButton
    >
      <div className="space-y-4 mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search expenses..."
            className="flex-1"
          />
          <ButtonLink href="/expenses/new" className="w-full sm:hidden">
            <Plus className="h-4 w-4" />
            Add Expense
          </ButtonLink>
        </div>
        <FilterBar
          categories={categories}
          selectedCategory={filterState.category}
          onCategoryChange={filterState.setCategory}
          startDate={filterState.startDate}
          onStartDateChange={filterState.setStartDate}
          endDate={filterState.endDate}
          onEndDateChange={filterState.setEndDate}
          onClear={filterState.clearFilters}
          hasActiveFilters={filterState.hasActiveFilters}
        />
      </div>

      {error && <ErrorAlert message={error} onRetry={refetch} className="mb-6" />}

      {loading ? (
        <SkeletonTable />
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {totalCount} expense{totalCount !== 1 ? "s" : ""} found
            </p>
          </div>
          <ExpenseTable
            expenses={expenses}
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
        title="Delete Expense"
        description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`
            : undefined
        }
      />
    </DashboardLayout>
  );
}

export default function ExpensesPage() {
  return (
    <Suspense>
      <ExpensesContent />
    </Suspense>
  );
}
