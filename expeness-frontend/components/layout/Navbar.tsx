"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Menu, Moon, Sun, Plus, ArrowUpCircle, LogOut, X } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface NavbarProps {
  title: string;
  description?: string;
  showAddButton?: boolean;
  onLogout?: () => void;
}

export function Navbar({ title, description, showAddButton, onLogout }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 backdrop-blur-md px-4 lg:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden shrink-0"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight truncate">
              {title}
            </h1>
            {description && (
              <p className="text-xs text-muted-foreground truncate hidden sm:block">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {showAddButton && (
            <>
              <ButtonLink href="/income/new" size="sm" variant="secondary" className="hidden sm:inline-flex">
                <ArrowUpCircle className="h-4 w-4" />
                Add Income
              </ButtonLink>
              <ButtonLink href="/expenses/new" size="sm" className="hidden sm:inline-flex">
                <Plus className="h-4 w-4" />
                Add Expense
              </ButtonLink>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Avatar name={user?.email ?? "User"} size="sm" />
          {onLogout && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-[var(--sidebar-width)] transition-transform duration-200 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="relative h-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 z-10"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
            >
              <X className="h-4 w-4" />
            </Button>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      </div>
    </>
  );
}
