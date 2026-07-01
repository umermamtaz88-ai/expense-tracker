"use client";

import { type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  showAddButton?: boolean;
}

export function DashboardLayout({
  children,
  title,
  description,
  showAddButton,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:block shrink-0">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar
          title={title}
          description={description}
          showAddButton={showAddButton}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
