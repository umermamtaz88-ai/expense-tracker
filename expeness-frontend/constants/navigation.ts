import {
  LayoutDashboard,
  Receipt,
  ArrowUpCircle,
  FolderOpen,
  BarChart3,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Income", href: "/income", icon: ArrowUpCircle },
  { label: "Expenses", href: "/expenses", icon: Receipt },
  { label: "Categories", href: "/categories", icon: FolderOpen },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const APP_NAME = "ExpenseFlow";
