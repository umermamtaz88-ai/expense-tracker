import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export function Avatar({ name, size = "md", className, ...props }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      role="img"
      aria-label={name}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold",
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {initials}
    </div>
  );
}
