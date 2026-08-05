'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [orgName, setOrgName] = useState('Yample Labs Agency')
  const [brandColor, setBrandColor] = useState('#2563EB')
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const teamMembers = [
    { name: 'Principal Admin', email: 'admin@yamplelabs.com', role: 'Owner', status: 'Active' },
    { name: 'Lead Auditor', email: 'auditor@yamplelabs.com', role: 'Member', status: 'Active' },
    { name: 'SEO Strategist', email: 'seo@yamplelabs.com', role: 'Member', status: 'Active' },
  ]

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Organization Settings</h1>
        <p className="text-sm text-text-muted mt-1">
          Manage agency branding, team member access, white-label configurations, and API keys.
        </p>
      </div>

      {saved && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
          Organization settings saved successfully!
        </div>
      )}

      {/* Organization Branding Section */}
      <form onSubmit={handleSave} className="p-6 rounded-xl border border-border bg-card space-y-6">
        <h2 className="text-base font-bold text-text-primary border-b border-border/60 pb-3">
          Agency Profile & White-Label Branding
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Agency / Organization Name</label>
            <input
              type="text"
              required
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary focus:border-brand focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Brand Accent Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                className="h-10 w-12 rounded bg-surface border border-border cursor-pointer p-1"
              />
              <input
                type="text"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                className="flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary font-mono focus:border-brand focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand-hover transition-all shadow-md shadow-brand/20"
          >
            Save Agency Profile
          </button>
        </div>
      </form>

      {/* Team Members Section */}
      <div className="p-6 rounded-xl border border-border bg-card space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div>
            <h2 className="text-base font-bold text-text-primary">Team Members & Access Control</h2>
            <p className="text-xs text-text-muted">Manage RBAC permissions for agency staff</p>
          </div>
          <button className="px-3.5 py-2 rounded-lg bg-surface border border-border text-xs font-semibold text-text-primary hover:bg-surface/80">
            + Invite Member
          </button>
        </div>

        <div className="divide-y divide-border/40">
          {teamMembers.map((member) => (
            <div key={member.email} className="py-3 flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-text-primary">{member.name}</div>
                <div className="text-text-muted">{member.email}</div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="px-2.5 py-1 rounded-full bg-surface border border-border text-text-muted font-medium">
                  {member.role}
                </span>
                <span className="text-emerald-400 font-semibold">{member.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
