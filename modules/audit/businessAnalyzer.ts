import type { BusinessAnalysisResult, MissingFeature, CrawlResult, SystemValidationResult } from './types'

/**
 * Business Analysis Engine (Step 9 of Audit Workflow)
 * Detects missing industry-specific features based on business category and crawled HTML content.
 */
export async function analyzeBusiness(
  category: string | undefined,
  crawl: CrawlResult,
  system: SystemValidationResult,
  geminiKey?: string
): Promise<BusinessAnalysisResult> {
  const cat = (category || 'General Business').toLowerCase()
  const allHtmlText = crawl.crawledPages.map((p) => `${p.title} ${p.h1} ${p.metaDescription}`).join(' ').toLowerCase()

  const detectedFeatures: string[] = []
  const missingFeatures: MissingFeature[] = []

  if (cat.includes('restaurant') || cat.includes('food') || cat.includes('cafe')) {
    checkFeature(allHtmlText, ['menu', 'food', 'dishes'], 'Online Menu', 'critical', 'Customers want to see menu items before visiting or ordering.', detectedFeatures, missingFeatures)
    checkFeature(allHtmlText, ['order', 'delivery', 'takeout'], 'Online Ordering / Delivery Integration', 'recommended', 'Increases direct revenue without third-party app commission.', detectedFeatures, missingFeatures)
    checkFeature(allHtmlText, ['reserve', 'reservation', 'table', 'book'], 'Table Reservation System', 'recommended', 'Reduces wait times and secures advance bookings.', detectedFeatures, missingFeatures)
    checkFeature(allHtmlText, ['review', 'testimonial', 'rating', 'star'], 'Customer Reviews & Ratings', 'recommended', 'Builds social proof and local search authority.', detectedFeatures, missingFeatures)
  } else if (cat.includes('gym') || cat.includes('fitness') || cat.includes('workout')) {
    checkFeature(allHtmlText, ['membership', 'plan', 'join', 'pricing'], 'Membership / Pricing Table', 'critical', 'Clear pricing reduces friction for new gym joiners.', detectedFeatures, missingFeatures)
    checkFeature(allHtmlText, ['trainer', 'coach', 'instructor'], 'Trainer / Coach Profiles', 'recommended', 'Builds trust and personal connection with potential members.', detectedFeatures, missingFeatures)
    checkFeature(allHtmlText, ['schedule', 'class', 'timetable'], 'Class Schedule / Timetable', 'critical', 'Members need to check workout times on mobile.', detectedFeatures, missingFeatures)
    checkFeature(allHtmlText, ['trial', 'free pass', 'first class'], 'Free Trial / Pass Offer', 'recommended', 'High-converting lead magnet for fitness businesses.', detectedFeatures, missingFeatures)
  } else if (cat.includes('clinic') || cat.includes('medical') || cat.includes('health') || cat.includes('doctor')) {
    checkFeature(allHtmlText, ['appointment', 'book', 'schedule'], 'Online Appointment Booking', 'critical', 'Patients prefer instant online scheduling over phone calls.', detectedFeatures, missingFeatures)
    checkFeature(allHtmlText, ['doctor', 'physician', 'specialist'], 'Doctor / Specialist Profiles', 'recommended', 'Patients choose clinics based on specialist expertise.', detectedFeatures, missingFeatures)
    checkFeature(allHtmlText, ['emergency', 'call', '24/7', 'contact'], 'Emergency Contact & Location Map', 'critical', 'Patients in urgent need require instant call & direction buttons.', detectedFeatures, missingFeatures)
    checkFeature(allHtmlText, ['insurance', 'coverage', 'pay'], 'Insurance & Payment Information', 'recommended', 'Reduces administrative inquiry calls.', detectedFeatures, missingFeatures)
  } else if (cat.includes('e-commerce') || cat.includes('shop') || cat.includes('store')) {
    checkFeature(allHtmlText, ['cart', 'checkout', 'buy'], 'Cart & Instant Checkout', 'critical', 'Essential for e-commerce transactions.', detectedFeatures, missingFeatures)
    checkFeature(allHtmlText, ['payment', 'stripe', 'razorpay', 'paypal'], 'Secure Payment Gateway', 'critical', 'Required for accepting credit/debit/UPI payments.', detectedFeatures, missingFeatures)
    checkFeature(allHtmlText, ['search', 'filter'], 'Product Search & Filtering', 'recommended', 'Helps shoppers find products faster.', detectedFeatures, missingFeatures)
  } else {
    // General Business / SaaS / Agency
    checkFeature(allHtmlText, ['contact', 'inquiry', 'quote'], 'Contact Form / Lead Qualifier', 'critical', 'Main lead capture mechanism for your business.', detectedFeatures, missingFeatures)
    checkFeature(allHtmlText, ['pricing', 'plans', 'cost'], 'Pricing / Package Breakdown', 'recommended', 'Transparent pricing increases lead quality.', detectedFeatures, missingFeatures)
    checkFeature(allHtmlText, ['testimonial', 'case study', 'client'], 'Client Case Studies & Social Proof', 'recommended', 'Essential for high-ticket client conversion.', detectedFeatures, missingFeatures)
    checkFeature(allHtmlText, ['chat', 'assistant', 'whatsapp'], 'AI Customer Assistant / Live Support', 'optional', '24/7 support captures after-hours leads.', detectedFeatures, missingFeatures)
  }

  // Calculate Business Score
  let businessScore = 80
  missingFeatures.forEach((f) => {
    if (f.importance === 'critical') businessScore -= 18
    else if (f.importance === 'recommended') businessScore -= 10
    else businessScore -= 5
  })
  businessScore = Math.max(30, Math.min(100, businessScore))

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
