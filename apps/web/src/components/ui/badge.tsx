import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Badge component for status indicators, counts, and labels.
 * Following docs/02-components.md — subtle background, rounded pill.
 */
const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-background-elevated text-text-secondary border border-border',
        primary: 'bg-brand/15 text-brand border border-brand/20',
        success: 'bg-success-DEFAULT/15 text-success-DEFAULT border border-success-DEFAULT/20',
        warning: 'bg-warning-DEFAULT/15 text-warning-DEFAULT border border-warning-DEFAULT/20',
        danger: 'bg-danger/15 text-danger border border-danger/20',
        // Audit status variants
        queued: 'bg-[#27272A] text-[#A1A1AA] border border-[#3F3F46]',
        running: 'bg-brand/15 text-[#60A5FA] border border-brand/20',
        completed: 'bg-success-DEFAULT/15 text-success-DEFAULT border border-success-DEFAULT/20',
        failed: 'bg-danger/15 text-danger border border-danger/20',
        // Priority variants
        low: 'bg-[#27272A] text-[#A1A1AA] border border-[#3F3F46]',
        medium: 'bg-warning-DEFAULT/15 text-warning-DEFAULT border border-warning-DEFAULT/20',
        high: 'bg-danger/15 text-danger border border-danger/20',
        critical: 'bg-[#EF4444] text-white border border-[#DC2626]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Optional dot indicator before the label */
  dot?: boolean
}

function Badge({ className, variant, dot = false, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props}>
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full flex-shrink-0',
            variant === 'success' || variant === 'completed'
              ? 'bg-success-DEFAULT'
              : variant === 'warning' || variant === 'medium'
                ? 'bg-warning-DEFAULT'
                : variant === 'danger' || variant === 'high' || variant === 'failed'
                  ? 'bg-danger'
                  : variant === 'primary' || variant === 'running'
                    ? 'bg-brand'
                    : 'bg-text-muted'
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}

export { Badge, badgeVariants }
