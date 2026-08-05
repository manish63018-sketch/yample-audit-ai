'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { LogIn, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Field } from '@/components/ui/input'
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/card'
import { useAuth } from '@/providers/auth-provider'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Please fill in both email and password.')
      return
    }

    setIsSubmitting(true)

    try {
      await signIn({ email, password })
      router.push(redirectTo)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid login credentials.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card variant="elevated" padding="lg" className="w-full">
      <CardHeader
        title={<span className="text-xl font-semibold">Sign in to AuditAI</span>}
        description="Enter your email and password to access your account."
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

          <Field
            label="Password"
            htmlFor="password"
            required
            hint={
              <div className="flex justify-end pt-1">
                <Link
                  href="/forgot-password"
                  className="text-xs text-brand hover:underline underline-offset-4"
                >
                  Forgot password?
                </Link>
              </div>
            }
          >
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </Field>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isSubmitting}
            leftIcon={<LogIn className="h-4 w-4" aria-hidden="true" />}
          >
            Sign in
          </Button>
        </form>
      </CardBody>

      <CardFooter className="justify-center text-xs">
        <span className="text-text-muted">Don&apos;t have an account?</span>
        <Link href="/signup" className="text-brand font-medium hover:underline underline-offset-4 ml-1">
          Create account
        </Link>
      </CardFooter>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center p-8 text-white/50">Loading login...</div>}>
      <LoginForm />
    </Suspense>
  )
}
