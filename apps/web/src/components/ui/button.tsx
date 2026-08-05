import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Button variants following docs/02-components.md specification.
 * Types: primary, secondary, ghost, danger, icon
 * Sizes: sm (32px), md (40px), lg (48px)
 */
const buttonVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center gap-2',
    'rounded-md font-medium text-sm',
    'ring-offset-background transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-40',
    'select-none whitespace-nowrap',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-brand text-text-primary shadow-sm',
          'hover:bg-brand-700 active:bg-brand-800',
          'hover:shadow-glow-sm',
        ],
        secondary: [
          'bg-background-card text-text-primary border border-border',
          'hover:bg-background-elevated hover:border-border-subtle',
          'active:bg-background-card',
        ],
        ghost: [
          'text-text-secondary',
          'hover:bg-background-card hover:text-text-primary',
          'active:bg-background-elevated',
        ],
        danger: [
          'bg-danger text-danger-foreground shadow-sm',
          'hover:bg-red-600 active:bg-red-700',
        ],
        outline: [
          'border border-brand text-brand',
          'hover:bg-brand hover:text-text-primary',
          'active:bg-brand-700',
        ],
        link: [
          'text-brand underline-offset-4',
          'hover:underline',
          'p-0 h-auto',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10 p-0',
        'icon-sm': 'h-8 w-8 p-0',
        'icon-lg': 'h-12 w-12 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as a child component (useful for link-as-button patterns) */
  asChild?: boolean
  /** Show a loading spinner and disable interaction */
  isLoading?: boolean
  /** Icon to render before the label */
  leftIcon?: React.ReactNode
  /** Icon to render after the label */
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {asChild ? (
          children
        ) : isLoading ? (
          <>
            <LoadingSpinner />
            {children && <span>{children}</span>}
          </>
        ) : (
          <>
            {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
            {children}
            {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

/** Internal loading spinner for button loading state */
function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

export { Button, buttonVariants }
