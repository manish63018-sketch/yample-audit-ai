import React from 'react'
import Link from 'next/link'
import { Zap, Github, Twitter } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

/**
 * Site Footer
 * Following docs/02-UI-UX-Blueprint.md — Privacy, Terms, Docs, GitHub, API, Support links
 */

const FOOTER_LINKS = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Changelog', href: '/changelog' },
    { label: 'Roadmap', href: '/roadmap' },
  ],
  Developers: [
    { label: 'API Docs', href: '/docs/api' },
    { label: 'GitHub', href: 'https://github.com/yamplabs/auditai', external: true },
    { label: 'Status', href: '/status' },
    { label: 'Integrations', href: '/integrations' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Support', href: '/support' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Security', href: '/security' },
  ],
} as const

const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/yamplabs/auditai',
    icon: Github,
  },
  {
    label: 'Twitter / X',
    href: 'https://twitter.com/yamplabs',
    icon: Twitter,
  },
] as const

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      role="contentinfo"
      className="border-t border-border bg-background"
      aria-label="Site footer"
    >
      <div className="container max-w-7xl mx-auto px-5 lg:px-8">
        {/* Main footer content */}
        <div className="py-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 group mb-4"
              aria-label="AuditAI — Home"
            >
              <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" aria-hidden="true" />
              </div>
              <span className="font-semibold text-[1.05rem] text-text-primary tracking-tight">
                Audit<span className="text-brand">AI</span>
              </span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
              AI-powered website intelligence that transforms technical audits
              into clear business decisions.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3 mt-5">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="h-9 w-9 flex items-center justify-center rounded-md border border-border text-text-muted hover:text-text-primary hover:border-border-subtle hover:bg-background-card transition-all duration-150"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <nav key={category} aria-label={`${category} links`}>
              <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-3" role="list">
                {links.map((link) => (
                  <li key={link.href}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <Separator />

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            &copy; {currentYear} Yample Labs. All rights reserved.
          </p>
          <p className="text-xs text-text-muted">
            Built for agencies, developers, and businesses worldwide.
          </p>
        </div>
      </div>
    </footer>
  )
}
