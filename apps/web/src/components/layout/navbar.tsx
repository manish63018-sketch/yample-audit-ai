'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Zap, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Top Navigation Bar — 72px height as specified in docs/02-UI-UX-Blueprint.md
 * Contains: Logo, Nav Links, CTA button
 * Behavior: glass on scroll, mobile menu
 */

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
] as const

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  return (
    <>
      <header
        role="banner"
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'h-18 flex items-center',
          'transition-all duration-200',
          isScrolled
            ? 'glass border-b border-border/60'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        <div className="container max-w-7xl mx-auto px-5 lg:px-8">
          <nav
            className="flex items-center justify-between h-full"
            aria-label="Main navigation"
          >
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group flex-shrink-0"
              aria-label="AuditAI — Home"
            >
              <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-shadow duration-200">
                <Zap className="h-4 w-4 text-white" aria-hidden="true" />
              </div>
              <span className="font-semibold text-[1.05rem] text-text-primary tracking-tight">
                Audit<span className="text-brand">AI</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <ul
              className="hidden md:flex items-center gap-1"
              role="list"
              aria-label="Navigation links"
            >
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'px-4 py-2 rounded-md text-sm font-medium',
                      'text-text-secondary hover:text-text-primary',
                      'hover:bg-background-card',
                      'transition-all duration-150'
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button variant="primary" size="sm" asChild>
                <Link href="/signup">
                  Get Started
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            {/* Mobile menu toggle */}
            <button
              className={cn(
                'md:hidden flex items-center justify-center',
                'h-10 w-10 rounded-md',
                'text-text-secondary hover:text-text-primary hover:bg-background-card',
                'transition-colors duration-150'
              )}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={cn(
          'fixed inset-0 z-40 md:hidden',
          'transition-opacity duration-200',
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Slide-in panel */}
        <div
          className={cn(
            'absolute top-0 right-0 bottom-0 w-72',
            'bg-background-card border-l border-border',
            'flex flex-col',
            'transition-transform duration-300 ease-out',
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 h-18 border-b border-border">
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="h-7 w-7 rounded-md bg-brand flex items-center justify-center">
                <Zap className="h-3.5 w-3.5 text-white" aria-hidden="true" />
              </div>
              <span className="font-semibold text-text-primary">
                Audit<span className="text-brand">AI</span>
              </span>
            </Link>
            <button
              className="h-8 w-8 flex items-center justify-center rounded-md text-text-muted hover:text-text-primary hover:bg-background-elevated"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close navigation menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-3 py-4" aria-label="Mobile navigation links">
            <ul className="space-y-1" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-background-elevated transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile CTAs */}
          <div className="px-5 pb-8 pt-4 border-t border-border flex flex-col gap-3">
            <Button variant="secondary" size="md" className="w-full" asChild>
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                Sign in
              </Link>
            </Button>
            <Button variant="primary" size="md" className="w-full" asChild>
              <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                Get Started Free
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
