'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  label: string
  href: string
  icon: string
}

const navItems: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: '📊' },
  { label: 'Audit Center', href: '/audits', icon: '⚡' },
  { label: 'Leads & CRM', href: '/leads', icon: '🎯' },
  { label: 'Proposals', href: '/proposals', icon: '📄' },
  { label: 'Analytics', href: '/analytics', icon: '📈' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
  { label: 'Billing', href: '/billing', icon: '💳' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border bg-card/60 backdrop-blur-md min-h-screen flex flex-col justify-between p-4">
      <div>
        <div className="flex items-center space-x-3 px-3 py-4 mb-6 border-b border-border/50">
          <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center font-bold text-white shadow-md shadow-brand/20">
            A
          </div>
          <div>
            <span className="font-bold text-lg text-text-primary tracking-tight block leading-none">
              AuditAI
            </span>
            <span className="text-[10px] text-brand font-semibold tracking-wider uppercase">
              Yample Labs
            </span>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand/10 text-brand border border-brand/20 shadow-sm'
                    : 'text-text-muted hover:text-text-primary hover:bg-surface/50'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-border/50 px-3">
        <div className="rounded-lg bg-surface/40 p-3 border border-border/50">
          <div className="text-xs font-semibold text-text-primary mb-1">Agency Pro Plan</div>
          <div className="text-[11px] text-text-muted mb-2">42 of 100 audits used this month</div>
          <div className="w-full bg-border/60 h-1.5 rounded-full overflow-hidden">
            <div className="bg-brand h-full w-[42%]" />
          </div>
        </div>
      </div>
    </aside>
  )
}
