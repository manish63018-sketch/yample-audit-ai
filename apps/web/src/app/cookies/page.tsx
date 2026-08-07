import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy | AuditAI by Yample Labs',
  description: 'How AuditAI by Yample Labs uses cookies and tracking technologies on its platform.',
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

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="text-white/60 hover:text-white transition-colors text-sm">← Back to Home</Link>
        <span className="text-xs font-mono text-violet-300 uppercase tracking-wider">Cookie Policy</span>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10 text-slate-300 text-sm leading-relaxed">
        <div className="space-y-3 pb-8 border-b border-white/10">
          <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">Yample Labs Legal</span>
          <h1 className="text-3xl md:text-4xl font-black text-white">Cookie Policy</h1>
          <p className="text-xs text-slate-500 font-mono">Last Updated: August 7, 2026</p>
        </div>

        <Section num={1} title="What Are Cookies?">
          <p>Cookies are small text files placed on your device by a website when you visit. They help websites remember your preferences, maintain your login session, and understand how you interact with the platform. We also use localStorage and sessionStorage for similar purposes.</p>
        </Section>

        <Section num={2} title="Cookies We Use">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase font-bold">
                <th className="py-2 pr-4 text-left">Cookie / Storage Key</th>
                <th className="py-2 pr-4 text-left">Type</th>
                <th className="py-2 pr-4 text-left">Purpose</th>
                <th className="py-2 text-left">Expiry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ['sb-access-token', 'Essential', 'Supabase authentication session token', 'Session'],
                ['sb-refresh-token', 'Essential', 'Supabase session refresh token', '7 days'],
                ['auditai_user', 'Functional', 'Cached user profile data in localStorage', 'Until logout'],
                ['auditai_cart', 'Functional', 'Saved cart items for checkout resume', '24 hours'],
                ['auditai_active_quote', 'Functional', 'Saved quotation for checkout', '24 hours'],
                ['auditai_currency', 'Functional', "User's preferred currency (INR/USD)", '30 days'],
                ['auditai_requirements', 'Functional', 'Draft requirement form auto-save', '48 hours'],
                ['auditai_lang', 'Functional', 'User language preference', '30 days'],
                ['_vercel_analytics', 'Analytical', 'Anonymous page view analytics via Vercel', '30 days'],
              ].map(([name, type, purpose, expiry]) => (
                <tr key={name}>
                  <td className="py-2.5 pr-4 font-mono text-violet-300 text-[11px]">{name}</td>
                  <td className="py-2.5 pr-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${type === 'Essential' ? 'bg-emerald-500/20 text-emerald-300' : type === 'Functional' ? 'bg-blue-500/20 text-blue-300' : 'bg-amber-500/20 text-amber-300'}`}>{type}</span>
                  </td>
                  <td className="py-2.5 pr-4 text-slate-400">{purpose}</td>
                  <td className="py-2.5 text-slate-400 font-mono text-[11px]">{expiry}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section num={3} title="Third-Party Cookies">
          <p>The following third-party services may set cookies when you use our platform:</p>
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li><strong className="text-white">Razorpay:</strong> Sets cookies during the payment flow for fraud detection and session management. Subject to Razorpay's privacy policy.</li>
            <li><strong className="text-white">Vercel Analytics:</strong> Anonymous, cookie-less analytics for page performance monitoring. No personal data is collected.</li>
          </ul>
          <p>We do not use Google Analytics, Facebook Pixel, or any advertising cookies.</p>
        </Section>

        <Section num={4} title="Managing Cookies">
          <p>You can control cookies through:</p>
          <ul className="list-disc list-outside ml-4 space-y-2">
            <li><strong className="text-white">Browser Settings:</strong> Most browsers allow you to block or delete cookies. Note that blocking essential cookies will prevent you from logging in to AuditAI.</li>
            <li><strong className="text-white">localStorage/sessionStorage:</strong> You can clear these via your browser's developer tools (F12 → Application → Storage).</li>
            <li><strong className="text-white">Account Deletion:</strong> Deleting your account removes all stored data including session cookies.</li>
          </ul>
        </Section>

        <Section num={5} title="Your Consent">
          <p>By creating an account and checking the Cookies consent box during signup, you agree to our use of cookies as described in this policy. You can withdraw consent by emailing us or deleting your account.</p>
        </Section>
      </div>
    </div>
  )
}
