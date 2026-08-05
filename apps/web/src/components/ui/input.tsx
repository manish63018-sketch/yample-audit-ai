import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Input component following docs/02-components.md specification.
 * Supports: text, email, url, number, password, search, textarea
 * Includes: labels, helper text, error states, ARIA attributes
 */

// ============================================================
// Base Input
// ============================================================

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Error message — makes input invalid, adds red border */
  error?: string
  /** Left icon or adornment */
  leftAdornment?: React.ReactNode
  /** Right icon or adornment */
  rightAdornment?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, leftAdornment, rightAdornment, id, ...props }, ref) => {
    const hasError = Boolean(error)

    if (leftAdornment || rightAdornment) {
      return (
        <div className="relative flex items-center">
          {leftAdornment && (
            <div className="pointer-events-none absolute left-3 flex items-center text-text-muted">
              {leftAdornment}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            type={type}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${id}-error` : undefined}
            className={cn(
              'w-full rounded-md border bg-background-card text-text-primary',
              'placeholder:text-text-muted text-sm',
              'h-10 px-3 py-2',
              'transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
              'disabled:cursor-not-allowed disabled:opacity-50',
              leftAdornment && 'pl-9',
              rightAdornment && 'pr-9',
              hasError
                ? 'border-danger focus-visible:ring-danger/30'
                : 'border-border hover:border-border-subtle',
              className
            )}
            {...props}
          />
          {rightAdornment && (
            <div className="absolute right-3 flex items-center text-text-muted">
              {rightAdornment}
            </div>
          )}
        </div>
      )
    }

    return (
      <input
        ref={ref}
        id={id}
        type={type}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        className={cn(
          'w-full rounded-md border bg-background-card text-text-primary',
          'placeholder:text-text-muted text-sm',
          'h-10 px-3 py-2',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
          'disabled:cursor-not-allowed disabled:opacity-50',
          hasError
            ? 'border-danger focus-visible:ring-danger/30'
            : 'border-border hover:border-border-subtle',
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

// ============================================================
// Textarea
// ============================================================

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, resize = 'vertical', id, ...props }, ref) => {
    const hasError = Boolean(error)

    return (
      <textarea
        ref={ref}
        id={id}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        className={cn(
          'w-full rounded-md border bg-background-card text-text-primary',
          'placeholder:text-text-muted text-sm',
          'min-h-[100px] px-3 py-2',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
          'disabled:cursor-not-allowed disabled:opacity-50',
          resize === 'none' && 'resize-none',
          resize === 'vertical' && 'resize-y',
          resize === 'horizontal' && 'resize-x',
          resize === 'both' && 'resize',
          hasError
            ? 'border-danger focus-visible:ring-danger/30'
            : 'border-border hover:border-border-subtle',
          className
        )}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

// ============================================================
// Field wrapper — label + input + hint + error
// ============================================================

export interface FieldProps {
  label: string
  htmlFor?: string
  required?: boolean
  hint?: React.ReactNode
  error?: string
  children: React.ReactNode
  className?: string
}

function Field({ label, htmlFor, required, hint, error, children, className }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-text-primary"
      >
        {label}
        {required && (
          <span className="ml-1 text-danger" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <div className="text-xs text-text-muted">{hint}</div>
      )}
      {error && (
        <p
          id={htmlFor ? `${htmlFor}-error` : undefined}
          className="text-xs text-danger"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  )
}

export { Input, Textarea, Field }
