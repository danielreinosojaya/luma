import * as React from "react"
import { cn } from "@/lib/utils"

export interface GradientProps
  extends React.HTMLAttributes<HTMLDivElement> {
  from?: string
  to?: string
  angle?: number
  asymmetric?: boolean
}

const Gradient = React.forwardRef<HTMLDivElement, GradientProps>(
  ({
    className,
    from = "#C4956F",
    to = "#8B7765",
    angle = 135,
    asymmetric = false,
    children,
    ...props
  }, ref) => {
    const baseStyle: React.CSSProperties = asymmetric
      ? {
          background: `conic-gradient(from ${angle}deg, ${from} 0%, ${to} 100%)`,
        }
      : {
          background: `linear-gradient(${angle}deg, ${from} 0%, ${to} 100%)`,
        }

    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        style={baseStyle}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Gradient.displayName = "Gradient"

export { Gradient }
