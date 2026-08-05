'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * FAQ Section — Accessible accordion
 * Following docs/02-UI-UX-Blueprint.md
 */

const FAQS = [
  {
    id: 'faq-1',
    question: 'What websites can AuditAI analyze?',
    answer:
      'AuditAI can analyze any publicly accessible website. Simply enter the full URL (including https://) and our engine will begin the audit. Private or password-protected pages cannot be fully analyzed, but we can still check performance and security headers.',
  },
  {
    id: 'faq-2',
    question: 'How long does a full audit take?',
    answer:
      'A standard audit typically completes in 60–120 seconds. This includes PageSpeed API data, Lighthouse analysis, SEO scanning, accessibility checks, and AI report generation. Complex sites with many resources may take slightly longer.',
  },
  {
    id: 'faq-3',
    question: 'Which AI models power the analysis?',
    answer:
      'AuditAI uses an intelligent router to select the best AI model for each task. Anthropic Claude is used for business reports and executive summaries, Google Gemini for visual/screenshot analysis, and OpenAI GPT for structured JSON outputs and code recommendations. You can configure model preferences in your settings.',
  },
  {
    id: 'faq-4',
    question: 'Can I white-label the reports for my clients?',
    answer:
      'Yes. Pro and Agency plans include white-label PDF exports. You can add your agency logo, brand colors, contact details, and custom cover pages. Agency plan users also get a client portal where clients can log in and view their reports under your brand.',
  },
  {
    id: 'faq-5',
    question: 'Is my data secure and private?',
    answer:
      'All data is encrypted at rest and in transit (TLS 1.3). We never share your audit data or client information with third parties. AI providers process prompts without retaining your data under our enterprise agreements. You can request full data deletion at any time from your account settings.',
  },
  {
    id: 'faq-6',
    question: 'Does AuditAI include a CRM?',
    answer:
      'Agency plan subscribers get access to the full built-in CRM. This includes a Kanban pipeline (New → Won/Lost stages), lead profiles with audit history, AI-generated proposals and emails, invoice management, and a client portal. It is designed specifically for web agencies converting audit leads into paying clients.',
  },
  {
    id: 'faq-7',
    question: 'Can I import leads from Google Maps or CSV?',
    answer:
      'Yes. The Agency plan includes bulk lead import from CSV files and a Google Maps / Places connector that lets you search for local businesses in any niche, scrape their details, and automatically trigger website audits — turning cold prospects into scored, prioritized leads.',
  },
  {
    id: 'faq-8',
    question: 'Is there an API?',
    answer:
      'Pro and Agency plans include full REST API access. You can trigger audits programmatically, retrieve reports in JSON, and integrate AuditAI into your own tools and dashboards. API documentation and OpenAPI schema are available in your account settings.',
  },
] as const

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section
      id="faq"
      className="section bg-background"
      aria-labelledby="faq-heading"
    >
      <div className="container max-w-3xl mx-auto px-5 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <motion.p
            className="text-sm font-semibold text-brand uppercase tracking-widest mb-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Common Questions
          </motion.p>
          <motion.h2
            id="faq-heading"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            className="mt-4 text-text-secondary"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Can&apos;t find what you&apos;re looking for?{' '}
            <a href="/support" className="text-brand hover:underline underline-offset-4">
              Contact support
            </a>
          </motion.p>
        </div>

        {/* FAQ accordion */}
        <motion.dl
          className="space-y-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id

            return (
              <div
                key={faq.id}
                className={cn(
                  'rounded-xl border transition-colors duration-200',
                  isOpen
                    ? 'border-border-subtle bg-background-card'
                    : 'border-border bg-background-card hover:border-border-subtle'
                )}
              >
                {/* Question */}
                <dt>
                  <button
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                    onClick={() => toggle(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`${faq.id}-answer`}
                    id={`${faq.id}-question`}
                  >
                    <span className="font-medium text-text-primary text-sm sm:text-base">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-5 w-5 text-text-muted flex-shrink-0 transition-transform duration-200',
                        isOpen && 'rotate-180'
                      )}
                      aria-hidden="true"
                    />
                  </button>
                </dt>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.dd
                      id={`${faq.id}-answer`}
                      role="region"
                      aria-labelledby={`${faq.id}-question`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm text-text-secondary leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.dd>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </motion.dl>
      </div>
    </section>
  )
}
