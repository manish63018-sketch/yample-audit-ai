'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Zap, ShoppingCart, ArrowRight } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { CurrencyToggle } from '@/components/CurrencyToggle'
import { cn } from '@/lib/utils'

/**
 * Top Sticky Navigation Bar — Glassmorphic Apple/Vercel/Linear style
 * Links: AI Audit, Solutions, Pricing, Case Studies, Resources, Contact
 * Right: Cart 🛒, Login, Start Audit
 */

const NAV_LINKS = [
  { label: 'AI Audit', href: '/audit' },
  { label: 'Solutions', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '#contact' },
] as const

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { itemCount } = useCart()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
          'sticky top-0 left-0 right-0 z-50',
          'h-20 flex items-center',
          'transition-all duration-300',
          isScrolled
            ? 'glass-header shadow-2xl shadow-black/40'
            : 'bg-[#050816]/70 backdrop-blur-md border-b border-white/5'
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
              className="flex items-center gap-3 group flex-shrink-0"
              aria-label="AuditAI — Home"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-all duration-300">
                <Zap className="h-5 w-5 text-white fill-white/20" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-violet-300 transition-colors">
                  Audit<span className="text-[#4F8CFF]">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                  by Yample Labs
                </span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <ul
              className="hidden lg:flex items-center gap-1 bg-white/3 border border-white/5 rounded-full px-3 py-1.5 backdrop-blur-md"
              role="list"
              aria-label="Navigation links"
            >
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'px-4 py-2 rounded-full text-xs font-medium tracking-wide',
                      'text-slate-300 hover:text-white',
                      'hover:bg-white/10',
                      'transition-all duration-200'
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right Side CTAs */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Currency Toggle */}
              <CurrencyToggle />

              {/* Cart Button */}
              <Link
                href="/cart"
                className="relative p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition-all flex items-center gap-2 text-xs font-medium"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="h-4 w-4 text-violet-400" />
                <span className="hidden md:inline">Cart</span>
                {itemCount > 0 && (
                  <span className="ml-0.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white text-[10px] font-bold shadow-md shadow-purple-500/30">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Login Button */}
              <Link
                href="/login"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white border border-transparent hover:border-white/10 hover:bg-white/5 transition-all"
              >
                Login
              </Link>

              {/* Start Audit Primary Gradient CTA */}
              <Link
                href="/audit"
                className="btn-gradient-primary px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
              >
                <span>Start Audit</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <button
              className={cn(
                'lg:hidden flex items-center justify-center',
                'h-10 w-10 rounded-xl',
                'border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10',
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
          'fixed inset-0 z-40 lg:hidden',
          'transition-opacity duration-300',
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Slide-in panel */}
        <div
          className={cn(
            'absolute top-0 right-0 bottom-0 w-80',
            'bg-[#0F172A] border-l border-white/10',
            'flex flex-col shadow-2xl',
            'transition-transform duration-300 ease-out',
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-6 h-20 border-b border-white/10">
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" aria-hidden="true" />
              </div>
              <span className="font-bold text-white">
                Audit<span className="text-violet-400">AI</span>
              </span>
            </Link>
            <button
              className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto" aria-label="Mobile navigation links">
            <ul className="space-y-2" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile CTAs */}
          <div className="p-6 border-t border-white/10 flex flex-col gap-3 bg-[#050816]/50">
            <Link
              href="/cart"
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 bg-white/5 text-slate-200 text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ShoppingCart className="h-4 w-4 text-violet-400" />
              <span>View Cart ({itemCount})</span>
            </Link>
            <Link
              href="/login"
              className="text-center py-3 rounded-xl border border-white/10 bg-white/5 text-slate-200 text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/audit"
              className="btn-gradient-primary text-center py-3 rounded-xl text-sm font-semibold shadow-lg shadow-purple-500/25"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Start Free Audit →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

