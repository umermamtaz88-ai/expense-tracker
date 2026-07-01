"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ExpenseForm } from "@/components/features/ExpenseForm";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { expenseService } from "@/services/expense.service";
import type { Expense, ExpenseUpdate } from "@/types";

export default function EditExpensePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [expense, setExpense] = useState<Expense | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      expenseService.getById(id),
      expenseService.getCategories(),
    ])
      .then(([exp, cats]) => {
        setExpense(exp);
        setCategories(cats.categories);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load expense"),
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: ExpenseUpdate) => {
    await expenseService.update(id, data);
    toast.success("Expense updated successfully");
    router.push(`/expenses/${id}`);
  };

  if (loading) {
    return (
      <DashboardLayout title="Edit Expense" description="Loading...">
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !expense) {
    return (
      <DashboardLayout title="Edit Expense">
        <ErrorAlert message={error ?? "Expense not found"} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Edit Expense"
      description={`Editing "${expense.title}"`}
    >
      <div className="max-w-2xl">
        <ExpenseForm
          categories={categories}
          initialData={expense}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          submitLabel="Save Changes"
        />
      </div>
    </DashboardLayout>
  );
}
