'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UserPlus, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Field } from '@/components/ui/input'
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/card'
import { useAuth } from '@/providers/auth-provider'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!fullName || !email || !password || !companyName) {
      setError('Please fill in all required fields.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    setIsSubmitting(true)

    try {
      await signUp({
        fullName,
        email,
        password,
        companyName,
      })
      router.push('/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create account.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card variant="elevated" padding="lg" className="w-full">
      <CardHeader
        title={<span className="text-xl font-semibold">Start Free AuditAI Account</span>}
        description="Create your account to start auditing websites with AI."
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
          <Field label="Full Name" htmlFor="fullName" required>
            <Input
              id="fullName"
              type="text"
              placeholder="Sarah Connor"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              required
            />
          </Field>

          <Field label="Work Email" htmlFor="email" required>
            <Input
              id="email"
              type="email"
              placeholder="sarah@agency.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </Field>

          <Field label="Company / Agency Name" htmlFor="companyName" required hint="Used to create your workspace domain.">
            <Input
              id="companyName"
              type="text"
              placeholder="Apex Creative Agency"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </Field>

          <Field label="Password" htmlFor="password" required hint="Minimum 8 characters.">
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </Field>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isSubmitting}
            leftIcon={<UserPlus className="h-4 w-4" aria-hidden="true" />}
          >
            Create Free Account
          </Button>

          <p className="text-[0.75rem] text-text-muted text-center leading-relaxed">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-brand hover:underline">Terms of Service</Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-brand hover:underline">Privacy Policy</Link>.
          </p>
        </form>
      </CardBody>

      <CardFooter className="justify-center text-xs">
        <span className="text-text-muted">Already have an account?</span>
        <Link href="/login" className="text-brand font-medium hover:underline underline-offset-4 ml-1">
          Sign in
        </Link>
      </CardFooter>
    </Card>
  )
}
