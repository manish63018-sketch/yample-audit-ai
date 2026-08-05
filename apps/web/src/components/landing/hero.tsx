'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Play,
  Zap,
  Globe,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

/**
 * Hero Section — docs/02-UI-UX-Blueprint.md
 * Large heading, subheading, dual CTAs, animated dashboard preview
 */

const TRUST_METRICS = [
  { value: '50,000+', label: 'Websites Audited' },
  { value: '1,200+', label: 'Agencies Trust Us' },
  { value: '98%', label: 'Satisfaction Rate' },
] as const

const HERO_FEATURES = [
  'Performance Analysis',
  'SEO Intelligence',
  'AI Business Insights',
  'PDF Reports',
] as const

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40" aria-hidden="true" />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #2563EB 0%, #7C3AED 100%)' }}
        aria-hidden="true"
      />

      <div className="container max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Announcement badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="#features"
              className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-brand/30 bg-brand/10 text-sm text-brand hover:bg-brand/15 transition-colors"
            >
              <Zap className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Introducing AI Business Consultant Mode</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            id="hero-heading"
            className="text-balance max-w-4xl font-semibold tracking-tight"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            The AI-Powered{' '}
            <span className="gradient-text">Website Intelligence</span>{' '}
            Platform
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="mt-6 text-lg md:text-xl text-text-secondary max-w-2xl text-balance"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            AuditAI transforms complex website audits into clear business
            decisions. Performance, SEO, accessibility, security — analyzed by
            AI and delivered as professional reports your clients understand.
          </motion.p>

          {/* Feature list */}
          <motion.ul
            className="mt-5 flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            role="list"
            aria-label="Key features"
          >
            {HERO_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-1.5 text-sm text-text-secondary">
                <CheckCircle2 className="h-4 w-4 text-success-DEFAULT flex-shrink-0" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </motion.ul>

          {/* CTA buttons */}
          <motion.div
            className="mt-9 flex flex-col sm:flex-row items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <Button variant="primary" size="lg" asChild>
              <Link href="/signup">
                Start Free Audit
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="#demo" className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full border border-border-subtle bg-background-elevated flex items-center justify-center">
                  <Play className="h-3 w-3 text-text-primary ml-0.5" aria-hidden="true" />
                </div>
                Watch Demo
              </Link>
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="mt-8 text-xs text-text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            No credit card required &nbsp;·&nbsp; 3 free audits daily &nbsp;·&nbsp; Cancel anytime
          </motion.div>

          {/* Animated dashboard preview */}
          <motion.div
            className="mt-16 w-full max-w-5xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <DashboardPreview />
          </motion.div>

          {/* Trust metrics */}
          <motion.div
            className="mt-14 flex flex-wrap items-center justify-center gap-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            {TRUST_METRICS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-semibold text-text-primary">{value}</div>
                <div className="text-sm text-text-secondary mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/** Animated dashboard mockup showing real audit data */
function DashboardPreview() {
  const scores = [
    { label: 'Performance', score: 54, color: '#F59E0B' },
    { label: 'SEO', score: 78, color: '#22C55E' },
    { label: 'Accessibility', score: 62, color: '#F59E0B' },
    { label: 'Security', score: 41, color: '#EF4444' },
    { label: 'Best Practices', score: 83, color: '#22C55E' },
  ]

  return (
    <div className="relative rounded-xl border border-border overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.8)] glass">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-background-card/80">
        <span className="h-3 w-3 rounded-full bg-[#EF4444] opacity-80" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-[#F59E0B] opacity-80" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-[#22C55E] opacity-80" aria-hidden="true" />
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 bg-background-elevated rounded-md px-4 py-1 text-xs text-text-muted">
            <Globe className="h-3 w-3" aria-hidden="true" />
            auditai.yamplelabs.com
          </div>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="bg-[#0D0D10] p-5 md:p-7">
        {/* Audit URL bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 flex items-center gap-3 bg-background-card rounded-lg border border-border px-4 py-3">
            <Globe className="h-4 w-4 text-text-muted flex-shrink-0" aria-hidden="true" />
            <span className="text-sm text-text-secondary">https://example-restaurant.com</span>
          </div>
          <div className="flex-shrink-0 px-4 py-3 rounded-lg bg-brand text-white text-sm font-medium flex items-center gap-2">
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Analyze</span>
          </div>
        </div>

        {/* Score cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
          {scores.map(({ label, score, color }) => (
            <motion.div
              key={label}
              className="bg-background-card rounded-lg border border-border p-3 text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 + scores.indexOf({ label, score, color }) * 0.08 }}
            >
              <div className="text-2xl font-bold" style={{ color }}>
                {score}
              </div>
              <div className="text-xs text-text-muted mt-1">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* AI insight card */}
        <div className="bg-background-card rounded-lg border border-brand/20 p-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-brand/15 flex items-center justify-center flex-shrink-0">
              <Zap className="h-4 w-4 text-brand" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-text-primary">AI Business Insight</span>
                <Badge variant="primary" dot>High Priority</Badge>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Your homepage loads in 5.2s on mobile — slower than 73% of competing restaurants. 
                This is likely causing visitors to leave before viewing your menu. 
                Optimizing images could reduce load time by ~2.4s and increase conversions by an estimated 18–24%.
              </p>
              <div className="flex items-center gap-3 mt-3">
                <Badge variant="danger">Performance: 54</Badge>
                <Badge variant="default">Confidence: High</Badge>
                <span className="text-xs text-text-muted">Est. Revenue Impact: +$3,200/mo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security warning */}
        <div className="mt-3 flex items-center gap-3 bg-background-card rounded-lg border border-danger/20 px-4 py-3">
          <ShieldCheck className="h-4 w-4 text-danger flex-shrink-0" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-text-secondary">
              <span className="text-danger font-medium">Security Alert: </span>
              Missing Content Security Policy header. Vulnerability could expose visitors to XSS attacks.
            </p>
          </div>
          <Badge variant="high" dot>Critical</Badge>
        </div>
      </div>
    </div>
  )
}
