import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Card component family: Card → CardHeader → CardBody → CardFooter
 * Following docs/02-components.md specification.
 * Variants: elevated (soft shadow), flat (no shadow), bordered
 */
const cardVariants = cva(
  ['rounded-lg transition-all duration-200'],
  {
    variants: {
      variant: {
        elevated: [
          'bg-background-card border border-border',
          'shadow-card hover:shadow-card-hover',
        ],
        flat: [
          'bg-background-card border border-transparent',
        ],
        bordered: [
          'bg-background-card border border-border',
          'hover:border-border-subtle',
        ],
        ghost: [
          'bg-transparent border border-border',
          'hover:bg-background-card',
        ],
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'elevated',
      padding: 'md',
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    />
  )
)
Card.displayName = 'Card'

// ============================================================
// CardHeader
// ============================================================

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, description, actions, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-start justify-between gap-4 pb-4', className)}
      {...props}
    >
      {(title || description) ? (
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-base font-semibold text-text-primary leading-tight truncate">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-text-secondary">{description}</p>
          )}
        </div>
      ) : (
        children
      )}
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>
      )}
    </div>
  )
)
CardHeader.displayName = 'CardHeader'

// ============================================================
// CardBody
// ============================================================

const CardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
))
CardBody.displayName = 'CardBody'

// ============================================================
// CardFooter
// ============================================================

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center gap-2 pt-4 mt-4 border-t border-border text-sm text-text-muted',
      className
    )}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardBody, CardFooter, cardVariants }
