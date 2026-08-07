'use client'

import React, { useState } from 'react'
import { Bell, Zap, Rocket, FileText, X } from 'lucide-react'

interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: 'order' | 'audit' | 'quote' | 'system'
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Order Status Update',
      message: 'Order #ORD-2026-9401 has moved to UI Design stage.',
      time: '10m ago',
      read: false,
      type: 'order',
    },
    {
      id: '2',
      title: 'Quote Ready',
      message: 'Your custom quotation #Q-2026-9401 is ready for review.',
      time: '1h ago',
      read: false,
      type: 'quote',
    },
    {
      id: '3',
      title: 'Audit Complete',
      message: 'AI audit report generated for github.com (Score: 88).',
      time: '3h ago',
      read: true,
      type: 'audit',
    },
  ])

  const unreadCount = notifications.filter((n: NotificationItem) => !n.read).length

  const markAllRead = () => {
    setNotifications((prev: NotificationItem[]) => prev.map((n: NotificationItem) => ({ ...n, read: true })))
  }

  const markRead = (id: string) => {
    setNotifications((prev: NotificationItem[]) => prev.map((n: NotificationItem) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-[#08080f]">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-white/10 bg-[#0f0f1a] shadow-2xl p-4 z-50 text-white space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-violet-600/30 text-violet-300 text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-[11px] text-violet-400 hover:underline">
                  Mark all read
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">No notifications.</div>
            ) : (
              notifications.map((n: NotificationItem) => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                    n.read
                      ? 'bg-white/[0.01] border-white/5 opacity-60'
                      : 'bg-violet-950/20 border-violet-500/30 text-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold">
                      {n.type === 'order' && <Rocket className="w-3.5 h-3.5 text-violet-400" />}
                      {n.type === 'quote' && <FileText className="w-3.5 h-3.5 text-indigo-400" />}
                      {n.type === 'audit' && <Zap className="w-3.5 h-3.5 text-emerald-400" />}
                      <span>{n.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
