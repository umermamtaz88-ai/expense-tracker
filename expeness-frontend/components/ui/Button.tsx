"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ClassValue } from "clsx";
import {
  buttonVariants,
  type ButtonSize,
  type ButtonVariant,
} from "./button-variants";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={buttonVariants({ variant, size, className })}
      {...props}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  ),
);

Button.displayName = "Button";

export interface ButtonLinkProps {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: ClassValue;
  children: React.ReactNode;
  onClick?: () => void;
}

export function ButtonLink({
  href,
  variant = "default",
  size = "md",
  className,
  children,
  onClick,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={buttonVariants({ variant, size, className: cn(className) })}
    >
      {children}
    </Link>
  );
}
