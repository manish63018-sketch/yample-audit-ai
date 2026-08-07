import React from 'react'
import Link from 'next/link'
import { Zap, Github, Twitter, MessageSquare, ShieldCheck, FileText } from 'lucide-react'

const FOOTER_LINKS = {
  Services: [
    { label: 'Website Audit & Intelligence', href: '/#hero-url-input' },
    { label: 'Custom Website Development', href: '/calculator' },
    { label: '24/7 AI Voice & Support Bots', href: '/calculator' },
    { label: 'On-Page SEO & Schema Markup', href: '/calculator' },
    { label: 'Core Web Vitals Overhaul', href: '/calculator' },
  ],
  Company: [
    { label: 'About Yample Labs', href: '/about' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Sample Audit Report', href: '/sample-report' },
    { label: 'Careers (Coming Soon)', href: '#', disabled: true },
  ],
  Platform: [
    { label: 'Customer Dashboard', href: '/dashboard' },
    { label: 'Requirement Form', href: '/requirements' },
    { label: 'Price Calculator', href: '/calculator' },
    { label: 'Shopping Cart', href: '/cart' },
    { label: 'Order Tracking', href: '/dashboard' },
  ],
  'Legal Suite': [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Refund & Satisfaction Policy', href: '/refund-policy' },
    { label: 'Cancellation Policy', href: '/cancellation' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Acceptable Use Policy', href: '/acceptable-use' },
    { label: 'Audit Disclaimer', href: '/disclaimer' },
    { label: 'Master Service Agreement', href: '/service-agreement' },
    { label: 'SLA & Support Policy', href: '/support-policy' },
    { label: 'GDPR / DPDP Notice', href: '/gdpr' },
    { label: 'Data Retention Policy', href: '/data-retention' },
  ],
} as const


export function Footer() {
  const currentYear = new Date().getFullYear()

  // Generate WhatsApp chat link with prefilled payload
  const whatsappUrl = `https://wa.me/916305630468?text=${encodeURIComponent('Hi Yample Labs! I would like to inquire about AuditAI services.')}`

  return (
    <footer
      role="contentinfo"
      className="border-t border-white/10 bg-[#08080f] text-slate-300 print:hidden"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Audit<span className="text-violet-400">AI</span>
                <span className="text-xs font-normal text-slate-500 ml-2">by Yample Labs</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              AI-Powered Website Audit, Core Web Vitals Acceleration, Business Intelligence, and Development Platform by Yample Labs. Transforming technical debt into high-converting revenue machines.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/20 transition-all"
              >
                <MessageSquare className="w-4 h-4" /> Chat on WhatsApp
              </a>
              <a
                href="mailto:yamplelabs@gmail.com"
                className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-medium hover:bg-white/10 transition-all"
              >
                📧 Email Us
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {category}
              </h3>
              <ul className="space-y-2 text-xs">
                {links.map((link) => (
                  <li key={link.href}>
                    {'disabled' in link && link.disabled ? (
                      <span className="text-slate-600 cursor-not-allowed">
                        {link.label}
                      </span>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-slate-400 hover:text-white transition-colors duration-150"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Line */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {currentYear} Yample Labs. All rights reserved. AuditAI™ is a registered business platform of Yample Labs.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> SSL Encrypted</span>
            <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-violet-400" /> GDPR &amp; DPDP Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
