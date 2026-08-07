import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Acceptable Use Policy | AuditAI by Yample Labs',
  description: 'Rules and restrictions governing appropriate use of the AuditAI platform and Yample Labs services.',
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

export default function AcceptableUsePage() {
  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="text-white/60 hover:text-white transition-colors text-sm">← Back to Home</Link>
        <span className="text-xs font-mono text-violet-300 uppercase tracking-wider">Acceptable Use Policy</span>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10 text-slate-300 text-sm leading-relaxed">
        <div className="space-y-3 pb-8 border-b border-white/10">
          <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">Yample Labs Legal</span>
          <h1 className="text-3xl md:text-4xl font-black text-white">Acceptable Use Policy</h1>
          <p className="text-xs text-slate-500 font-mono">Last Updated: August 7, 2026</p>
        </div>

        <p className="bg-red-950/20 border border-red-500/20 rounded-xl p-5">
          This Acceptable Use Policy ("<strong className="text-white">AUP</strong>") defines prohibited behaviors on the AuditAI platform. Violation of this policy may result in immediate account suspension, termination without refund, and potential legal action.
        </p>

        <Section num={1} title="Permitted Use">
          <p>AuditAI may be used for:</p>
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li>Auditing websites you own or have explicit written authorization to test.</li>
            <li>Generating AI-powered performance, SEO, and security reports for legitimate business purposes.</li>
            <li>Commissioning website development, SEO, or AI integration services for lawful business operations.</li>
            <li>Comparing your website's performance against publicly available competitor data.</li>
          </ul>
        </Section>

        <Section num={2} title="Prohibited Activities">
          <p>You must NOT use AuditAI to:</p>
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li><strong className="text-white">Unauthorized Testing:</strong> Audit, scan, or analyze any website without the explicit permission of its owner.</li>
            <li><strong className="text-white">Security Exploitation:</strong> Use our audit data to exploit vulnerabilities in third-party websites.</li>
            <li><strong className="text-white">Automated Abuse:</strong> Use bots, scrapers, or automation tools to abuse our free audit tier or circumvent rate limits.</li>
            <li><strong className="text-white">False Information:</strong> Provide false business details, fraudulent requirements, or impersonate another person or company.</li>
            <li><strong className="text-white">Illegal Content:</strong> Request development of websites, applications, or content related to illegal activities, gambling (without proper license), adult content without age verification, or anything violating Indian law.</li>
            <li><strong className="text-white">Competitive Intelligence Abuse:</strong> Use our competitor analysis features to engage in unfair competitive practices.</li>
            <li><strong className="text-white">Resale Without Authorization:</strong> Resell, white-label, or sublicense AuditAI capabilities without written authorization from Yample Labs.</li>
            <li><strong className="text-white">Reverse Engineering:</strong> Attempt to decompile, disassemble, or reverse engineer our AI models, algorithms, or platform code.</li>
            <li><strong className="text-white">Harassment:</strong> Engage in abusive, threatening, or harassing behavior toward Yample Labs staff or other users.</li>
          </ul>
        </Section>

        <Section num={3} title="Content Standards">
          <p>Any content you provide to us (requirements, assets, reference materials) must not:</p>
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li>Infringe on any third party's intellectual property rights.</li>
            <li>Contain malware, malicious code, or harmful scripts.</li>
            <li>Promote hate speech, discrimination, violence, or illegal activities.</li>
            <li>Violate any applicable Indian or international laws.</li>
          </ul>
        </Section>

        <Section num={4} title="Enforcement">
          <p>We monitor usage for AUP violations and reserve the right to:</p>
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li>Issue a warning for minor first-time violations.</li>
            <li>Temporarily suspend accounts under investigation.</li>
            <li>Permanently terminate accounts for serious or repeated violations — without refund.</li>
            <li>Report illegal activities to appropriate law enforcement authorities.</li>
          </ul>
        </Section>

        <Section num={5} title="Reporting Violations">
          <p>If you become aware of AUP violations by other users, please report them to <strong className="text-violet-400">yamplelabs@gmail.com</strong> with subject "AUP VIOLATION REPORT". We take all reports seriously.</p>
        </Section>
      </div>
    </div>
  )
}
