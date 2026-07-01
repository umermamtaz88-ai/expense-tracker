"use client";

import { AlertTriangle, RefreshCw, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { ApiClientError } from "@/services/api";

export interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  className?: string;
  status?: number;
}

export function ErrorState({
  message,
  onRetry,
  className,
  status,
}: ErrorStateProps) {
  const isNetwork =
    message.toLowerCase().includes("fetch") ||
    message.toLowerCase().includes("network") ||
    status === 0;

  const Icon = isNetwork ? WifiOff : AlertTriangle;

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
        <Icon className="h-6 w-6 text-destructive" aria-hidden="true" />
      </div>
      <h3 className="text-sm font-semibold text-destructive">
        {isNetwork ? "Connection failed" : "Something went wrong"}
      </h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-md">{message}</p>
      {status && (
        <p className="text-xs text-muted-foreground mt-1">Error code: {status}</p>
      )}
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-4">
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </Button>
      )}
    </div>
  );
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) return error.message;
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}
