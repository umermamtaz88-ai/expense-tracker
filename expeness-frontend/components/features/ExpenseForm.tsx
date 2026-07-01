"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getTodayISO } from "@/lib/utils";
import type { Expense, ExpenseCreate, ExpenseUpdate } from "@/types";

interface ExpenseFormBaseProps {
  categories: string[];
  onCancel: () => void;
  submitLabel?: string;
  titleLabel?: string;
  titlePlaceholder?: string;
  notePlaceholder?: string;
}

interface ExpenseFormCreateProps extends ExpenseFormBaseProps {
  initialData?: undefined;
  onSubmit: (data: ExpenseCreate) => Promise<void>;
}

interface ExpenseFormEditProps extends ExpenseFormBaseProps {
  initialData: Expense;
  onSubmit: (data: ExpenseUpdate) => Promise<void>;
}

type ExpenseFormProps = ExpenseFormCreateProps | ExpenseFormEditProps;

interface FormErrors {
  title?: string;
  amount?: string;
  category?: string;
  date?: string;
  note?: string;
}

function validateForm(
  data: { title: string; amount: string; category: string; date: string; note: string },
  isEdit: boolean,
): FormErrors {
  const errors: FormErrors = {};

  if (!data.title.trim()) {
    errors.title = "Title is required";
  } else if (data.title.length > 200) {
    errors.title = "Title must be 200 characters or less";
  }

  if (!isEdit || data.amount !== "") {
    const amount = parseFloat(data.amount);
    if (!data.amount || isNaN(amount)) {
      errors.amount = "Amount is required";
    } else if (amount <= 0) {
      errors.amount = "Amount must be greater than 0";
    }
  }

  if (!data.category) {
    errors.category = "Category is required";
  }

  if (!data.date) {
    errors.date = "Date is required";
  }

  if (data.note && data.note.length > 500) {
    errors.note = "Note must be 500 characters or less";
  }

  return errors;
}

export function ExpenseForm({
  categories,
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Save Expense",
  titleLabel = "Title",
  titlePlaceholder = "e.g. Grocery shopping at Whole Foods",
  notePlaceholder = "Optional notes about this expense...",
}: ExpenseFormProps) {
  const isEdit = !!initialData;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [amount, setAmount] = useState(initialData?.amount?.toString() ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [date, setDate] = useState(initialData?.date ?? getTodayISO());
  const [note, setNote] = useState(initialData?.note ?? "");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm({ title, amount, category, date, note }, isEdit);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      if (isEdit) {
        const updateData: ExpenseUpdate = {};
        if (title !== initialData.title) updateData.title = title;
        if (parseFloat(amount) !== initialData.amount)
          updateData.amount = parseFloat(amount);
        if (category !== initialData.category) updateData.category = category;
        if (date !== initialData.date) updateData.date = date;
        if (note !== (initialData.note ?? "")) updateData.note = note || null;
        await onSubmit(updateData);
      } else {
        await onSubmit({
          title: title.trim(),
          amount: parseFloat(amount),
          category,
          date,
          note: note.trim() || null,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = categories.map((c) => ({ value: c, label: c }));

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <Input
          label={titleLabel}
          placeholder={titlePlaceholder}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          required
          maxLength={200}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={errors.amount}
            required
          />
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            error={errors.date}
            required
          />
        </div>

        <Select
          label="Category"
          options={categoryOptions}
          placeholder="Select a category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          error={errors.category}
          required
        />

        <Textarea
          label="Note"
          placeholder={notePlaceholder}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          error={errors.note}
          maxLength={500}
          rows={3}
        />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}
