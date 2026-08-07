import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Master Service Agreement | AuditAI by Yample Labs',
  description: 'Master Service Agreement (MSA) governing the professional relationship between Yample Labs and its clients for custom development and digital services.',
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

export default function ServiceAgreementPage() {
  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="text-white/60 hover:text-white transition-colors text-sm">← Back to Home</Link>
        <span className="text-xs font-mono text-violet-300 uppercase tracking-wider">Master Service Agreement</span>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10 text-slate-300 text-sm leading-relaxed">
        <div className="space-y-3 pb-8 border-b border-white/10">
          <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">Yample Labs Legal</span>
          <h1 className="text-3xl md:text-4xl font-black text-white">Master Service Agreement</h1>
          <p className="text-xs text-slate-500 font-mono">Last Updated: August 7, 2026 · Governs all custom service engagements</p>
        </div>

        <p className="bg-violet-950/20 border border-violet-500/20 rounded-xl p-5">
          This Master Service Agreement ("<strong className="text-white">MSA</strong>") is entered into between <strong className="text-white">Yample Labs</strong> ("<strong className="text-white">Service Provider</strong>") and the client ("<strong className="text-white">Client</strong>") placing an order through the AuditAI platform. By placing an order, the Client agrees to be bound by this MSA, together with the applicable project quotation ("<strong className="text-white">Statement of Work</strong>").
        </p>

        <Section num={1} title="Engagement & Statement of Work">
          <p>Each project engagement is defined by a Statement of Work (SOW) consisting of:</p>
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li>The Project Requirement Form submitted by the Client.</li>
            <li>The Auto-Generated Quotation accepted by the Client at checkout.</li>
            <li>Any additional scope agreed in writing via email or WhatsApp.</li>
          </ul>
          <p>In the event of any conflict between documents, the order of precedence is: (1) Written email confirmation, (2) Accepted quotation, (3) Requirement Form, (4) This MSA.</p>
        </Section>

        <Section num={2} title="Scope of Services">
          <p>Yample Labs will deliver the services specified in the accepted quotation. Services not mentioned in the quotation are considered out-of-scope. Any additional requirements will be quoted separately.</p>
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li><strong className="text-white">Included:</strong> Services listed in the accepted quote and project requirement form.</li>
            <li><strong className="text-white">Excluded:</strong> Server setup/hosting fees, third-party tool subscriptions, domain registration, stock photography (unless included), ongoing maintenance beyond the 30-day support window.</li>
          </ul>
        </Section>

        <Section num={3} title="Payment & Invoicing">
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li><strong className="text-white">Payment Terms:</strong> Full payment is required before project commencement unless a milestone-based plan is agreed in writing.</li>
            <li><strong className="text-white">Invoices:</strong> A tax invoice compliant with Indian GST regulations will be issued upon payment.</li>
            <li><strong className="text-white">Late Fees:</strong> For post-delivery invoices (if applicable), a late payment fee of 1.5% per month applies to overdue balances after 30 days.</li>
            <li><strong className="text-white">Currency:</strong> All invoices are in INR for Indian clients. International clients may be invoiced in USD.</li>
          </ul>
        </Section>

        <Section num={4} title="Revisions & Change Orders">
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li>Each project includes <strong className="text-white">2 rounds of revisions</strong> within the original scope at no additional cost.</li>
            <li>Additional revision rounds are billed at ₹999/hour (or USD equivalent).</li>
            <li>Scope changes that materially alter the project will require a Change Order with revised pricing and timeline.</li>
            <li>Revisions must be submitted as a consolidated list — incremental individual requests may each count as a revision round.</li>
          </ul>
        </Section>

        <Section num={5} title="Confidentiality">
          <p>Both parties agree to maintain confidentiality of non-public information shared during the engagement. Neither party will disclose proprietary business information, trade secrets, or technical specifications to third parties without prior written consent.</p>
          <p>Yample Labs will not disclose your project details, requirements, or business data to competitors or third parties outside of our service delivery supply chain.</p>
        </Section>

        <Section num={6} title="Warranties & Representations">
          <p>Yample Labs warrants that:</p>
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li>Deliverables will materially conform to the specifications in the accepted quotation.</li>
            <li>We have the right to license any third-party components incorporated in deliverables.</li>
            <li>Deliverables will not knowingly infringe third-party intellectual property rights.</li>
          </ul>
          <p>The Client warrants that:</p>
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li>All content and assets provided are owned by the Client or properly licensed.</li>
            <li>The intended use of deliverables complies with all applicable laws.</li>
          </ul>
        </Section>

        <Section num={7} title="Force Majeure">
          <p>Neither party shall be held liable for delays or failures caused by circumstances beyond their reasonable control, including but not limited to: natural disasters, government actions, power outages, internet infrastructure failures, pandemics, or strikes. The affected party will notify the other within 48 hours and parties will work in good faith to reschedule.</p>
        </Section>

        <Section num={8} title="Term & Termination">
          <p>This MSA applies to each project from the date of order placement until final project delivery and completion of the 30-day support window. Either party may terminate in accordance with our <Link href="/cancellation" className="text-violet-400 hover:underline">Cancellation Policy</Link>. Termination does not affect accrued rights and obligations.</p>
        </Section>

        <Section num={9} title="Entire Agreement">
          <p>This MSA, together with the accepted project quotation and requirement form, constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements relating to the subject matter. Amendments must be in writing and signed by both parties.</p>
        </Section>

        <Section num={10} title="Governing Law">
          <p>This Agreement is governed by Indian law. Disputes shall first be resolved through 30 days of good-faith negotiation. If unresolved, disputes shall be subject to binding arbitration or the courts of Hyderabad, Telangana, India.</p>
        </Section>
      </div>
    </div>
  )
}
