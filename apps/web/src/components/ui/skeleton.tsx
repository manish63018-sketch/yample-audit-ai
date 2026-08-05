import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Skeleton loading placeholder component.
 * Uses shimmer animation from globals.css.
 * Use matching the real layout structure for best UX.
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width — can be any valid CSS value or Tailwind class */
  width?: string
  /** Height — can be any valid CSS value or Tailwind class */
  height?: string
  /** Render as a circle (for avatars) */
  circle?: boolean
}

function Skeleton({ className, circle = false, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'skeleton animate-pulse',
        circle ? 'rounded-full' : 'rounded-md',
        className
      )}
      aria-hidden="true"
      {...props}
    />
  )
}

// ============================================================
// Common skeleton patterns
// ============================================================

/** Skeleton for a single line of text */
function SkeletonText({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <Skeleton className={cn('h-4 w-full', className)} {...props} />
}

/** Skeleton for a heading */
function SkeletonHeading({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <Skeleton className={cn('h-7 w-3/4', className)} {...props} />
}

/** Skeleton for a metric/stat card */
function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 rounded-lg border border-border bg-background-card space-y-3', className)} {...props}>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  )
}

/** Skeleton for an avatar */
function SkeletonAvatar({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-14 w-14' }
  return <Skeleton circle className={cn(sizes[size], className)} />
}

/** Skeleton for a table row */
function SkeletonTableRow({ columns = 5, className }: { columns?: number; className?: string }) {
  return (
    <div className={cn('flex items-center gap-4 py-3 px-4', className)}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
  )
}

export { Skeleton, SkeletonText, SkeletonHeading, SkeletonCard, SkeletonAvatar, SkeletonTableRow }
