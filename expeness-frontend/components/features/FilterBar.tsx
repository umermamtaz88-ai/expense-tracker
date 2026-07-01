"use client";

import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  className?: string;
}

export function FilterBar({
  categories,
  selectedCategory,
  onCategoryChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onClear,
  hasActiveFilters,
  className,
}: FilterBarProps) {
  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((c) => ({ value: c, label: c })),
  ];

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:flex-wrap",
        className,
      )}
    >
      <div className="w-full sm:w-48">
        <Select
          label="Category"
          options={categoryOptions}
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        />
      </div>
      <div className="w-full sm:w-40">
        <Input
          label="From"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
        />
      </div>
      <div className="w-full sm:w-40">
        <Input
          label="To"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
        />
      </div>
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClear} className="mb-0.5">
          <X className="h-4 w-4" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
