import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GDPR & DPDP Privacy Notice | AuditAI by Yample Labs',
  description: 'GDPR and India DPDP Act 2023 compliance notice for European and Indian users of AuditAI by Yample Labs.',
}

function Section({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold text-white flex items-center gap-3">
        <span className="w-7 h-7 rounded-lg bg-violet-600/30 border border-violet-500/30 text-violet-300 text-xs font-mono flex items-center justify-center flex-shrink-0">{num}</span>
        {title}
      </h2>
      <div className="pl-10 space-y-3">{children}</div>
    </section>
  )
}

export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="text-white/60 hover:text-white transition-colors text-sm">← Back to Home</Link>
        <span className="text-xs font-mono text-violet-300 uppercase tracking-wider">GDPR & DPDP Notice</span>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10 text-slate-300 text-sm leading-relaxed">
        <div className="space-y-3 pb-8 border-b border-white/10">
          <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">Yample Labs Compliance</span>
          <h1 className="text-3xl md:text-4xl font-black text-white">GDPR & DPDP Privacy Notice</h1>
          <p className="text-xs text-slate-500 font-mono">Last Updated: August 7, 2026 · Applies to: EU/EEA Residents & Indian Citizens</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-blue-950/20 border border-blue-500/20 rounded-xl p-4">
            <div className="text-blue-300 font-bold text-xs uppercase tracking-wider mb-2">🇪🇺 GDPR (EU Regulation 2016/679)</div>
            <p className="text-slate-400 text-xs">Applies to users in the European Union and European Economic Area. We process EU user data in compliance with GDPR requirements including lawful basis, data minimization, and data subject rights.</p>
          </div>
          <div className="bg-orange-950/20 border border-orange-500/20 rounded-xl p-4">
            <div className="text-orange-300 font-bold text-xs uppercase tracking-wider mb-2">🇮🇳 DPDP Act 2023 (India)</div>
            <p className="text-slate-400 text-xs">Applies to Indian citizens. We comply with the Digital Personal Data Protection Act 2023, including consent-based processing, purpose limitation, and Data Fiduciary obligations.</p>
          </div>
        </div>

        <Section num={1} title="Data Controller / Fiduciary">
          <p>Yample Labs is the <strong className="text-white">Data Controller</strong> (under GDPR) and <strong className="text-white">Data Fiduciary</strong> (under DPDP Act 2023) for all personal data processed through the AuditAI platform.</p>
          <ul className="list-none space-y-1">
            <li>📧 Contact: <strong className="text-violet-400">yamplelabs@gmail.com</strong></li>
            <li>🏢 Entity: Yample Labs, India</li>
          </ul>
          <p>We do not currently have an EU Representative as our primary operations and user base are based in India. For EU-specific inquiries, contact us directly.</p>
        </Section>

        <Section num={2} title="Personal Data We Process">
          <p>We process the following categories of personal data:</p>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase font-bold">
                <th className="py-2 pr-4 text-left">Data Category</th>
                <th className="py-2 pr-4 text-left">Purpose</th>
                <th className="py-2 text-left">Legal Basis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ['Identity (name, email, phone)', 'Account creation, project delivery, communication', 'Contract / Consent'],
                ['Business Data (website URL, industry)', 'AI audit analysis, quote generation', 'Contract'],
                ['Payment Reference (transaction ID)', 'Order management, invoice generation', 'Legal Obligation'],
                ['Technical/Usage Data (IP, browser)', 'Security, platform improvement', 'Legitimate Interests'],
                ['Voice Recordings (optional)', 'Requirement form AI analysis', 'Consent'],
                ['Geolocation (country from IP)', 'Currency pricing, regional compliance', 'Legitimate Interests'],
              ].map(([cat, purpose, basis]) => (
                <tr key={cat}>
                  <td className="py-2.5 pr-4 text-white font-medium">{cat}</td>
                  <td className="py-2.5 pr-4 text-slate-400">{purpose}</td>
                  <td className="py-2.5 text-violet-300">{basis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section num={3} title="Your Rights Under GDPR & DPDP">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { right: 'Right of Access', desc: 'Request a copy of all personal data we hold about you.' },
              { right: 'Right to Rectification', desc: 'Correct inaccurate or incomplete personal data.' },
              { right: 'Right to Erasure', desc: 'Request deletion of your data (subject to legal retention).' },
              { right: 'Right to Portability', desc: 'Receive your data in a machine-readable format (JSON/CSV).' },
              { right: 'Right to Object', desc: 'Object to processing based on legitimate interests.' },
              { right: 'Right to Restrict', desc: 'Request limitation of processing in certain circumstances.' },
              { right: 'Withdraw Consent', desc: 'Withdraw consent at any time without affecting past processing.' },
              { right: 'Lodge Complaint', desc: 'Complain to your national data protection authority (EU) or MeitY (India).' },
            ].map(({ right, desc }) => (
              <div key={right} className="bg-white/[0.02] border border-white/10 rounded-lg p-3">
                <div className="text-violet-300 font-bold text-xs mb-1">{right}</div>
                <div className="text-slate-400 text-xs">{desc}</div>
              </div>
            ))}
          </div>
          <p className="mt-4">To exercise any right, email <strong className="text-violet-400">yamplelabs@gmail.com</strong> with the subject line "DATA RIGHTS REQUEST — [Your Right]". We respond within 30 calendar days.</p>
        </Section>

        <Section num={4} title="International Data Transfers">
          <p>Your data may be processed by our service providers in locations outside India and the EU, including:</p>
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li><strong className="text-white">Supabase</strong> — Database hosting (AWS infrastructure, EU data residency options available)</li>
            <li><strong className="text-white">Vercel</strong> — CDN and edge functions (global infrastructure)</li>
            <li><strong className="text-white">Resend</strong> — Email delivery (US-based)</li>
          </ul>
          <p>For EU users, transfers are governed by Standard Contractual Clauses (SCCs). For Indian users, transfers comply with DPDP cross-border transfer provisions.</p>
        </Section>

        <Section num={5} title="Data Retention (Summary)">
          <p>See our full <Link href="/data-retention" className="text-violet-400 hover:underline">Data Retention Policy</Link> for complete details. Summary:</p>
          <ul className="list-disc list-outside ml-4 space-y-1">
            <li>Account data: Active account duration + 2 years post-deletion</li>
            <li>Financial records: 7 years (Indian tax law)</li>
            <li>Audit reports: 12 months</li>
            <li>Voice recordings: 90 days unless retained for project purposes</li>
          </ul>
        </Section>

        <Section num={6} title="Supervisory Authority (EU Users)">
          <p>EU residents have the right to lodge a complaint with their national Data Protection Authority (DPA). A list of EU DPAs is available at <a href="https://edpb.europa.eu/about-edpb/about-edpb/members_en" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">edpb.europa.eu</a>.</p>
          <p>Indian users may contact the Data Protection Board of India (once established under DPDP Act) or the Ministry of Electronics & Information Technology (MeitY).</p>
        </Section>
      </div>
    </div>
  )
}
