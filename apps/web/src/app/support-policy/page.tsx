import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SLA & Support Policy | AuditAI by Yample Labs',
  description: 'Service Level Agreement and post-launch support policy for custom projects delivered by Yample Labs.',
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

export default function SupportPolicyPage() {
  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="text-white/60 hover:text-white transition-colors text-sm">← Back to Home</Link>
        <span className="text-xs font-mono text-violet-300 uppercase tracking-wider">SLA & Support Policy</span>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10 text-slate-300 text-sm leading-relaxed">
        <div className="space-y-3 pb-8 border-b border-white/10">
          <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">Yample Labs SLA</span>
          <h1 className="text-3xl md:text-4xl font-black text-white">SLA & Support Policy</h1>
          <p className="text-xs text-slate-500 font-mono">Last Updated: August 7, 2026</p>
        </div>

        <Section num={1} title="Post-Launch 30-Day Support Window">
          <p>Every custom development project by Yample Labs includes a <strong className="text-white">30-day complimentary post-launch support window</strong> beginning from the date the project goes live (or from official handover, whichever comes first).</p>
          <p>During this window, we will:</p>
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li>Fix any bugs or defects directly caused by our development work — at no additional cost.</li>
            <li>Resolve functional issues that prevent core features from working as specified.</li>
            <li>Provide guidance on using the delivered website or application.</li>
          </ul>
        </Section>

        <Section num={2} title="What Is Covered Under 30-Day Support">
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li>Bugs introduced by our code — layout breaks, broken forms, API errors caused by our integration.</li>
            <li>Mobile/browser compatibility issues present at the time of delivery.</li>
            <li>Performance issues directly attributable to our implementation.</li>
            <li>Minor content updates (text changes, image swaps) — up to 2 rounds.</li>
          </ul>
        </Section>

        <Section num={3} title="What Is NOT Covered">
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li>New feature requests or scope changes beyond the original project brief.</li>
            <li>Issues caused by client modifications to the codebase after delivery.</li>
            <li>Third-party service outages (hosting, domain registrar, payment gateway, CDN).</li>
            <li>SEO ranking changes — SEO results take time and are not guaranteed within the support window.</li>
            <li>Issues arising from outdated browser versions not specified in the original scope.</li>
          </ul>
        </Section>

        <Section num={4} title="Response Time SLA">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase font-bold">
                <th className="py-2 pr-4 text-left">Priority</th>
                <th className="py-2 pr-4 text-left">Definition</th>
                <th className="py-2 text-left">First Response</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ['🔴 Critical', 'Site is completely down, payment system broken', '4 Business Hours'],
                ['🟠 High', 'Major feature broken, affects core user flow', '8 Business Hours'],
                ['🟡 Medium', 'Non-critical issue, workaround exists', '24 Business Hours'],
                ['🟢 Low', 'Minor UI fix, cosmetic issue', '48 Business Hours'],
              ].map(([priority, def, response]) => (
                <tr key={priority}>
                  <td className="py-2.5 pr-4 font-medium">{priority}</td>
                  <td className="py-2.5 pr-4 text-slate-400">{def}</td>
                  <td className="py-2.5 text-emerald-400 font-mono">{response}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-slate-500 mt-2">Business Hours: Monday–Saturday, 10:00 AM – 7:00 PM IST. Excluding Indian public holidays.</p>
        </Section>

        <Section num={5} title="Extended Support Plans">
          <p>After the 30-day free window, clients may opt for extended maintenance and support plans:</p>
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li><strong className="text-white">Basic Maintenance:</strong> Monthly security updates, plugin updates, performance monitoring.</li>
            <li><strong className="text-white">Standard Support:</strong> Bug fixes, 4 hours/month of update work, priority email support.</li>
            <li><strong className="text-white">Premium Partnership:</strong> Dedicated Slack channel, unlimited minor updates, quarterly performance review, strategy calls.</li>
          </ul>
          <p>Contact us for extended support pricing: <strong className="text-violet-400">yamplelabs@gmail.com</strong></p>
        </Section>

        <Section num={6} title="How to Raise a Support Ticket">
          <ul className="list-none space-y-2">
            <li>📊 <strong className="text-white">Dashboard:</strong> Open a Support Ticket from your Customer Dashboard → Support Tickets tab.</li>
            <li>📧 <strong className="text-white">Email:</strong> yamplelabs@gmail.com with subject "SUPPORT — [Order ID]"</li>
            <li>💬 <strong className="text-white">WhatsApp:</strong> Chat with us via the "Chat on WhatsApp" button for urgent issues.</li>
          </ul>
        </Section>

        <Section num={7} title="Platform Uptime (AuditAI SaaS)">
          <p>We target <strong className="text-white">99.5% uptime</strong> for the AuditAI platform. Planned maintenance will be communicated at least 24 hours in advance via in-app banner and email. In case of unplanned downtime exceeding 2 hours, affected users may request a credit.</p>
        </Section>
      </div>
    </div>
  )
}
