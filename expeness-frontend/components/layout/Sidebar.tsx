"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import { NAV_ITEMS, APP_NAME } from "@/constants/navigation";
import { SidebarIncomeSummary } from "./SidebarIncomeSummary";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[var(--sidebar-width)] flex-col border-r border-border bg-card">
      <Link
        href="/"
        onClick={onNavigate}
        className="flex h-16 items-center gap-2.5 px-6 border-b border-border hover:bg-muted/50 transition-colors"
        aria-label={`${APP_NAME} home`}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Wallet className="h-4 w-4" />
        </div>
        <span className="font-semibold text-base tracking-tight">{APP_NAME}</span>
      </Link>

      <nav className="flex-1 p-4 space-y-1" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                />
              )}
              <Icon className="relative h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="relative">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <SidebarIncomeSummary />

      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Premium Expense Tracker
        </p>
      </div>
    </aside>
  );
}
