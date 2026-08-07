'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, MessageSquare, Zap } from 'lucide-react'

// Note: metadata must be in a server component
// export const metadata = { title: 'FAQ | AuditAI by Yample Labs' }

const FAQ_CATEGORIES = [
  {
    category: 'About AuditAI',
    questions: [
      {
        q: 'What is AuditAI and what does it do?',
        a: 'AuditAI is an AI-powered website intelligence platform by Yample Labs. It analyzes your website across 5 dimensions — Performance, SEO, Security, Accessibility, and Core Web Vitals — and generates a detailed report with actionable recommendations. Beyond audits, AuditAI also connects you to our expert team for custom website development, AI integration, and SEO services.'
      },
      {
        q: 'Is the free audit really free? What does it include?',
        a: 'Yes! Our free AI audit scans your website in real-time using Google PageSpeed API and our proprietary AI models. You get: an overall health score, performance metrics (LCP, CLS, INP, FCP), SEO analysis, security headers check, accessibility issues, competitor benchmarking, and AI-generated improvement recommendations — all completely free.'
      },
      {
        q: 'How accurate are the audit scores?',
        a: 'AuditAI scores are based on Google Lighthouse, PageSpeed Insights API, and our own AI analysis models. They are highly accurate for technical on-page metrics. However, scores can vary slightly between scans depending on server load and third-party script performance at scan time. Our Disclaimer page has more detail on score limitations.'
      },
      {
        q: 'Can I audit a website I don\'t own?',
        a: 'You may audit publicly accessible websites that you own or have explicit authorization to test. Auditing competitor websites for comparative benchmarking is permitted. However, using audit data to exploit vulnerabilities in third-party websites is strictly prohibited under our Acceptable Use Policy.'
      },
    ]
  },
  {
    category: 'Pricing & Quotes',
    questions: [
      {
        q: 'How does the auto-quotation system work?',
        a: 'After filling out our Project Requirement Form, our AI analyzes your requirements (business type, website type, features needed, budget, timeline) and generates a detailed itemized quotation instantly. The quote includes service breakdown, estimated timeline, price per service, discounts, and total — all without a sales call.'
      },
      {
        q: 'Why does the quote say "valid for 15 minutes"?',
        a: 'Our AI pricing is demand-aware and can fluctuate based on workload. The 15-minute timer ensures you get the price that was calculated for your specific requirements at that moment. Once you proceed to checkout, your price is locked even if you need to come back later via the "Chat on WhatsApp" option.'
      },
      {
        q: 'Do you charge in INR or USD?',
        a: 'We charge in INR (Indian Rupee) for Indian clients and USD for international clients. Our platform auto-detects your location and shows pricing in your local currency. You can also toggle between currencies using the Currency Switch on our pricing pages.'
      },
      {
        q: 'Are there any hidden fees?',
        a: 'No hidden fees, ever. What you see in the quotation is what you pay — plus applicable GST for Indian clients. The only exception is if your project scope changes significantly from the original requirements, in which case we\'ll issue a revised quote for your approval before proceeding.'
      },
      {
        q: 'Do you offer discounts or coupon codes?',
        a: 'Yes! We periodically offer launch discounts, seasonal offers, and referral bonuses. You can apply coupon codes at the cart/checkout stage. Check the Cart page for any active promotions. International clients may also qualify for regional pricing adjustments.'
      },
    ]
  },
  {
    category: 'Development Services',
    questions: [
      {
        q: 'What technologies do you use for website development?',
        a: 'We primarily build with Next.js 15, React 19, TypeScript, and Tailwind CSS — deployed on Vercel Edge for maximum performance. For e-commerce, we integrate with Razorpay/Stripe. For AI features, we use OpenAI and custom models. For databases, Supabase (PostgreSQL). We choose the best tool for each project.'
      },
      {
        q: 'How long does a typical project take?',
        a: 'Project timelines depend on scope. Typical ranges: Landing page (3–5 days), Business website (7–12 days), E-commerce website (14–21 days), Custom web application (21–45 days). These are estimates — your exact timeline is specified in your quotation based on your requirements.'
      },
      {
        q: 'Do you provide a guarantee on the quality of work?',
        a: 'Yes. We offer a satisfaction guarantee — if the delivered work does not match the agreed specification, we provide one free revision round. After that, if you\'re still not satisfied, we negotiate a fair resolution. See our Refund & Satisfaction Policy for full details.'
      },
      {
        q: 'Can I see examples of your previous work?',
        a: 'Yes! Check our Case Studies page for showcases of previous projects. You can also view a Sample Audit Report to see the quality of our AI-generated audit output. For specific industry examples, feel free to ask us via WhatsApp.'
      },
      {
        q: 'Do you provide hosting and domain services?',
        a: 'We deploy your website on Vercel (included in the project), which provides global CDN, automatic HTTPS, and edge performance. Domain registration and external hosting subscriptions are not included in our packages but we can guide you through the setup.'
      },
    ]
  },
  {
    category: 'Orders & Projects',
    questions: [
      {
        q: 'What happens after I pay?',
        a: 'Immediately after payment: (1) You receive a payment confirmation email, (2) An order is created in your dashboard, (3) Our team reviews your requirements within 4 business hours, (4) You receive a project kickoff email, and (5) Work begins. You can track every milestone in real-time from your Customer Dashboard → Order Tracking.'
      },
      {
        q: 'Can I make changes to my project requirements after paying?',
        a: 'Minor changes that don\'t affect scope or timeline can be accommodated at no extra charge. Significant scope changes (adding features not in the original quote, changing the technology stack, redesigning already-approved work) will require a Change Order with updated pricing. Always communicate changes early!'
      },
      {
        q: 'What if I\'m not happy with the design?',
        a: 'Every project includes 2 rounds of revisions within scope. If you don\'t like the initial design direction, the first revision round covers complete redesign. We recommend providing clear reference websites and design preferences in your Requirement Form to minimize revision cycles.'
      },
      {
        q: 'How do I communicate with the team during a project?',
        a: 'You can: (1) Open a Support Ticket from your Customer Dashboard, (2) Reply to project update emails, (3) Chat via WhatsApp for quick questions. We aim to respond to all messages within 4 business hours (Mon–Sat, 10 AM – 7 PM IST).'
      },
    ]
  },
  {
    category: 'Security & Privacy',
    questions: [
      {
        q: 'Is my business data safe with AuditAI?',
        a: 'Yes. We take data security seriously. All data is stored in Supabase (hosted on AWS) with Row-Level Security (RLS) enabled. All connections are encrypted with TLS/SSL. We do not share your business data with third parties (other than our service providers listed in our Privacy Policy). Payments are handled by Razorpay — we never see your card details.'
      },
      {
        q: 'Do you comply with GDPR and India\'s DPDP Act?',
        a: 'Yes. We comply with both GDPR (for EU users) and India\'s Digital Personal Data Protection Act (DPDP) 2023. This includes: consent-based data collection, data minimization, your rights to access/delete your data, and clear data retention policies. See our GDPR & DPDP Notice and Data Retention Policy for full details.'
      },
      {
        q: 'Can I delete my account and data?',
        a: 'Yes. You can delete your account from Profile Settings → Account → Delete Account. This removes your personal data from active storage. Legal records (invoices, payment references) are retained for 7 years as required by Indian tax law. See our Data Retention Policy for specifics.'
      },
    ]
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-sm font-semibold text-white">{q}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-violet-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-4 bg-white/[0.01]">
          {a}
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  const whatsappUrl = `https://wa.me/916305630468?text=${encodeURIComponent('Hi Yample Labs! I have a question about AuditAI services.')}`

  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="text-white/60 hover:text-white transition-colors text-sm">← Back to Home</Link>
        <span className="text-xs font-mono text-violet-300 uppercase tracking-wider">FAQ</span>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-300 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" /> Frequently Asked Questions
          </div>
          <h1 className="text-4xl font-black text-white">Everything You Need to Know</h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Can't find your answer? Chat with us directly on WhatsApp — we typically respond within 2 hours.
          </p>
        </div>

        {/* FAQ Sections */}
        {FAQ_CATEGORIES.map(({ category, questions }) => (
          <div key={category} className="space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-white/10 pb-3">{category}</h2>
            <div className="space-y-3">
              {questions.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}

        {/* Still have questions */}
        <div className="glass-card p-8 rounded-2xl border border-violet-500/20 bg-violet-950/10 text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Still Have Questions?</h3>
          <p className="text-slate-400 text-sm">Our team is available Monday–Saturday, 10 AM – 7 PM IST.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-sm hover:bg-emerald-500/20 transition-all"
            >
              <MessageSquare className="w-4 h-4" /> Chat on WhatsApp
            </a>
            <a
              href="mailto:yamplelabs@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold text-sm hover:bg-white/10 transition-all"
            >
              Email Us
            </a>
            <Link
              href="/requirements"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 text-white font-bold text-sm hover:opacity-90 transition-all"
            >
              Start a Project
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
