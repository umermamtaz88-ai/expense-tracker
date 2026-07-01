"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ExpenseForm } from "@/components/features/ExpenseForm";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { expenseService } from "@/services/expense.service";
import type { ExpenseCreate } from "@/types";

export default function NewExpensePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    expenseService
      .getCategories()
      .then((data) => setCategories(data.categories))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load categories"),
      )
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (data: ExpenseCreate) => {
    await expenseService.create(data);
    toast.success("Expense created successfully");
    router.push("/expenses");
  };

  return (
    <DashboardLayout
      title="Add Expense"
      description="Record a new expense"
    >
      {error && <ErrorAlert message={error} className="mb-6" />}
      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="max-w-2xl">
          <ExpenseForm
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
            submitLabel="Create Expense"
          />
        </div>
      )}
    </DashboardLayout>
  );
}
