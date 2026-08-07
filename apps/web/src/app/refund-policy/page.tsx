import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund & Satisfaction Policy | AuditAI by Yample Labs',
  description: 'Refund and satisfaction guarantee policy for Yample Labs AuditAI platform and development services.',
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

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="text-white/60 hover:text-white transition-colors text-sm">← Back to Home</Link>
        <span className="text-xs font-mono text-violet-300 uppercase tracking-wider">Refund Policy</span>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10 text-slate-300 text-sm leading-relaxed">
        <div className="space-y-3 pb-8 border-b border-white/10">
          <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">Yample Labs Legal</span>
          <h1 className="text-3xl md:text-4xl font-black text-white">Refund & Satisfaction Policy</h1>
          <p className="text-xs text-slate-500 font-mono">Last Updated: August 7, 2026</p>
        </div>

        <p className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-5">
          At Yample Labs, we stand behind the quality of our work. Our refund policy is designed to be fair, transparent, and client-friendly — protecting both parties while ensuring you receive the value you paid for.
        </p>

        <Section num={1} title="Website Audit Services">
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li><strong className="text-white">No Refund After Delivery:</strong> Once an audit report has been generated and delivered to your dashboard, the service is considered rendered and no refund applies.</li>
            <li><strong className="text-white">Technical Failure:</strong> If our system fails to complete your audit due to a technical error on our end, you are entitled to a full re-audit at no additional cost, or a full refund if the issue cannot be resolved within 72 hours.</li>
            <li><strong className="text-white">Free Tier:</strong> Free audit credits have no monetary value and are not refundable.</li>
          </ul>
        </Section>

        <Section num={2} title="Custom Development Projects">
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li><strong className="text-white">Before Work Begins:</strong> If you cancel your project before our team begins any work (within 24 hours of payment), you are eligible for a 100% refund minus any payment processing fees charged by Razorpay.</li>
            <li><strong className="text-white">After Work Begins (Design Phase):</strong> If cancellation occurs after the planning or design phase has begun, you are eligible for a refund of up to 50% of the project value, proportional to remaining undelivered work.</li>
            <li><strong className="text-white">After Development Phase:</strong> Once development has started, no monetary refund is issued. However, we will deliver whatever has been completed to date.</li>
            <li><strong className="text-white">Satisfaction Guarantee:</strong> If you are genuinely dissatisfied with the quality of a completed deliverable, we will offer one round of free revisions. If the revision still does not meet the original agreed brief, we will negotiate a fair partial credit.</li>
          </ul>
        </Section>

        <Section num={3} title="What Is NOT Refundable">
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li>Change of mind after project work has commenced.</li>
            <li>Dissatisfaction arising from requirements you provided being inaccurate or incomplete.</li>
            <li>Third-party costs: domain registration, hosting fees, third-party API charges, licensing fees.</li>
            <li>Projects where client feedback was not provided within 5 business days, causing project delays.</li>
            <li>Completed and delivered projects that functioned as specified in the requirement form.</li>
          </ul>
        </Section>

        <Section num={4} title="Refund Process">
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li>Submit a refund request by emailing <strong className="text-violet-400">yamplelabs@gmail.com</strong> with your Order ID and reason.</li>
            <li>We will acknowledge your request within 2 business days.</li>
            <li>If approved, refunds are processed within 7–10 business days via the original payment method.</li>
            <li>Razorpay processing fees (typically 2–3%) are non-refundable.</li>
          </ul>
        </Section>

        <Section num={5} title="Disputes">
          <p>If you believe you have been incorrectly denied a refund, you may escalate your request to <strong className="text-violet-400">yamplelabs@gmail.com</strong> with "REFUND DISPUTE" in the subject line. We will review and respond within 5 business days.</p>
        </Section>
      </div>
    </div>
  )
}
