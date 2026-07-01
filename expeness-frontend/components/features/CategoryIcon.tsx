import { createElement } from "react";
import { getCategoryColor, getCategoryIcon } from "@/constants/categories";
import { cn } from "@/lib/utils";

interface CategoryIconProps {
  category: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { container: "h-8 w-8 rounded-lg", icon: "h-4 w-4" },
  md: { container: "h-10 w-10 rounded-xl", icon: "h-5 w-5" },
  lg: { container: "h-14 w-14 rounded-2xl", icon: "h-7 w-7" },
};

export function CategoryIcon({
  category,
  size = "md",
  className,
}: CategoryIconProps) {
  const colorClass = getCategoryColor(category);
  const sizes = sizeMap[size];

  return (
    <div
      className={cn(
        "flex items-center justify-center shrink-0",
        sizes.container,
        colorClass,
        className,
      )}
    >
      {createElement(getCategoryIcon(category), {
        className: sizes.icon,
        "aria-hidden": true,
      })}
    </div>
  );
}
