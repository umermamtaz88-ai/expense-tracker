"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { IncomeForm } from "@/components/features/IncomeForm";
import { INCOME_CATEGORIES } from "@/constants/income";
import { expenseService } from "@/services/expense.service";
import type { ExpenseCreate } from "@/types";

const categories = [...INCOME_CATEGORIES];

export default function NewIncomePage() {
  const router = useRouter();

  const handleSubmit = async (data: ExpenseCreate) => {
    await expenseService.create(data);
    toast.success("Income added successfully");
    router.push("/income");
  };

  return (
    <DashboardLayout title="Add Income" description="Record a new income entry">
      <div className="max-w-2xl">
        <IncomeForm
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          submitLabel="Add Income"
        />
      </div>
    </DashboardLayout>
  );
}
