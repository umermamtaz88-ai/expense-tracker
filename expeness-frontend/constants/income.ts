/** Categories treated as income for dashboard calculations (no backend income endpoint). */
export const INCOME_CATEGORIES = ["Salary", "Business", "Investment"] as const;

export function isIncomeCategory(category: string): boolean {
  return (INCOME_CATEGORIES as readonly string[]).includes(category);
}
