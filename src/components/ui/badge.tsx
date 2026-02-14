import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-[#C4956F] text-white shadow-md hover:shadow-lg",
        secondary: "bg-[#FFF9F5] text-[#8B7765] border border-[#E8DDD4]",
        success: "bg-green-100 text-green-800",
        warning: "bg-amber-100 text-amber-800",
        destructive: "bg-red-100 text-red-800",
        outline: "border border-[#C4956F] text-[#C4956F] hover:bg-[#FFF9F5]",
        glass: "bg-white/20 backdrop-blur-md border border-white/40 text-[#8B7765] shadow-lg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
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
