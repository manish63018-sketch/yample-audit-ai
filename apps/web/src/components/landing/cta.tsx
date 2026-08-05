'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Final CTA Section — bottom of landing page.
 * High-contrast call-to-action with gradient background.
 */
export function CTA() {
  return (
    <section
      className="section relative overflow-hidden bg-background"
      aria-labelledby="cta-heading"
    >
      {/* Gradient background blob */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div
          className="h-[500px] w-[800px] rounded-full blur-[100px] opacity-15"
          style={{ background: 'radial-gradient(ellipse, #2563EB 0%, #7C3AED 100%)' }}
        />
      </div>

      <div className="container max-w-4xl mx-auto px-5 lg:px-8 relative z-10">
        <motion.div
          className="relative rounded-2xl border border-brand/20 bg-gradient-to-b from-brand/5 to-transparent p-10 md:p-14 text-center overflow-hidden"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 h-px w-24 bg-gradient-to-r from-brand to-transparent" aria-hidden="true" />
          <div className="absolute top-0 right-0 h-px w-24 bg-gradient-to-l from-brand to-transparent" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 h-px w-24 bg-gradient-to-r from-brand to-transparent" aria-hidden="true" />
          <div className="absolute bottom-0 right-0 h-px w-24 bg-gradient-to-l from-brand to-transparent" aria-hidden="true" />

          {/* Icon */}
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-brand/15 border border-brand/30 mb-6">
            <Zap className="h-7 w-7 text-brand" aria-hidden="true" />
          </div>

          <h2 id="cta-heading" className="text-balance mb-4">
            Start Auditing Websites{' '}
            <span className="gradient-text">for Free Today</span>
          </h2>

          <p className="text-lg text-text-secondary max-w-xl mx-auto mb-9 text-balance">
            Join 1,200+ agencies and freelancers who use AuditAI to win clients,
            deliver better results, and grow their business.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" asChild>
              <Link href="/signup">
                Start Free — No Credit Card
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <Link href="/demo">View Live Demo</Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-text-muted">
            3 free audits daily &nbsp;·&nbsp; Cancel anytime &nbsp;·&nbsp; GDPR compliant
          </p>
        </motion.div>
      </div>
    </section>
  )
}
