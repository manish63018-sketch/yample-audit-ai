'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Gauge,
  Search,
  Accessibility,
  ShieldCheck,
  BrainCircuit,
  TrendingUp,
} from 'lucide-react'
import { Card, CardBody } from '@/components/ui/card'

/**
 * Features Section — docs/02-UI-UX-Blueprint.md
 * 6 cards: Performance, SEO, Accessibility, AI Analysis, Revenue, Competitors
 */

const FEATURES = [
  {
    id: 'performance',
    icon: Gauge,
    title: 'Performance Analysis',
    description:
      'Deep PageSpeed and Lighthouse analysis with Core Web Vitals — LCP, CLS, INP, TTFB. Get actionable developer-level fixes, not just scores.',
    color: '#2563EB',
    metrics: ['Core Web Vitals', 'Lighthouse', 'PageSpeed API'],
  },
  {
    id: 'seo',
    icon: Search,
    title: 'SEO Intelligence',
    description:
      'Full on-page SEO audit: meta, headings, structured data, sitemaps, robots, canonicals, and internal linking analysis with AI prioritization.',
    color: '#22C55E',
    metrics: ['On-Page SEO', 'Structured Data', 'Sitemaps'],
  },
  {
    id: 'accessibility',
    icon: Accessibility,
    title: 'Accessibility Audit',
    description:
      'WCAG AA compliance checks powered by axe-core. Identify ARIA issues, color contrast failures, keyboard navigation gaps, and screen reader problems.',
    color: '#A78BFA',
    metrics: ['WCAG AA', 'axe-core', 'Keyboard Nav'],
  },
  {
    id: 'security',
    icon: ShieldCheck,
    title: 'Security Scan',
    description:
      'SSL validity, security headers, CSP policy, mixed content, and OWASP vulnerability detection. Know your risk before your visitors do.',
    color: '#F59E0B',
    metrics: ['SSL/TLS', 'OWASP', 'Security Headers'],
  },
  {
    id: 'ai',
    icon: BrainCircuit,
    title: 'AI Decision Engine',
    description:
      'Claude, Gemini, and GPT analyze your audit data and generate business-grade reports — Executive Summary, Developer Guide, Client Proposal — in one click.',
    color: '#60A5FA',
    metrics: ['Claude AI', 'Gemini Vision', 'GPT-4'],
  },
  {
    id: 'revenue',
    icon: TrendingUp,
    title: 'Revenue Intelligence',
    description:
      'Transform technical findings into business impact. Estimate revenue opportunities, conversion improvements, and ROI for every recommendation.',
    color: '#34D399',
    metrics: ['Revenue Estimates', 'Competitor Intel', 'ROI Calculator'],
  },
] as const

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function Features() {
  return (
    <section
      id="features"
      className="section bg-background"
      aria-labelledby="features-heading"
    >
      <div className="container max-w-7xl mx-auto px-5 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <motion.p
            className="text-sm font-semibold text-brand uppercase tracking-widest mb-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Everything You Need
          </motion.p>
          <motion.h2
            id="features-heading"
            className="text-balance"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            One Platform.{' '}
            <span className="gradient-text">Every Insight.</span>
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto text-balance"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            AuditAI combines technical analysis with AI business intelligence
            to give you insights that actually drive decisions.
          </motion.p>
        </div>

        {/* Features grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          role="list"
          aria-label="Product features"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div key={feature.id} variants={itemVariants} role="listitem">
                <Card
                  variant="elevated"
                  padding="md"
                  className="h-full group hover:-translate-y-1 transition-transform duration-200"
                >
                  <CardBody>
                    {/* Icon */}
                    <div
                      className="h-11 w-11 rounded-xl flex items-center justify-center mb-5"
                      style={{
                        background: `${feature.color}18`,
                        border: `1px solid ${feature.color}30`,
                      }}
                    >
                      <Icon
                        className="h-5 w-5"
                        style={{ color: feature.color }}
                        aria-hidden="true"
                      />
                    </div>

                    {/* Content */}
                    <h3 className="text-base font-semibold text-text-primary mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed mb-5">
                      {feature.description}
                    </p>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-2">
                      {feature.metrics.map((metric) => (
                        <span
                          key={metric}
                          className="text-xs px-2.5 py-1 rounded-full border border-border text-text-muted bg-background-elevated"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
