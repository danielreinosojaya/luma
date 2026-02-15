import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "badge badge-enterprise d-inline-flex align-items-center rounded-pill px-3 py-2 lh-1 text-uppercase fw-600",
  {
    variants: {
      variant: {
        default: "badge-primary",
        secondary: "badge-secondary",
        success: "badge-success",
        warning: "badge-warning",
        danger: "badge-danger",
        info: "badge-info",
        light: "bg-light text-dark",
        dark: "bg-dark text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
