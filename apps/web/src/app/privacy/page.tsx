import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | AuditAI by Yample Labs',
  description:
    'Privacy Policy of Yample Labs — how we collect, use, store, and protect your personal data when you use AuditAI platform.',
}

function LegalLayout({ children, badge, title }: { children: React.ReactNode; badge: string; title: string }) {
  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-2">
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

export default function PrivacyPage() {
  return (
    <LegalLayout badge="Privacy Policy" title="Privacy Policy">
      <p className="text-slate-300 leading-relaxed bg-violet-950/20 border border-violet-500/20 rounded-xl p-5 text-sm">
        Yample Labs ("<strong className="text-white">we</strong>," "<strong className="text-white">us</strong>," or "<strong className="text-white">our</strong>") operates the AuditAI platform at <strong className="text-violet-400">auditai.yamplelabs.com</strong>. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us in any capacity.
      </p>

      <Section num={1} title="Information We Collect">
        <p>We collect the following categories of personal information:</p>
        <ul className="list-disc list-outside ml-4 space-y-2 text-slate-300">
          <li><strong className="text-white">Account Information:</strong> Full name, email address, mobile number, country, company name, and website URL provided during registration.</li>
          <li><strong className="text-white">Project & Business Data:</strong> Website URLs you submit for audit, business type, industry, project requirements, uploaded files, voice recordings, and reference links you provide in the Requirement Form.</li>
          <li><strong className="text-white">Payment Information:</strong> We do not store card details. Payment processing is handled by Razorpay (PCI-DSS compliant). We store only transaction IDs, order references, and payment status.</li>
          <li><strong className="text-white">Usage & Technical Data:</strong> IP address, browser type, device information, pages visited, session duration, and audit history — collected automatically via cookies and server logs.</li>
          <li><strong className="text-white">Communications:</strong> Messages, support ticket content, WhatsApp conversations initiated through our platform, and any feedback you provide.</li>
          <li><strong className="text-white">Geolocation Data:</strong> Country and currency detection for pricing purposes, derived from your IP address.</li>
        </ul>
      </Section>

      <Section num={2} title="How We Use Your Information">
        <p>We use your personal information for the following business purposes:</p>
        <ul className="list-disc list-outside ml-4 space-y-2">
          <li>Creating and managing your AuditAI account and customer dashboard.</li>
          <li>Conducting AI-powered website audits and generating performance reports.</li>
          <li>Generating custom project quotations based on your requirements.</li>
          <li>Processing payments and managing order fulfillment for development projects.</li>
          <li>Communicating project milestones, updates, and delivery notifications via email and WhatsApp.</li>
          <li>Generating and delivering invoices for services rendered.</li>
          <li>Providing technical support and resolving customer queries.</li>
          <li>Improving our AI models, platform features, and service quality.</li>
          <li>Complying with legal obligations under Indian law and applicable international regulations.</li>
          <li>Preventing fraud, unauthorized access, and abuse of our platform.</li>
        </ul>
      </Section>

      <Section num={3} title="Legal Basis for Processing">
        <p>We process your personal data under the following legal bases:</p>
        <ul className="list-disc list-outside ml-4 space-y-2">
          <li><strong className="text-white">Contract Performance:</strong> Processing necessary to provide the services you have ordered or signed up for.</li>
          <li><strong className="text-white">Consent:</strong> Where you have explicitly consented — such as for marketing communications or optional data collection at signup.</li>
          <li><strong className="text-white">Legitimate Interests:</strong> For platform security, fraud prevention, service improvement, and business analytics.</li>
          <li><strong className="text-white">Legal Obligation:</strong> Where required by applicable Indian law including the DPDP Act 2023, or for tax and accounting purposes.</li>
        </ul>
      </Section>

      <Section num={4} title="Data Sharing & Disclosure">
        <p>We do not sell your personal data. We may share your information with:</p>
        <ul className="list-disc list-outside ml-4 space-y-2">
          <li><strong className="text-white">Service Providers:</strong> Supabase (database), Vercel (hosting), Razorpay (payments), Resend (email delivery), Google PageSpeed API (audit engine). These processors are contractually bound to protect your data.</li>
          <li><strong className="text-white">Legal Authorities:</strong> When required by law, court order, or government demand in accordance with Indian law.</li>
          <li><strong className="text-white">Business Transfers:</strong> In the event of a merger, acquisition, or sale of Yample Labs assets, your data may be transferred — you will be notified in advance.</li>
        </ul>
        <p>We never share your data with advertisers or third-party marketing platforms without your explicit consent.</p>
      </Section>

      <Section num={5} title="Data Retention">
        <p>We retain your personal data only as long as necessary for the purposes outlined in this policy:</p>
        <ul className="list-disc list-outside ml-4 space-y-2">
          <li>Account data: Retained for the duration of your account and 2 years after deletion.</li>
          <li>Payment records & invoices: Retained for 7 years as required by Indian GST and tax laws.</li>
          <li>Audit data: Retained for 12 months from the audit date.</li>
          <li>Support ticket records: Retained for 3 years for dispute resolution purposes.</li>
        </ul>
      </Section>

      <Section num={6} title="Your Rights">
        <p>Under GDPR and India's Digital Personal Data Protection Act (DPDP) 2023, you have the following rights:</p>
        <ul className="list-disc list-outside ml-4 space-y-2">
          <li><strong className="text-white">Right to Access:</strong> Request a copy of the personal data we hold about you.</li>
          <li><strong className="text-white">Right to Rectification:</strong> Correct inaccurate or incomplete personal data.</li>
          <li><strong className="text-white">Right to Erasure:</strong> Request deletion of your personal data, subject to legal retention obligations.</li>
          <li><strong className="text-white">Right to Data Portability:</strong> Receive your data in a structured, machine-readable format.</li>
          <li><strong className="text-white">Right to Object:</strong> Object to processing based on legitimate interests.</li>
          <li><strong className="text-white">Right to Withdraw Consent:</strong> Withdraw previously given consent at any time without affecting prior processing.</li>
        </ul>
        <p>To exercise any of these rights, email us at <strong className="text-violet-400">yamplelabs@gmail.com</strong>. We will respond within 30 days.</p>
      </Section>

      <Section num={7} title="Cookies">
        <p>We use essential, functional, and analytical cookies. See our <Link href="/cookies" className="text-violet-400 hover:underline">Cookie Policy</Link> for details. You can manage your cookie preferences at any time.</p>
      </Section>

      <Section num={8} title="Children's Privacy">
        <p>AuditAI is a professional business platform. We do not knowingly collect data from individuals under 18 years of age. If you believe a minor has provided data, please contact us immediately for removal.</p>
      </Section>

      <Section num={9} title="Security">
        <p>We implement industry-standard security measures including SSL/TLS encryption, Supabase Row-Level Security (RLS), hashed password storage, CSRF protection, rate limiting, and regular security audits. However, no transmission over the internet is 100% secure — by using our platform, you accept this inherent risk.</p>
      </Section>

      <Section num={10} title="Changes to This Policy">
        <p>We may update this Privacy Policy periodically. We will notify you via email or in-app notification when material changes are made. Continued use of the platform after changes constitutes acceptance of the revised policy.</p>
      </Section>

      <Section num={11} title="Contact Information">
        <p>For privacy concerns, data requests, or complaints:</p>
        <ul className="list-none space-y-1 ml-0">
          <li>📧 <strong className="text-white">Email:</strong> yamplelabs@gmail.com</li>
          <li>🏢 <strong className="text-white">Business:</strong> Yample Labs, India</li>
          <li>🌐 <strong className="text-white">Platform:</strong> auditai.yamplelabs.com</li>
        </ul>
      </Section>
    </LegalLayout>
  )
}
