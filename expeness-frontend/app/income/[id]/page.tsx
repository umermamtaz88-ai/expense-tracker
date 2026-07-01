"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CategoryIcon } from "@/components/features/CategoryIcon";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { DeleteModal } from "@/components/ui/Modal";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { isIncomeCategory } from "@/constants/income";
import { expenseService } from "@/services/expense.service";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Expense } from "@/types";

export default function IncomeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [income, setIncome] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await expenseService.delete(id);
      toast.success("Income deleted successfully");
      router.push("/income");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete income");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Income Details" description="Loading...">
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !income) {
    return (
      <DashboardLayout title="Income Details">
        <ErrorState message={error ?? "Income not found"} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Income Details" description={income.title}>
      <div className="max-w-2xl space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <CategoryIcon category={income.category} size="lg" />
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold">{income.title}</h2>
                <p className="text-3xl font-bold text-success mt-1">
                  +{formatCurrency(income.amount)}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge variant="secondary">{income.category}</Badge>
                  <Badge variant="success">Income</Badge>
                </div>
              </div>
            </div>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date
                </dt>
                <dd className="text-sm font-medium mt-1">{formatDate(income.date)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Source
                </dt>
                <dd className="text-sm font-medium mt-1">{income.category}</dd>
              </div>
              {income.note && (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Note
                  </dt>
                  <dd className="text-sm mt-1 text-muted-foreground">{income.note}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <Button variant="destructive" onClick={() => setShowDelete(true)}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          <ButtonLink
            href={`/income/${id}/edit`}
            className="w-full sm:ml-auto sm:w-auto"
            variant="secondary"
          >
            <Pencil className="h-4 w-4" />
            Edit Income
          </ButtonLink>
        </div>
      </div>

      <DeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        loading={deleting}
        description={`Are you sure you want to delete "${income.title}"?`}
      />
    </DashboardLayout>
  );
}
