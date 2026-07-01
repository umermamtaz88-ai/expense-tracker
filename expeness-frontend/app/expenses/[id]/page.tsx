"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { DeleteModal } from "@/components/ui/Modal";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { CategoryIcon } from "@/components/features/CategoryIcon";
import { expenseService } from "@/services/expense.service";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Expense } from "@/types";

export default function ExpenseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    expenseService
      .getById(id)
      .then(setExpense)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load expense"),
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await expenseService.delete(id);
      toast.success("Expense deleted successfully");
      router.push("/expenses");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete expense");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Expense Details" description="Loading...">
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !expense) {
    return (
      <DashboardLayout title="Expense Details">
        <ErrorAlert
          message={error ?? "Expense not found"}
          onRetry={() => router.refresh()}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Expense Details"
      description={expense.title}
    >
      <div className="max-w-2xl space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <CategoryIcon category={expense.category} size="lg" />
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold">{expense.title}</h2>
                <p className="text-3xl font-bold text-primary mt-1">
                  {formatCurrency(expense.amount)}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge variant="outline">{expense.category}</Badge>
                  <Badge variant="success">Recorded</Badge>
                </div>
              </div>
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date
                </dt>
                <dd className="text-sm font-medium mt-1">
                  {formatDate(expense.date)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Category
                </dt>
                <dd className="text-sm font-medium mt-1">{expense.category}</dd>
              </div>
              {expense.note && (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Note
                  </dt>
                  <dd className="text-sm mt-1 text-muted-foreground">
                    {expense.note}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <Button
            variant="destructive"
            onClick={() => setShowDelete(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          <ButtonLink href={`/expenses/${id}/edit`} className="w-full sm:ml-auto sm:w-auto">
            <Pencil className="h-4 w-4" />
            Edit Expense
          </ButtonLink>
        </div>
      </div>

      <DeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        loading={deleting}
        description={`Are you sure you want to delete "${expense.title}"?`}
      />
    </DashboardLayout>
  );
}
