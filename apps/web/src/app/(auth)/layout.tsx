import React from 'react'
import Link from 'next/link'
import { Zap, ShieldCheck, CheckCircle2 } from 'lucide-react'

/**
 * Split-screen layout for Auth pages (/login, /signup, /forgot-password)
 * Left: Dark marketing panel with product value proposition & social proof
 * Right: Centered form card
 */

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Left panel — Marketing banner */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-background-card border-r border-border relative overflow-hidden">
        {/* Background gradient blob */}
        <div
          className="absolute -top-32 -left-32 h-96 w-96 rounded-full blur-[100px] opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #2563EB 0%, #7C3AED 100%)' }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" aria-hidden="true" />

        {/* Brand logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 group" aria-label="AuditAI — Home">
            <div className="h-9 w-9 rounded-xl bg-brand flex items-center justify-center shadow-glow-sm">
              <Zap className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <span className="font-semibold text-xl text-text-primary tracking-tight">
              Audit<span className="text-brand">AI</span>
            </span>
          </Link>
        </div>

        {/* Testimonial / Value prop */}
        <div className="relative z-10 max-w-md my-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand/30 bg-brand/10 text-xs font-medium text-brand">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Enterprise-Grade SaaS Platform
          </div>

          <h2 className="text-3xl font-semibold text-text-primary leading-tight">
            Turn Technical Audits into Business Decisions
          </h2>

          <p className="text-text-secondary leading-relaxed text-sm">
            &ldquo;AuditAI cut our agency proposal prep time from 4 hours to 5 minutes.
            Our clients actually read and understand the reports.&rdquo;
          </p>

          <div className="flex items-center gap-3 pt-2">
            <div className="h-10 w-10 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center font-bold text-brand text-sm">
              YL
            </div>
            <div>
              <div className="text-sm font-semibold text-text-primary">Marcus Vance</div>
              <div className="text-xs text-text-muted">CEO at Apex Digital Agency</div>
            </div>
          </div>

          <ul className="space-y-2.5 pt-4 text-xs text-text-secondary border-t border-border">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success-DEFAULT flex-shrink-0" />
              <span>PageSpeed, Lighthouse, WCAG AA, and Security scans</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success-DEFAULT flex-shrink-0" />
              <span>AI Executive Summaries & Client Proposals</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success-DEFAULT flex-shrink-0" />
              <span>Full built-in CRM with lead import</span>
            </li>
          </ul>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-text-muted">
          &copy; {new Date().getFullYear()} Yample Labs. All rights reserved.
        </div>
      </div>

      {/* Right panel — Form container */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative">
        {/* Mobile brand header */}
        <div className="lg:hidden w-full max-w-md mb-8 flex justify-center">
          <Link href="/" className="inline-flex items-center gap-2" aria-label="AuditAI — Home">
            <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-lg text-text-primary">
              Audit<span className="text-brand">AI</span>
            </span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
