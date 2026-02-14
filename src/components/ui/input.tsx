import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-lg border border-[#E8DDD4] bg-white/80 backdrop-blur-md px-4 py-2 text-base transition-all duration-300",
        "placeholder:text-[#A89887] focus:outline-none focus:ring-2 focus:ring-[#C4956F] focus:ring-offset-2",
        "focus:ring-offset-[#FAF8F6] hover:border-[#C4956F] focus:border-transparent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = "Input"

export { Input }
