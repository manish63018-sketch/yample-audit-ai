'use client'

import { useAuth } from '@/providers/auth-provider'

interface NavbarHeaderProps {
  onOpenQuickAudit: () => void
}

export function NavbarHeader({ onOpenQuickAudit }: NavbarHeaderProps) {
  const { user, organization } = useAuth()

  return (
    <header className="h-16 border-b border-border bg-card/40 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-surface/60 px-3 py-1.5 rounded-lg border border-border/60 text-xs text-text-primary">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold">{organization?.name || 'My Agency Workspace'}</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={onOpenQuickAudit}
          className="px-4 py-2 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand-hover transition-all shadow-md shadow-brand/20 flex items-center space-x-2"
        >
          <span>⚡</span>
          <span>Run New Audit</span>
        </button>

        <div className="flex items-center space-x-3 border-l border-border/60 pl-4">
          <div className="h-8 w-8 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center font-bold text-brand text-xs">
            {user?.email?.[0].toUpperCase() || 'A'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-medium text-text-primary">{user?.email || 'admin@agency.com'}</div>
            <div className="text-[10px] text-text-muted">Administrator</div>
          </div>
        </div>
      </div>
    </header>
  )
}
