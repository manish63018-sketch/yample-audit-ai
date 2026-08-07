import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions | AuditAI by Yample Labs',
  description:
    'Terms and Conditions governing the use of AuditAI platform and services provided by Yample Labs.',
}

function LegalLayout({ children, badge, title }: { children: React.ReactNode; badge: string; title: string }) {
  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="text-white/60 hover:text-white transition-colors text-sm">
          ← Back to Home
        </Link>
        <span className="text-xs font-mono text-violet-300 uppercase tracking-wider">{badge}</span>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10 text-slate-300 text-sm leading-relaxed">
        <div className="space-y-3 pb-8 border-b border-white/10">
          <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">Yample Labs Legal</span>
          <h1 className="text-3xl md:text-4xl font-black text-white">{title}</h1>
          <p className="text-xs text-slate-500 font-mono">Last Updated: August 7, 2026 · Effective: August 7, 2026</p>
        </div>
        {children}
      </div>
    </div>
  )
}

function Section({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold text-white flex items-center gap-3">
        <span className="w-7 h-7 rounded-lg bg-violet-600/30 border border-violet-500/30 text-violet-300 text-xs font-mono flex items-center justify-center flex-shrink-0">
          {num}
        </span>
        {title}
      </h2>
      <div className="pl-10 space-y-3">{children}</div>
    </section>
  )
}

