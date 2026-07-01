import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "default"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

const variantStyles: Record<ButtonVariant, string> = {
  default:
    "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-sm",
  outline:
    "border border-border bg-transparent hover:bg-muted text-foreground",
  ghost: "hover:bg-muted text-foreground",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
  md: "h-10 px-4 text-sm gap-2 rounded-lg",
  lg: "h-12 px-6 text-base gap-2 rounded-lg",
  icon: "h-10 w-10 rounded-lg",
};

export function buttonVariants({
  variant = "default",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center font-medium transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.98]",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );
}
