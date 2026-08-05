'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Zap, Building2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/**
 * Pricing Section — 3 tiers from docs/01-Constitution.md
 * Free: 3 audits/day; Pro: unlimited + AI; Agency: everything + CRM
 */

type BillingCycle = 'monthly' | 'annual'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    icon: User,
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'Get started with website auditing. No credit card required.',
    badge: null,
    ctaLabel: 'Start for Free',
    ctaHref: '/signup',
    ctaVariant: 'secondary' as const,
    features: [
      '3 audits per day',
      'Performance analysis (Lighthouse)',
      'Basic SEO scan',
      'Accessibility overview',
      'PDF export (watermarked)',
      'Dashboard history (7 days)',
    ],
    limitations: [
      'No AI analysis',
      'No competitor intelligence',
      'No CRM or proposals',
      'No white-label reports',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: Zap,
    monthlyPrice: 49,
    annualPrice: 39,
    description: 'For professionals who need full intelligence and AI-powered reports.',
    badge: 'Most Popular',
    ctaLabel: 'Start Pro Trial',
    ctaHref: '/signup?plan=pro',
    ctaVariant: 'primary' as const,
    features: [
      'Unlimited audits',
      'Full AI analysis (Claude + Gemini + GPT)',
      'Revenue opportunity reports',
      'Competitor intelligence',
      'White-label PDF exports',
      'API access',
      'Team collaboration (3 seats)',
      'Priority email support',
      'Dashboard history (1 year)',
      'Custom report branding',
    ],
    limitations: [],
  },
  {
    id: 'agency',
    name: 'Agency',
    icon: Building2,
    monthlyPrice: 149,
    annualPrice: 119,
    description: 'For agencies that want to win clients using their own website data.',
    badge: null,
    ctaLabel: 'Start Agency Trial',
    ctaHref: '/signup?plan=agency',
    ctaVariant: 'secondary' as const,
    features: [
      'Everything in Pro',
      'Full CRM with Kanban pipeline',
      'AI proposal generator',
      'Cold email & LinkedIn generator',
      'Bulk lead import (CSV, Google Maps)',
      'Invoice management',
      'Client portal (white-label)',
      'Unlimited team seats',
      'Priority phone & chat support',
      'Custom AI model configuration',
      'Dedicated account manager',
    ],
    limitations: [],
  },
] as const

export function Pricing() {
  const [billing, setBilling] = useState<BillingCycle>('monthly')

  return (
    <section
      id="pricing"
      className="section bg-background"
      aria-labelledby="pricing-heading"
    >
      <div className="container max-w-7xl mx-auto px-5 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <motion.p
            className="text-sm font-semibold text-brand uppercase tracking-widest mb-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Simple Pricing
          </motion.p>
          <motion.h2
            id="pricing-heading"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Start Free.{' '}
            <span className="gradient-text">Scale as You Grow.</span>
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-text-secondary max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            No hidden fees. No lock-in. Cancel or downgrade anytime.
          </motion.p>

          {/* Billing toggle */}
          <motion.div
            className="mt-8 inline-flex items-center gap-1 p-1 rounded-lg border border-border bg-background-card"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            role="group"
            aria-label="Billing cycle"
          >
            <button
              onClick={() => setBilling('monthly')}
              className={cn(
                'px-5 py-2 rounded-md text-sm font-medium transition-all duration-150',
                billing === 'monthly'
                  ? 'bg-brand text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              )}
              aria-pressed={billing === 'monthly'}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={cn(
                'px-5 py-2 rounded-md text-sm font-medium transition-all duration-150 flex items-center gap-2',
                billing === 'annual'
                  ? 'bg-brand text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              )}
              aria-pressed={billing === 'annual'}
            >
              Annual
              <span className="text-xs bg-success-DEFAULT/20 text-success-DEFAULT px-1.5 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </motion.div>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {PLANS.map((plan, index) => {
            const Icon = plan.icon
            const price = billing === 'annual' ? plan.annualPrice : plan.monthlyPrice
            const isPro = plan.id === 'pro'

            return (
              <motion.div
                key={plan.id}
                className={cn(
                  'relative rounded-xl border p-7 flex flex-col',
                  isPro
                    ? 'border-brand/50 bg-gradient-to-b from-brand/5 to-transparent shadow-[0_0_40px_rgba(37,99,235,0.12)]'
                    : 'border-border bg-background-card'
                )}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {/* Popular badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge variant="primary" className="shadow-sm px-4 py-1 text-xs font-semibold">
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                {/* Plan icon & name */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className={cn(
                      'h-10 w-10 rounded-lg flex items-center justify-center',
                      isPro ? 'bg-brand/20 text-brand' : 'bg-background-elevated text-text-secondary'
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">{plan.name}</h3>
                    <p className="text-xs text-text-muted">{plan.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-bold text-text-primary">
                      {price === 0 ? 'Free' : `$${price}`}
                    </span>
                    {price > 0 && (
                      <span className="text-text-muted text-sm">/month</span>
                    )}
                  </div>
                  {billing === 'annual' && price > 0 && (
                    <p className="text-xs text-text-muted mt-1">
                      Billed annually (${price * 12}/yr)
                    </p>
                  )}
                </div>

                {/* CTA */}
                <Button variant={plan.ctaVariant} size="md" className="w-full mb-7" asChild>
                  <Link href={plan.ctaHref}>{plan.ctaLabel}</Link>
                </Button>

                {/* Features */}
                <ul className="space-y-3 flex-1" role="list" aria-label={`${plan.name} plan features`}>
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check
                        className={cn('h-4 w-4 flex-shrink-0 mt-0.5', isPro ? 'text-brand' : 'text-success-DEFAULT')}
                        aria-hidden="true"
                      />
                      <span className="text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>

        {/* Enterprise callout */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-sm text-text-muted">
            Need a custom enterprise plan?{' '}
            <Link href="/contact" className="text-brand hover:underline underline-offset-4 transition-colors">
              Talk to our team →
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
