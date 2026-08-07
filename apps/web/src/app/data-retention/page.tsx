import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Data Retention Policy | AuditAI by Yample Labs',
  description: 'How long Yample Labs retains your personal data, audit records, payment information, and project files.',
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

export default function DataRetentionPage() {
  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="text-white/60 hover:text-white transition-colors text-sm">← Back to Home</Link>
        <span className="text-xs font-mono text-violet-300 uppercase tracking-wider">Data Retention</span>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10 text-slate-300 text-sm leading-relaxed">
        <div className="space-y-3 pb-8 border-b border-white/10">
          <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">Yample Labs Compliance</span>
          <h1 className="text-3xl md:text-4xl font-black text-white">Data Retention Policy</h1>
          <p className="text-xs text-slate-500 font-mono">Last Updated: August 7, 2026</p>
        </div>

        <p className="bg-violet-950/20 border border-violet-500/20 rounded-xl p-5">
          This policy explains how long Yample Labs retains different categories of personal and business data, why we retain it, and how you can request deletion. This policy supplements our <Link href="/privacy" className="text-violet-400 hover:underline">Privacy Policy</Link> and is aligned with the Indian DPDP Act 2023 and GDPR requirements.
        </p>

        <Section num={1} title="Retention Schedule">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase font-bold">
                <th className="py-2 pr-4 text-left">Data Category</th>
                <th className="py-2 pr-4 text-left">Retention Period</th>
                <th className="py-2 text-left">Legal Basis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ['Account profile data (name, email, phone)', 'Account active + 2 years after deletion', 'Contract / Legitimate Interest'],
                ['Website audit reports', '12 months from audit date', 'Contract'],
                ['AI analysis & recommendations', '12 months from generation', 'Contract'],
                ['Project requirement forms', '24 months from project completion', 'Contract'],
                ['Quotes & proposals', '24 months from generation', 'Contract'],
                ['Payment transaction references', '7 years', 'Indian GST / Tax Law'],
                ['Invoices & billing records', '7 years', 'Indian Companies Act'],
                ['Support ticket records', '3 years from resolution', 'Legitimate Interest / Legal'],
                ['Email communication logs', '24 months', 'Legitimate Interest'],
                ['Voice recordings (requirement forms)', '90 days (or until project close)', 'Consent'],
                ['Server/access logs (IP, browser)', '90 days', 'Legitimate Interest / Security'],
                ['Deleted account residual data', 'Up to 30 days in backup systems', 'Technical Necessity'],
              ].map(([cat, period, basis]) => (
                <tr key={cat}>
                  <td className="py-2.5 pr-4 text-white">{cat}</td>
                  <td className="py-2.5 pr-4 text-amber-300 font-mono font-medium">{period}</td>
                  <td className="py-2.5 text-slate-400 text-[11px]">{basis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section num={2} title="Why We Retain Data">
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li><strong className="text-white">Legal Obligations:</strong> Indian tax law (GST Act, Income Tax Act) requires 7 years of financial record retention.</li>
            <li><strong className="text-white">Contract Performance:</strong> We retain project data during active projects and for a period after completion to handle revisions, disputes, or follow-up work.</li>
            <li><strong className="text-white">Security & Fraud Prevention:</strong> Short-term logs help us detect and investigate unauthorized access and abuse.</li>
            <li><strong className="text-white">Dispute Resolution:</strong> Support records are retained to resolve any future billing or delivery disputes.</li>
          </ul>
        </Section>

        <Section num={3} title="Deletion Process">
          <p>When data retention periods expire, we delete or anonymize data using the following process:</p>
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li>Active Supabase database records are hard-deleted.</li>
            <li>Backup archives are purged within 30 days of retention expiry.</li>
            <li>CDN-cached data (Vercel) is invalidated within 24 hours of deletion.</li>
            <li>Email delivery logs held by Resend are subject to their own retention policy (typically 90 days).</li>
          </ul>
        </Section>

        <Section num={4} title="Requesting Early Deletion">
          <p>You may request early deletion of your personal data subject to legal retention obligations by emailing <strong className="text-violet-400">yamplelabs@gmail.com</strong> with subject "DATA DELETION REQUEST." We will confirm deletion within 30 days.</p>
          <p>Please note: Data subject to legal obligations (tax records, invoices) cannot be deleted before the legally mandated retention period expires.</p>
        </Section>

        <Section num={5} title="Data Breach Notification">
          <p>In the event of a data breach affecting your personal information:</p>
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li>We will notify affected users within <strong className="text-white">72 hours</strong> of becoming aware of the breach.</li>
            <li>Notification will be via email to your registered address.</li>
            <li>We will report to relevant authorities as required by GDPR and DPDP Act.</li>
          </ul>
        </Section>
      </div>
    </div>
  )
}
