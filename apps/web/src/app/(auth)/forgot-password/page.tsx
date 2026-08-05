'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Field } from '@/components/ui/input'
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/card'
import { AuthService } from '@/services/auth.service'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email) {
      setError('Please enter your account email address.')
      return
    }

    setIsSubmitting(true)

    try {
      await AuthService.resetPassword(email)
      setIsSuccess(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send reset link.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card variant="elevated" padding="lg" className="w-full">
      <CardHeader
        title={<span className="text-xl font-semibold">Reset Password</span>}
        description="Enter your email to receive a password reset link."
      />

      <CardBody className="mt-4">
        {error && (
          <div
            className="mb-5 flex items-start gap-3 rounded-lg border border-danger/30 bg-danger/10 p-3.5 text-xs text-danger"
            role="alert"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {isSuccess ? (
          <div className="space-y-4 text-center py-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-success-DEFAULT/20 border border-success-DEFAULT/30 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-success-DEFAULT" aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold text-text-primary">Check your inbox</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              We&apos;ve sent a password reset link to <strong className="text-text-primary">{email}</strong>.
              Please check your email to create a new password.
            </p>
            <Button variant="secondary" size="md" className="w-full mt-4" asChild>
              <Link href="/login">Back to Sign in</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Field label="Work Email" htmlFor="email" required>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </Field>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isSubmitting}
              leftIcon={<KeyRound className="h-4 w-4" aria-hidden="true" />}
            >
              Send Reset Link
            </Button>
          </form>
        )}
      </CardBody>

      {!isSuccess && (
        <CardFooter className="justify-center text-xs">
          <span className="text-text-muted">Remembered your password?</span>
          <Link href="/login" className="text-brand font-medium hover:underline underline-offset-4 ml-1">
            Sign in
          </Link>
        </CardFooter>
      )}
    </Card>
  )
}
