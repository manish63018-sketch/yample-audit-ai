'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { NavbarHeader } from '@/components/dashboard/NavbarHeader'
import { QuickAuditModal } from '@/components/dashboard/QuickAuditModal'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-text-primary flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <NavbarHeader onOpenQuickAudit={() => setIsModalOpen(true)} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>

      <QuickAuditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
