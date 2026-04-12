import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-[15px] font-semibold uppercase tracking-[0.5px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-(--color-crimson) text-white hover:bg-[#7a1522] focus-visible:ring-(--color-crimson)",
        outline:
          "border border-navy text-navy bg-transparent hover:bg-navy-light focus-visible:ring-navy",
        ghost:
          "text-navy hover:bg-navy-light focus-visible:ring-navy",
        white:
          "bg-white text-(--color-navy-dark) hover:bg-(--color-navy-light) focus-visible:ring-white",
        "outline-white":
          "border border-white text-white bg-transparent hover:bg-white/10 focus-visible:ring-white",
      },
      size: {
        default: "h-12 px-8 py-3",
        sm: "h-9 px-5 py-2 text-[13px]",
        lg: "h-14 px-10 py-4 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };


