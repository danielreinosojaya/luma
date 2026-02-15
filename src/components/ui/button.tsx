import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "btn btn-enterprise d-inline-flex align-items-center justify-content-center gap-2 fw-600 transition-all position-relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "btn-primary-enterprise text-white",
        secondary: "btn-secondary-enterprise text-white",
        outline: "btn-outline-enterprise",
        ghost: "btn-ghost-enterprise border-0",
        success: "btn btn-success",
        danger: "btn btn-danger",
        warning: "btn btn-warning",
        info: "btn btn-info",
      },
      size: {
        default: "px-3 py-2 fs-6",
        sm: "px-2 py-1 fs-7",
        lg: "px-4 py-3 fs-5",
        xl: "px-5 py-3 fs-4 fw-bold",
      },
      fullWidth: {
        true: "w-100",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };