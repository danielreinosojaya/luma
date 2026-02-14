import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#C4956F] text-white hover:bg-[#B88657] active:bg-[#A87647] shadow-[0_4px_12px_rgba(196,149,111,0.2)] hover:shadow-[0_6px_16px_rgba(196,149,111,0.3)]",
        outline:
          "border border-[#E8DDD4] text-[#8B7765] hover:bg-[#FFF9F5] hover:border-[#C4956F] active:bg-[#F0E8E1]",
      },
      size: {
        default: "h-10 px-6",
        lg: "h-12 px-8 text-base",
        sm: "h-8 px-4 text-xs",
      },
      fullWidth: {
        true: "w-full",
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