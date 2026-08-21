"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-[var(--radius-pill)] text-sm font-semibold whitespace-nowrap transition-colors outline-none focus-visible:outline-2 focus-visible:outline-[var(--accent-terra)] focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 font-body",
  {
    variants: {
      variant: {
        primary: "bg-[var(--accent-terra)] text-[var(--bg-base)] hover:bg-[#8A4225] shadow-sm",
        secondary: "border-2 border-[var(--text-primary)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-base)]",
        ghost: "bg-transparent text-[var(--text-primary)] hover:bg-[var(--text-primary)]/5 dark:hover:bg-[var(--bg-base)]/10",
      },
      size: {
        sm: "h-8 px-4 text-xs",
        md: "h-12 px-6 text-[15px]",
        lg: "h-14 px-8 text-[16px]",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "ref" | "children">,
    VariantProps<typeof buttonVariants> {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, icon, iconPosition = "left", children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.96 }}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {icon && iconPosition === "left" && <span className="mr-2 flex items-center justify-center">{icon}</span>}
        {children}
        {icon && iconPosition === "right" && <span className="ml-2 flex items-center justify-center">{icon}</span>}
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
