"use client";

import { ExpenseForm } from "./ExpenseForm";
import type { Expense, ExpenseCreate, ExpenseUpdate } from "@/types";

interface IncomeFormBaseProps {
  categories: string[];
  onCancel: () => void;
  submitLabel?: string;
}

interface IncomeFormCreateProps extends IncomeFormBaseProps {
  initialData?: undefined;
  onSubmit: (data: ExpenseCreate) => Promise<void>;
}

interface IncomeFormEditProps extends IncomeFormBaseProps {
  initialData: Expense;
  onSubmit: (data: ExpenseUpdate) => Promise<void>;
}

type IncomeFormProps = IncomeFormCreateProps | IncomeFormEditProps;

export function IncomeForm(props: IncomeFormProps) {
  const isEdit = !!props.initialData;

  if (isEdit) {
    return (
      <ExpenseForm
        categories={props.categories}
        initialData={props.initialData}
        onSubmit={props.onSubmit}
        onCancel={props.onCancel}
        submitLabel={props.submitLabel ?? "Save Income"}
        titleLabel="Income Title"
        titlePlaceholder="e.g. Monthly salary, Freelance payment"
        notePlaceholder="Optional notes about this income..."
      />
    );
  }

  return (
    <ExpenseForm
      categories={props.categories}
      onSubmit={props.onSubmit}
      onCancel={props.onCancel}
      submitLabel={props.submitLabel ?? "Add Income"}
      titleLabel="Income Title"
      titlePlaceholder="e.g. Monthly salary, Freelance payment"
      notePlaceholder="Optional notes about this income..."
    />
  );
}