export default function TermsPage() {
  return (
    <LegalLayout badge="Terms & Conditions" title="Terms & Conditions">
      <p className="text-slate-300 leading-relaxed bg-violet-950/20 border border-violet-500/20 rounded-xl p-5 text-sm">
        These Terms and Conditions ("<strong className="text-white">Terms</strong>") constitute a legally binding agreement between you ("<strong className="text-white">Client</strong>," "<strong className="text-white">User</strong>") and <strong className="text-white">Yample Labs</strong> ("<strong className="text-white">Company</strong>," "<strong className="text-white">we</strong>") governing your access to and use of the AuditAI platform and all associated services. By creating an account, placing an order, or using any feature of this platform, you agree to be bound by these Terms. If you do not agree, do not use our services.
      </p>

      <Section num={1} title="Services Offered">
        <p>Yample Labs provides the following digital and technology services through AuditAI:</p>
        <ul className="list-disc list-outside ml-4 space-y-2">
          <li><strong className="text-white">Website Audit & Intelligence:</strong> AI-powered technical website analysis including performance, SEO, security, accessibility, and Core Web Vitals scoring.</li>
          <li><strong className="text-white">Custom Website Development:</strong> End-to-end web design and development using modern technologies (Next.js, React, Framer, and others).</li>
          <li><strong className="text-white">On-Page SEO & Schema Markup:</strong> Technical SEO optimization, structured data implementation, and search engine compliance.</li>
          <li><strong className="text-white">AI Voice & Support Systems:</strong> Custom AI chatbots, voice assistants, and support automation built for your business.</li>
          <li><strong className="text-white">Core Web Vitals Optimization:</strong> Performance engineering to achieve LCP, CLS, INP, and TTFB targets.</li>
          <li><strong className="text-white">Project Management & Delivery:</strong> Full project lifecycle management from requirements to deployment.</li>
        </ul>
      </Section>

      <Section num={2} title="Account Registration">
        <p>To access paid services, you must create an account with accurate, current, and complete information. You are responsible for:</p>
        <ul className="list-disc list-outside ml-4 space-y-2">
          <li>Maintaining the confidentiality of your account credentials.</li>
          <li>All activities that occur under your account.</li>
          <li>Notifying us immediately of any unauthorized access at yamplelabs@gmail.com.</li>
          <li>Ensuring your account information remains accurate and up to date.</li>
        </ul>
        <p>We reserve the right to suspend or terminate accounts that provide false information or violate these Terms.</p>
      </Section>

      <Section num={3} title="Quotations & Pricing">
        <ul className="list-disc list-outside ml-4 space-y-2">
          <li><strong className="text-white">Quote Validity:</strong> All auto-generated quotations are valid for the duration shown at time of generation (typically 15 minutes for locked pricing). After expiry, prices may change based on load and demand.</li>
          <li><strong className="text-white">Price Accuracy:</strong> Quoted prices are estimates based on information provided. If project scope changes materially, a revised quote will be issued.</li>
          <li><strong className="text-white">Currency:</strong> Services may be priced in USD (international) or INR (India). Currency conversion rates are applied at time of payment.</li>
          <li><strong className="text-white">Taxes:</strong> GST and other applicable taxes will be added to invoices for Indian clients as required by law.</li>
          <li><strong className="text-white">Discounts & Coupons:</strong> Discount codes are subject to validity periods, minimum order amounts, and per-user limits as specified at the time of issuance.</li>
        </ul>
      </Section>

      <Section num={4} title="Payment Terms">
        <ul className="list-disc list-outside ml-4 space-y-2">
          <li><strong className="text-white">Payment Methods:</strong> We accept online payments via Razorpay (UPI, credit/debit cards, net banking, wallets) and offline arrangement via WhatsApp for select projects.</li>
          <li><strong className="text-white">Payment Schedule:</strong> For development projects, 100% advance payment is required before work commences, unless a custom milestone-based payment plan has been agreed in writing.</li>
          <li><strong className="text-white">Failed Payments:</strong> If a payment fails or is reversed, we reserve the right to pause or cancel project work until payment is resolved.</li>
          <li><strong className="text-white">Chargeback Policy:</strong> Initiating a chargeback without first contacting us is a violation of these Terms and may result in account suspension and legal action.</li>
        </ul>
      </Section>

      <Section num={5} title="Project Delivery & Timelines">
        <ul className="list-disc list-outside ml-4 space-y-2">
          <li>Delivery timelines quoted are estimates based on typical project scope and our current workload.</li>
          <li>Delays caused by client non-response (feedback, approvals, content delivery) will not be counted against our delivery obligation.</li>
          <li>We do not guarantee specific live-by dates for external factors outside our control (domain issues, hosting problems, third-party API outages).</li>
          <li>You will receive real-time milestone updates via email and the Order Tracking dashboard.</li>
        </ul>
      </Section>

      <Section num={6} title="Client Responsibilities">
        <p>As a client, you agree to:</p>
        <ul className="list-disc list-outside ml-4 space-y-2">
          <li>Provide accurate project requirements through the Requirement Form.</li>
          <li>Respond to feedback requests, design approvals, and revision requests within 5 business days.</li>
          <li>Provide all necessary content (text, images, brand assets) as specified by our team.</li>
          <li>Ensure you own or have rights to all content, assets, and materials provided to us.</li>
          <li>Not use any deliverable for unlawful, harmful, or deceptive purposes.</li>
        </ul>
      </Section>

      <Section num={7} title="Intellectual Property">
        <ul className="list-disc list-outside ml-4 space-y-2">
          <li><strong className="text-white">Your Content:</strong> You retain all rights to content you provide to us (logo, text, images, brand materials).</li>
          <li><strong className="text-white">Deliverables:</strong> Upon full payment, intellectual property rights for custom deliverables (code, designs, content) are transferred to you, excluding any third-party components (open-source libraries, licensed fonts/assets).</li>
          <li><strong className="text-white">Our Platform:</strong> The AuditAI platform, its AI models, scoring algorithms, report formats, and brand identity remain the exclusive property of Yample Labs.</li>
          <li><strong className="text-white">Portfolio Rights:</strong> We reserve the right to showcase completed work in our portfolio unless you explicitly request confidentiality in writing.</li>
        </ul>
      </Section>

      <Section num={8} title="Limitation of Liability">
        <p>To the maximum extent permitted by applicable law:</p>
        <ul className="list-disc list-outside ml-4 space-y-2">
          <li>Yample Labs shall not be liable for indirect, incidental, consequential, or punitive damages arising from your use of our platform or services.</li>
          <li>Our total liability for any claim shall not exceed the amount paid by you for the specific service giving rise to the claim in the 3 months prior to the claim.</li>
          <li>We make no warranty that audit reports will guarantee specific business outcomes, revenue increases, or ranking improvements.</li>
          <li>Website audit data is provided as-is based on publicly available technical signals at the time of scan.</li>
        </ul>
      </Section>

      <Section num={9} title="Prohibited Uses">
        <p>You may not use our platform to:</p>
        <ul className="list-disc list-outside ml-4 space-y-2">
          <li>Audit websites you do not own or have no authorization to test.</li>
          <li>Engage in automated scraping, reverse engineering, or unauthorized API access.</li>
          <li>Circumvent security measures, rate limits, or authentication systems.</li>
          <li>Submit false business information, fraudulent requirements, or impersonate others.</li>
          <li>Use our AI-generated reports for misleading marketing claims.</li>
          <li>Resell or white-label our platform services without written authorization.</li>
        </ul>
      </Section>

      <Section num={10} title="Termination">
        <p>We reserve the right to suspend or terminate your access to AuditAI at any time, with or without notice, if you violate these Terms, engage in fraudulent activity, or cause harm to our platform or other users. Upon termination, your right to use the platform ceases immediately. Data retention after termination is governed by our <Link href="/data-retention" className="text-violet-400 hover:underline">Data Retention Policy</Link>.</p>
      </Section>

      <Section num={11} title="Governing Law & Dispute Resolution">
        <p>These Terms shall be governed by the laws of India. Any dispute arising from these Terms shall first be attempted to be resolved through good-faith negotiation. If unresolved within 30 days, disputes shall be subject to the exclusive jurisdiction of courts in Hyderabad, Telangana, India.</p>
      </Section>

      <Section num={12} title="Changes to Terms">
        <p>We may update these Terms from time to time. Material changes will be communicated via email and in-app notification with at least 15 days advance notice. Continued use after the effective date constitutes acceptance.</p>
      </Section>

      <Section num={13} title="Contact">
        <p>For questions about these Terms: <strong className="text-violet-400">yamplelabs@gmail.com</strong> | Yample Labs, India</p>
      </Section>
    </LegalLayout>
  )
}
