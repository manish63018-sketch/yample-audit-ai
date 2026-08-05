'use client'

import React from 'react'
import { motion } from 'framer-motion'

/**
 * Trusted By Section
 * Professional company name display (no external image dependencies for now).
 * Will be replaced with actual logos as the product gets customers.
 */

const COMPANY_NAMES = [
  'WebFlow Studio',
  'Digital Surge',
  'Apex Creative',
  'NovaTech Agency',
  'Pixel & Co.',
  'Orbit Solutions',
  'Code Collective',
  'Bright Digital',
] as const

export function TrustedBy() {
  return (
    <section
      className="py-14 border-y border-border bg-background-card overflow-hidden"
      aria-label="Trusted by agencies and developers worldwide"
    >
      <div className="container max-w-7xl mx-auto px-5 lg:px-8">
        <motion.p
          className="text-center text-sm text-text-muted mb-8 uppercase tracking-widest font-medium"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Trusted by agencies and freelancers worldwide
        </motion.p>

        {/* Scrolling marquee */}
        <div
          className="relative flex overflow-x-hidden"
          aria-hidden="true"
        >
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none bg-gradient-to-r from-background-card to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none bg-gradient-to-l from-background-card to-transparent" />

          {/* Track 1 */}
          <div className="flex items-center gap-10 animate-marquee whitespace-nowrap flex-shrink-0">
            {[...COMPANY_NAMES, ...COMPANY_NAMES].map((name, i) => (
              <div
                key={`${name}-${i}`}
                className="flex items-center justify-center px-6 py-3 rounded-lg border border-border bg-background-elevated min-w-max"
              >
                <span className="text-sm font-medium text-text-muted">{name}</span>
              </div>
            ))}
          </div>

          {/* Track 2 (seamless duplicate) */}
          <div className="flex items-center gap-10 animate-marquee whitespace-nowrap flex-shrink-0 ml-10">
            {[...COMPANY_NAMES, ...COMPANY_NAMES].map((name, i) => (
              <div
                key={`${name}-dup-${i}`}
                className="flex items-center justify-center px-6 py-3 rounded-lg border border-border bg-background-elevated min-w-max"
              >
                <span className="text-sm font-medium text-text-muted">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
