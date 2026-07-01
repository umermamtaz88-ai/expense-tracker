import {
  Utensils,
  Plane,
  GraduationCap,
  Baby,
  ShoppingCart,
  Home,
  FileText,
  Zap,
  Droplets,
  Wifi,
  Flame,
  Fuel,
  ShoppingBag,
  HeartPulse,
  Pill,
  Gamepad2,
  Briefcase,
  Building2,
  TrendingUp,
  Gift,
  HandHeart,
  Shield,
  PiggyBank,
  Bus,
  Smartphone,
  CreditCard,
  Wrench,
  Sparkles,
  Shirt,
  CircleDot,
  type LucideIcon,
} from "lucide-react";

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  Food: Utensils,
  Travel: Plane,
  Education: GraduationCap,
  "Children Fees": Baby,
  Groceries: ShoppingCart,
  Rent: Home,
  Bills: FileText,
  Electricity: Zap,
  Water: Droplets,
  Internet: Wifi,
  Gas: Flame,
  Fuel: Fuel,
  Shopping: ShoppingBag,
  Medical: HeartPulse,
  Medicine: Pill,
  Entertainment: Gamepad2,
  Salary: Briefcase,
  Business: Building2,
  Investment: TrendingUp,
  Gift: Gift,
  Donation: HandHeart,
  Insurance: Shield,
  Savings: PiggyBank,
  Transportation: Bus,
  "Mobile Recharge": Smartphone,
  Subscription: CreditCard,
  "Home Maintenance": Wrench,
  "Personal Care": Sparkles,
  Clothing: Shirt,
  Other: CircleDot,
};

const CATEGORY_COLOR_MAP: Record<string, string> = {
  Food: "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400",
  Travel: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  Education: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400",
  "Children Fees": "bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400",
  Groceries: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  Rent: "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
  Bills: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  Electricity: "bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400",
  Water: "bg-cyan-100 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400",
  Internet: "bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400",
  Gas: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  Fuel: "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400",
  Shopping: "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-950 dark:text-fuchsia-400",
  Medical: "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400",
  Medicine: "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400",
  Entertainment: "bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
  Salary: "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400",
  Business: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  Investment: "bg-teal-100 text-teal-600 dark:bg-teal-950 dark:text-teal-400",
  Gift: "bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400",
  Donation: "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400",
  Insurance: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  Savings: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  Transportation: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  "Mobile Recharge": "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
  Subscription: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400",
  "Home Maintenance": "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  "Personal Care": "bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400",
  Clothing: "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-950 dark:text-fuchsia-400",
  Other: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

const CHART_COLORS = [
  "#059669",
  "#2563eb",
  "#f97316",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#eab308",
  "#ef4444",
  "#6366f1",
  "#06b6d4",
];

export function getCategoryIcon(category: string): LucideIcon {
  return CATEGORY_ICON_MAP[category] ?? CircleDot;
}

export function getCategoryColor(category: string): string {
  return (
    CATEGORY_COLOR_MAP[category] ??
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
  );
}

export function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}
