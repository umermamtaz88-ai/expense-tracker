"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { IncomeForm } from "@/components/features/IncomeForm";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { INCOME_CATEGORIES, isIncomeCategory } from "@/constants/income";
import { expenseService } from "@/services/expense.service";
import type { Expense, ExpenseUpdate } from "@/types";

const categories = [...INCOME_CATEGORIES];

export default function EditIncomePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [income, setIncome] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    expenseService
      .getById(id)
      .then((data) => {
        if (!isIncomeCategory(data.category)) {
          setError("This record is not an income entry");
          return;
        }
        setIncome(data);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load income"),
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: ExpenseUpdate) => {
    await expenseService.update(id, data);
    toast.success("Income updated successfully");
    router.push(`/income/${id}`);
  };

  if (loading) {
    return (
      <DashboardLayout title="Edit Income" description="Loading...">
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !income) {
    return (
      <DashboardLayout title="Edit Income">
        <ErrorState message={error ?? "Income not found"} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Edit Income" description={`Editing "${income.title}"`}>
      <div className="max-w-2xl">
        <IncomeForm
          categories={categories}
          initialData={income}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          submitLabel="Save Changes"
        />
      </div>
    </DashboardLayout>
  );
}
