import Link from 'next/link'
import { Zap, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * 404 Not Found page — production quality with proper metadata.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-5">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 text-center max-w-md">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2.5 mb-10" aria-label="AuditAI — Home">
          <div className="h-9 w-9 rounded-lg bg-brand flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <span className="font-semibold text-xl text-text-primary tracking-tight">
            Audit<span className="text-brand">AI</span>
          </span>
        </Link>

        {/* 404 number */}
        <div className="text-8xl font-bold gradient-text mb-4 leading-none" aria-hidden="true">
          404
        </div>

        <h1 className="text-2xl font-semibold text-text-primary mb-3">
          Page Not Found
        </h1>
        <p className="text-text-secondary mb-9">
          We couldn&apos;t find the page you&apos;re looking for. It may have
          been moved, renamed, or no longer exists.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" size="md" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Home
            </Link>
          </Button>
          <Button variant="secondary" size="md" asChild>
            <Link href="/support">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
