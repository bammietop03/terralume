import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-semibold uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-(--color-navy-light) text-(--color-navy)",
        crimson:
          "border-transparent bg-(--color-crimson-light) text-(--color-crimson)",
        outline: "border-(--color-border) text-(--color-text-muted)",
        white: "border-white/30 bg-white/10 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };


