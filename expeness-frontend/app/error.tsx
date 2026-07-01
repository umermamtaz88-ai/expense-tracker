"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Error boundary caught an unhandled error
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 mb-6">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
      <p className="text-muted-foreground mt-2 max-w-sm">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <Button onClick={reset} className="mt-8">
        Try again
      </Button>
    </div>
  );
}
