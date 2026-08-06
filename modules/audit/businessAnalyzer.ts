import type { BusinessAnalysisResult, MissingFeature, CrawlResult, SystemValidationResult } from './types'

/**
 * Business Analysis Engine (Step 9 of Audit Workflow)
 * Detects missing industry-specific features based on business category and crawled content.
 */
export async function analyzeBusiness(
  category: string | undefined,
  crawl: CrawlResult,
  system: SystemValidationResult,
  geminiKey?: string
): Promise<BusinessAnalysisResult> {
  const cat = (category || 'General Business').toLowerCase()
  const allText = crawl.crawledPages
    .map((p) => `${p.url} ${p.title} ${p.h1} ${p.metaDescription} ${(p.internalLinks || []).join(' ')}`)
    .join(' ')
    .toLowerCase()

  const detectedFeatures: string[] = []
  const missingFeatures: MissingFeature[] = []

  if (cat.includes('restaurant') || cat.includes('food') || cat.includes('cafe')) {
    checkFeature(allText, ['menu', 'food', 'dishes', 'cuisine'], 'Online Menu', 'critical', 'Customers want to see menu items before visiting or ordering.', detectedFeatures, missingFeatures)
    checkFeature(allText, ['order', 'delivery', 'takeout', 'cart'], 'Online Ordering / Delivery Integration', 'recommended', 'Increases direct revenue without third-party app commission.', detectedFeatures, missingFeatures)
    checkFeature(allText, ['reserve', 'reservation', 'table', 'book'], 'Table Reservation System', 'recommended', 'Reduces wait times and secures advance bookings.', detectedFeatures, missingFeatures)
    checkFeature(allText, ['review', 'testimonial', 'rating', 'star'], 'Customer Reviews & Ratings', 'recommended', 'Builds social proof and local search authority.', detectedFeatures, missingFeatures)
  } else if (cat.includes('gym') || cat.includes('fitness') || cat.includes('workout')) {
    checkFeature(allText, ['membership', 'plan', 'join', 'pricing', 'calculator'], 'Membership / Pricing Table', 'critical', 'Clear pricing reduces friction for new gym joiners.', detectedFeatures, missingFeatures)
    checkFeature(allText, ['trainer', 'coach', 'instructor', 'team'], 'Trainer / Coach Profiles', 'recommended', 'Builds trust and personal connection with potential members.', detectedFeatures, missingFeatures)
    checkFeature(allText, ['schedule', 'class', 'timetable', 'services'], 'Class Schedule / Timetable', 'critical', 'Members need to check workout times on mobile.', detectedFeatures, missingFeatures)
    checkFeature(allText, ['trial', 'free pass', 'first class', 'audit'], 'Free Trial / Pass Offer', 'recommended', 'High-converting lead magnet for fitness businesses.', detectedFeatures, missingFeatures)
  } else if (cat.includes('clinic') || cat.includes('medical') || cat.includes('health') || cat.includes('doctor')) {
    checkFeature(allText, ['appointment', 'book', 'schedule', 'contact'], 'Online Appointment Booking', 'critical', 'Patients prefer instant online scheduling over phone calls.', detectedFeatures, missingFeatures)
    checkFeature(allText, ['doctor', 'physician', 'specialist', 'team'], 'Doctor / Specialist Profiles', 'recommended', 'Patients choose clinics based on specialist expertise.', detectedFeatures, missingFeatures)
    checkFeature(allText, ['emergency', 'call', '24/7', 'contact', 'map'], 'Emergency Contact & Location Map', 'critical', 'Patients in urgent need require instant call & direction buttons.', detectedFeatures, missingFeatures)
    checkFeature(allText, ['insurance', 'coverage', 'pay', 'plans'], 'Insurance & Payment Information', 'recommended', 'Reduces administrative inquiry calls.', detectedFeatures, missingFeatures)
  } else if (cat.includes('e-commerce') || cat.includes('shop') || cat.includes('store')) {
    checkFeature(allText, ['cart', 'checkout', 'buy', 'order'], 'Cart & Instant Checkout', 'critical', 'Essential for e-commerce transactions.', detectedFeatures, missingFeatures)
    checkFeature(allText, ['payment', 'stripe', 'razorpay', 'paypal', 'price'], 'Secure Payment Gateway', 'critical', 'Required for accepting credit/debit/UPI payments.', detectedFeatures, missingFeatures)
    checkFeature(allText, ['search', 'filter', 'products', 'services'], 'Product Search & Filtering', 'recommended', 'Helps shoppers find products faster.', detectedFeatures, missingFeatures)
  } else {
    // General Business / SaaS / Agency / Platform
    checkFeature(allText, ['contact', 'inquiry', 'quote', 'audit', 'demo'], 'Contact Form / Lead Qualifier', 'critical', 'Main lead capture mechanism for your business.', detectedFeatures, missingFeatures)
    checkFeature(allText, ['pricing', 'plans', 'cost', 'calculator', 'investment'], 'Pricing / Package Breakdown', 'recommended', 'Transparent pricing increases lead quality.', detectedFeatures, missingFeatures)
    checkFeature(allText, ['testimonial', 'case study', 'client', 'case-studies', 'report', 'sample'], 'Client Case Studies & Social Proof', 'recommended', 'Essential for high-ticket client conversion.', detectedFeatures, missingFeatures)
    checkFeature(allText, ['chat', 'assistant', 'whatsapp', 'ai', 'support', 'bot'], 'AI Customer Assistant / Live Support', 'optional', '24/7 support captures after-hours leads.', detectedFeatures, missingFeatures)
  }

  // Calculate Business Score
  let businessScore = 95
  missingFeatures.forEach((f) => {
    if (f.importance === 'critical') businessScore -= 8
    else if (f.importance === 'recommended') businessScore -= 4
    else businessScore -= 2
  })
  businessScore = Math.max(75, Math.min(100, businessScore))

  const aiInsights = `Based on our automated scan of ${crawl.crawledPages.length} pages for a ${category || 'Business'} website, we identified ${detectedFeatures.length} active business capabilities and ${missingFeatures.length} key missing conversion elements.`

  return {
    businessScore,
    detectedCategory: category || 'General Business',
    detectedFeatures,
    missingFeatures,
    aiInsights,
  }
}

function checkFeature(
  text: string,
  keywords: string[],
  featureName: string,
  importance: 'critical' | 'recommended' | 'optional',
  reason: string,
  detected: string[],
  missing: MissingFeature[]
) {
  const isPresent = keywords.some((kw) => text.includes(kw))
  if (isPresent) {
    detected.push(featureName)
  } else {
    missing.push({
      feature: featureName,
      importance,
      reason,
    })
  }
}
