"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorAlert({ message, onRetry, className }: ErrorAlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4",
        className,
      )}
    >
      <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-destructive">Something went wrong</p>
        <p className="text-sm text-muted-foreground mt-0.5">{message}</p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="shrink-0"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </Button>
      )}
    </div>
  );
}
