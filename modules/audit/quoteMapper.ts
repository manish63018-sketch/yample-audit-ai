import type { SmartQuoteResult, QuoteItem, AuditScores, BusinessAnalysisResult, SecurityResult } from './types'

/**
 * Smart Quote Generator (Step 13 of Audit Workflow)
 * Automatically maps technical debt and missing features identified in audit to exact Yample Labs solution packages.
 * Applies multi-item bundle discounts (5% to 20%).
 */
export function generateSmartQuote(
  scores: AuditScores,
  business: BusinessAnalysisResult,
  security: SecurityResult,
  country = 'US'
): SmartQuoteResult {
  const isIndia = country === 'IN' || country === 'India'
  const currency = isIndia ? 'INR' : 'USD'
  const rate = isIndia ? 83 : 1

  const items: QuoteItem[] = []

  // 1. Base Upgrade / Website Foundation
  if (scores.performance < 75 || scores.seo < 75 || scores.overall < 75) {
    items.push({
      serviceId: 'website-upgrade',
      title: 'Website Upgrade & Core Web Vitals Overhaul',
      reason: `Current performance score is ${scores.performance}/100 and overall score is ${scores.overall}/100.`,
      price: Math.round(599 * rate),
    })
  } else {
    items.push({
      serviceId: 'custom-website',
      title: 'Custom Website Redesign & Modern UI',
      reason: 'Elevate your brand to a modern, high-converting digital experience.',
      price: Math.round(899 * rate),
    })
  }

  // 2. Admin Dashboard
  const missingAdmin = business.missingFeatures.some((f) => f.feature.toLowerCase().includes('admin') || f.feature.toLowerCase().includes('manage'))
  if (missingAdmin || scores.business < 80) {
    items.push({
      serviceId: 'admin-dashboard',
      title: 'Admin Dashboard & Content Management',
      reason: 'Manage content, services, inquiries, and orders without developer help.',
      price: Math.round(149 * rate),
    })
  }

  // 3. AI Customer Assistant
  const missingChat = business.missingFeatures.some((f) => f.feature.toLowerCase().includes('ai') || f.feature.toLowerCase().includes('chat') || f.feature.toLowerCase().includes('support'))
  if (missingChat || scores.business < 70) {
    items.push({
      serviceId: 'ai-assistant',
      title: '24/7 AI Customer Assistant & Voice Agent',
      reason: 'Capture after-hours leads, answer FAQs instantly, and automate customer inquiry intake.',
      price: Math.round(199 * rate),
    })
  }

  // 4. SEO Overhaul
  if (scores.seo < 75) {
    items.push({
      serviceId: 'seo-setup',
      title: 'Complete On-Page SEO & Schema Setup',
      reason: `SEO score is ${scores.seo}/100 with missing metadata or schema markup.`,
      price: Math.round(149 * rate),
    })
  }

  // 5. Booking / Appointment System
  const missingBooking = business.missingFeatures.some((f) => f.feature.toLowerCase().includes('appointment') || f.feature.toLowerCase().includes('booking') || f.feature.toLowerCase().includes('reservation'))
  if (missingBooking) {
    items.push({
      serviceId: 'booking-system',
      title: 'Online Booking & Scheduling System',
      reason: 'Allow clients to view availability and book appointments directly online.',
      price: Math.round(149 * rate),
    })
  }

  // 6. Security Hardening
  if (scores.security < 75 || !security.hasCsp || !security.hasHsts) {
    items.push({
      serviceId: 'security-hardening',
      title: 'Security Hardening & CSP Protection',
      reason: `Security score is ${scores.security}/100. Missing HSTS or CSP headers.`,
      price: Math.round(99 * rate),
    })
  }

  const subtotal = items.reduce((acc, item) => acc + item.price, 0)
  const addonCount = Math.max(0, items.length - 1)

  let bundleDiscountPercent = 0
  if (addonCount >= 7) bundleDiscountPercent = 20
  else if (addonCount >= 5) bundleDiscountPercent = 15
  else if (addonCount >= 3) bundleDiscountPercent = 10
  else if (addonCount >= 2) bundleDiscountPercent = 5

  const discountAmount = Math.round((subtotal * bundleDiscountPercent) / 100)
  const totalAmount = subtotal - discountAmount

  return {
    recommendedServices: items,
    subtotal,
    bundleDiscountPercent,
    totalAmount,
    currency,
  }
}
