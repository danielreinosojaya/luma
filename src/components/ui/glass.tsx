import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassProps
  extends React.HTMLAttributes<HTMLDivElement> {
  blur?: "sm" | "md" | "lg" | "xl"
  border?: boolean
  shadow?: boolean
}

const blurMap = {
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
}

const Glass = React.forwardRef<HTMLDivElement, GlassProps>(
  ({ className, blur = "md", border = true, shadow = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl bg-white/10 transition-all duration-300 hover:bg-white/15",
        blurMap[blur],
        border && "border border-white/30",
        shadow && "shadow-xl shadow-black/10",
        className
      )}
      {...props}
    />
  )
)
Glass.displayName = "Glass"

export { Glass }
