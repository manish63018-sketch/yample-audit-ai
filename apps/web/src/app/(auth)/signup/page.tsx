'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  UserPlus,
  AlertCircle,
  Phone,
  Globe,
  Building2,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Field } from '@/components/ui/input'
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/card'
import { useAuth } from '@/providers/auth-provider'

const COUNTRIES = [
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SG', name: 'Singapore' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'PH', name: 'Philippines' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'OTHER', name: 'Other' },
]

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [country, setCountry] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Consent checkboxes
  const [consentPrivacy, setConsentPrivacy] = useState(false)
  const [consentTerms, setConsentTerms] = useState(false)
  const [consentCookies, setConsentCookies] = useState(false)
  const [consentDataProcessing, setConsentDataProcessing] = useState(false)

  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { signUp } = useAuth()
  const router = useRouter()

  const allConsentsGiven = consentPrivacy && consentTerms && consentCookies && consentDataProcessing

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate required fields
    if (!fullName || !email || !mobile || !country || !password) {
      setError('Please fill in all required fields (Full Name, Email, Mobile, Country, Password).')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.')
      return
    }

    if (!allConsentsGiven) {
      setError('You must accept all consent checkboxes before creating your account.')
      return
    }

    setIsSubmitting(true)

    try {
      await signUp({
        fullName,
        email,
        password,
        companyName,
        // Extra metadata stored in user profile
        // @ts-ignore – extended params
        mobile,
        country,
        websiteUrl,
        consentPrivacy,
        consentTerms,
        consentCookies,
        consentDataProcessing,
        consentAt: new Date().toISOString(),
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
        title={<span className="text-xl font-semibold">Create Your AuditAI Account</span>}
        description="Join thousands of businesses using AI-powered website audits."
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
          {/* Full Name */}
          <Field label="Full Name" htmlFor="signup-fullName" required>
            <Input
              id="signup-fullName"
              type="text"
              placeholder="Rahul Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              required
            />
          </Field>

          {/* Email */}
          <Field label="Email Address" htmlFor="signup-email" required>
            <Input
              id="signup-email"
              type="email"
              placeholder="rahul@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </Field>

          {/* Mobile */}
          <Field label="Mobile / WhatsApp Number" htmlFor="signup-mobile" required hint="Include country code e.g. +91 98765 43210">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <Input
                id="signup-mobile"
                type="tel"
                placeholder="+91 98765 43210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                autoComplete="tel"
                required
                className="pl-9"
              />
            </div>
          </Field>

          {/* Country */}
          <Field label="Country" htmlFor="signup-country" required>
            <div className="relative">
              <select
                id="signup-country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-colors"
              >
                <option value="" disabled className="bg-slate-900 text-slate-400">
                  Select your country…
                </option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name} className="bg-slate-900 text-white">
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </Field>

          {/* Company Name (optional) */}
          <Field label="Company Name" htmlFor="signup-company" hint="Optional — leave blank if freelancer">
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <Input
                id="signup-company"
                type="text"
                placeholder="Yample Labs (optional)"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="pl-9"
              />
            </div>
          </Field>

          {/* Website URL (optional) */}
          <Field label="Website URL" htmlFor="signup-website" hint="Optional — your current website">
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <Input
                id="signup-website"
                type="url"
                placeholder="https://yourwebsite.com (optional)"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                autoComplete="url"
                className="pl-9"
              />
            </div>
          </Field>

          {/* Password */}
          <Field label="Password" htmlFor="signup-password" required hint="Minimum 8 characters.">
            <Input
              id="signup-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </Field>

          {/* Confirm Password */}
          <Field label="Confirm Password" htmlFor="signup-confirm-password" required>
            <Input
              id="signup-confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </Field>

          {/* ====== CONSENT SECTION ====== */}
          <div className="pt-2 pb-1 space-y-3 border border-white/10 rounded-xl p-4 bg-white/[0.02]">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-4 w-4 text-violet-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Your Consent & Agreements</span>
            </div>

            {[
              {
                id: 'consent-privacy',
                checked: consentPrivacy,
                onChange: setConsentPrivacy,
                label: (
                  <>
                    I have read and agree to the{' '}
                    <Link href="/privacy" target="_blank" className="text-violet-400 hover:underline font-semibold">
                      Privacy Policy
                    </Link>
                  </>
                ),
              },
              {
                id: 'consent-terms',
                checked: consentTerms,
                onChange: setConsentTerms,
                label: (
                  <>
                    I agree to the{' '}
                    <Link href="/terms" target="_blank" className="text-violet-400 hover:underline font-semibold">
                      Terms & Conditions
                    </Link>
                  </>
                ),
              },
              {
                id: 'consent-cookies',
                checked: consentCookies,
                onChange: setConsentCookies,
                label: (
                  <>
                    I accept the use of cookies as described in the{' '}
                    <Link href="/cookies" target="_blank" className="text-violet-400 hover:underline font-semibold">
                      Cookie Policy
                    </Link>
                  </>
                ),
              },
              {
                id: 'consent-data',
                checked: consentDataProcessing,
                onChange: setConsentDataProcessing,
                label: (
                  <>
                    I consent to processing of my personal data for quote generation, project management, and service delivery by Yample Labs
                  </>
                ),
              },
            ].map((item) => (
              <label key={item.id} htmlFor={item.id} className="flex items-start gap-3 cursor-pointer group">
                <input
                  id={item.id}
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => item.onChange(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border border-white/20 bg-white/5 accent-violet-500 cursor-pointer"
                />
                <span className="text-xs text-slate-300 leading-relaxed group-hover:text-white transition-colors">
                  {item.label}
                </span>
              </label>
            ))}

            {!allConsentsGiven && (
              <p className="text-[10px] text-amber-400 mt-1">
                ⚠ All checkboxes are required to create your account.
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isSubmitting}
            disabled={!allConsentsGiven}
            leftIcon={<UserPlus className="h-4 w-4" aria-hidden="true" />}
          >
            Create Free Account
          </Button>
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
