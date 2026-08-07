import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cancellation Policy | AuditAI by Yample Labs',
  description: 'Project and subscription cancellation policy for Yample Labs AuditAI services.',
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

export default function CancellationPage() {
  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="text-white/60 hover:text-white transition-colors text-sm">← Back to Home</Link>
        <span className="text-xs font-mono text-violet-300 uppercase tracking-wider">Cancellation Policy</span>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10 text-slate-300 text-sm leading-relaxed">
        <div className="space-y-3 pb-8 border-b border-white/10">
          <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">Yample Labs Legal</span>
          <h1 className="text-3xl md:text-4xl font-black text-white">Cancellation Policy</h1>
          <p className="text-xs text-slate-500 font-mono">Last Updated: August 7, 2026</p>
        </div>

        <Section num={1} title="Cancellation by Client — Before Project Start">
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li><strong className="text-white">Within 24 Hours of Payment:</strong> Full cancellation with 100% refund (minus Razorpay processing fee). Submit via email immediately — work may begin within hours of order confirmation.</li>
            <li><strong className="text-white">24–72 Hours After Payment:</strong> Eligible for 70% refund if planning phase has not yet started.</li>
            <li><strong className="text-white">After Planning Begins:</strong> Project enters active status. See our <Link href="/refund-policy" className="text-violet-400 hover:underline">Refund Policy</Link> for applicable refund amounts based on stage.</li>
          </ul>
        </Section>

        <Section num={2} title="Cancellation Mid-Project">
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li>If you wish to cancel a project in progress, please notify us in writing at <strong className="text-violet-400">yamplelabs@gmail.com</strong> with your Order ID and reason.</li>
            <li>Work completed to date will be provided to you as a partial deliverable.</li>
            <li>No refund is issued for work already completed and delivered.</li>
            <li>Any third-party costs already incurred on your behalf (e.g., domain registration, premium plugins) are non-refundable.</li>
          </ul>
        </Section>

        <Section num={3} title="Cancellation by Yample Labs">
          <p>We reserve the right to cancel a project in the following circumstances:</p>
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li>Client non-response for more than 14 consecutive days without prior notice.</li>
            <li>Discovery that project requirements violate our <Link href="/acceptable-use" className="text-violet-400 hover:underline">Acceptable Use Policy</Link>.</li>
            <li>Failure to provide required content, credentials, or assets for more than 30 days.</li>
            <li>Abusive, threatening, or harassing communication from the client toward our team.</li>
          </ul>
          <p>In such cases, a prorated refund may be issued for unstarted phases of the project, at our discretion.</p>
        </Section>

        <Section num={4} title="Account Cancellation">
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li>You may delete your AuditAI account at any time from your Profile Settings or by emailing us.</li>
            <li>Account deletion is permanent. All audit history, quotes, and project data will be deleted from active storage.</li>
            <li>Data retained for legal/accounting purposes after deletion is governed by our <Link href="/data-retention" className="text-violet-400 hover:underline">Data Retention Policy</Link>.</li>
          </ul>
        </Section>

        <Section num={5} title="How to Cancel">
          <p>To cancel a project or account:</p>
          <ul className="list-none space-y-2 ml-0">
            <li>📧 Email: <strong className="text-violet-400">yamplelabs@gmail.com</strong></li>
            <li>📋 Subject Line: <strong className="text-white">"PROJECT CANCELLATION — [Order ID]"</strong></li>
            <li>💬 WhatsApp: Available via Chat on WhatsApp button for urgent cases</li>
          </ul>
          <p>We will acknowledge cancellation requests within 1 business day.</p>
        </Section>
      </div>
    </div>
  )
}
