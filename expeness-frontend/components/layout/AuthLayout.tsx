"use client";

import { type ReactNode } from "react";
import { Wallet } from "lucide-react";
import Link from "next/link";
import { APP_NAME } from "@/constants/navigation";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary/10 via-secondary/10 to-background p-10 border-r border-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Wallet className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold">{APP_NAME}</span>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Manage your money with confidence
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md">
            Track expenses, monitor income, and stay on top of your finances in one premium dashboard.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">Secure • Fast • Simple</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">{APP_NAME}</span>
          </div>
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
