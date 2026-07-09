"use client";

import { type ReactNode } from "react";
import { useRequireAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function AuthGuard({ children }: { children: ReactNode }) {
  const auth = useRequireAuth();

  if (auth.loading || !auth.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
