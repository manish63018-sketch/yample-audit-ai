'use client'

import { useState } from 'react'

export function AIAssistantBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    {
      sender: 'bot',
      text: "Hi 👋\n\nI'm AuditAI.\n\nWould you like a free audit or a custom website quotation?",
    },
  ])

  const handleOption = (option: string) => {
    setMessages(prev => [
      ...prev,
      { sender: 'user', text: option },
    ])

    setTimeout(() => {
      if (option.includes('audit')) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: 'Awesome! 🚀 Paste your website URL in the search bar above or click below to launch the free audit interactive report.',
          },
        ])
      } else {
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: "Great choice! 💼 Our packages range from $599 (Website Upgrade) to $1,999 (Full SaaS Redesign + AI System). You can also use our interactive Project Calculator!",
          },
        ])
      }
    }, 600)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Floating Chat Modal */}
      {open && (
        <div className="mb-4 w-80 sm:w-96 rounded-2xl border border-purple-500/30 bg-[#0F172A]/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-fade-in shadow-purple-500/20">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-900/60 via-purple-900/60 to-slate-900 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-lg shadow-lg">
                🤖
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0F172A]" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">AuditAI Assistant</div>
                <div className="text-[10px] text-emerald-400 font-medium">Online • Instant AI Response</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white text-sm w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          {/* Chat Messages */}
          <div className="p-4 max-h-80 overflow-y-auto space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs whitespace-pre-line leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none shadow-md'
                      : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Option Buttons */}
          <div className="p-3 border-t border-white/10 bg-[#050816]/70 flex flex-col gap-2">
            <button
              onClick={() => handleOption('I want a free website audit 🚀')}
              className="w-full text-left px-3 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 text-purple-300 text-xs font-medium transition-all"
            >
              🔍 Free Website Audit
            </button>
            <button
              onClick={() => handleOption('Get custom website quotation 💼')}
              className="w-full text-left px-3 py-2 rounded-xl bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30 text-blue-300 text-xs font-medium transition-all"
            >
              💼 Custom Quotation ($599 - $5000)
            </button>
            <a
              href="/calculator"
              className="block w-full text-center py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md hover:opacity-90 transition-opacity"
            >
              🧮 Try Interactive Calculator →
            </a>
          </div>
        </div>
      )}

      {/* Floating Orb Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative group w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow-xl shadow-purple-500/30 hover:scale-110 transition-all duration-300 border border-white/20"
        aria-label="Open AI Assistant Chat"
      >
        <span className="animate-pulse">🤖</span>
        <span className="absolute inset-0 rounded-2xl bg-purple-500/30 blur-md group-hover:blur-lg transition-all pointer-events-none" />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#050816]" />
      </button>
    </div>
  )
}

