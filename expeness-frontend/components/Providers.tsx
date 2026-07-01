"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast:
              "bg-card border-border text-foreground shadow-lg rounded-xl",
            success: "border-success/30",
            error: "border-destructive/30",
          },
        }}
        richColors
        closeButton
      />
    </ThemeProvider>
  );
}
