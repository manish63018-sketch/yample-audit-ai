'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, ShieldCheck, Sparkles, Globe, ArrowRight, Zap, Building2, Gift, Lock } from 'lucide-react'
import { useGeo } from '@/context/GeoContext'

type RegionTab = 'india' | 'international'

export function Pricing() {
  const { geo } = useGeo()
  const [activeRegion, setActiveRegion] = useState<RegionTab>(geo.isIndia ? 'india' : 'international')

  return (
    <section id="pricing" className="py-24 border-t border-white/5 bg-[#050816] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Fixed Investment Plans
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Start Small. Build Smart.{' '}
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Scale Without Rebuilding.
            </span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            {activeRegion === 'india'
              ? 'Professional business websites starting from ₹15,000 with 1-year domain, email & support.'
              : 'Managed business websites starting from $499, or choose our $4,999 Managed Business Plan for a complete website plus 12 months of technical web development partner management.'}
          </p>

          {/* Region Switcher */}
          <div className="pt-4 inline-flex items-center gap-1.5 p-1.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
            <button
              onClick={() => setActiveRegion('india')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeRegion === 'india'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇮🇳</span>
              <span>India Business Plans (INR ₹)</span>
            </button>
            <button
              onClick={() => setActiveRegion('international')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeRegion === 'international'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🌎</span>
              <span>International Plans (USD $)</span>
            </button>
          </div>
        </div>

        {/* INDIA PLANS GRID */}
        {activeRegion === 'india' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {/* 1. STARTER */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 flex flex-col justify-between hover:border-violet-500/30 transition-all">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Starter</div>
                <div className="text-3xl font-black text-white font-mono mb-2">₹15,000</div>
                <p className="text-xs text-slate-400 mb-6 min-h-[36px]">
                  For individuals, freelancers &amp; local small businesses needing a clean online presence.
                </p>

                <div className="space-y-2.5 text-xs text-slate-300 mb-6 border-t border-white/5 pt-4">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Professional Custom Website (Up to 4 Pages)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Mobile + Desktop Responsive &amp; Basic UI/UX</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Contact / Enquiry Form &amp; WhatsApp Integration</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Google Maps Integration &amp; Basic SEO</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>SSL Security &amp; Deployment</span>
                  </div>
                  <div className="flex items-start gap-2 font-bold text-violet-300">
                    <Check className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                    <span>1-Year Custom Domain Included</span>
                  </div>
                  <div className="flex items-start gap-2 font-bold text-violet-300">
                    <Check className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                    <span>1-Year Business Email Included</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Full Website Ownership &amp; Basic Support</span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout?plan=starter_inr"
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs text-center transition-all"
              >
                Select Starter Plan →
              </Link>
            </div>

            {/* 2. BUSINESS */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 flex flex-col justify-between hover:border-violet-500/30 transition-all">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Business</div>
                <div className="text-3xl font-black text-white font-mono mb-2">₹25,000</div>
                <p className="text-xs text-slate-400 mb-6 min-h-[36px]">
                  For growing local businesses needing a stronger conversion-focused online presence.
                </p>

                <div className="space-y-2.5 text-xs text-slate-300 mb-6 border-t border-white/5 pt-4">
                  <div className="font-semibold text-white text-[11px]">Everything in Starter, plus:</div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Up to 7 Pages &amp; Advanced UI/UX</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Services / Product Sections &amp; Gallery Portfolio</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>FAQ Section &amp; Testimonials / Reviews</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>WhatsApp + Call + Email Action Triggers</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Performance Optimization &amp; Analytics Setup</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Extended Post-Launch Support</span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout?plan=business_inr"
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs text-center transition-all"
              >
                Select Business Plan →
              </Link>
            </div>

            {/* 3. BUSINESS PRO */}
            <div className="rounded-3xl border border-violet-500/50 bg-gradient-to-b from-violet-950/40 via-slate-900 to-slate-900 p-6 flex flex-col justify-between relative shadow-xl shadow-violet-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider">
                ⭐ Most Popular
              </div>

              <div>
                <div className="text-xs font-bold text-violet-300 uppercase tracking-wider mb-1">Business Pro</div>
                <div className="text-3xl font-black text-white font-mono mb-2">₹45,000</div>
                <p className="text-xs text-slate-300 mb-6 min-h-[36px]">
                  For growing companies, clinics &amp; brands requiring interactive booking &amp; catalogues.
                </p>

                <div className="space-y-2.5 text-xs text-slate-300 mb-6 border-t border-white/10 pt-4">
                  <div className="font-semibold text-violet-300 text-[11px]">Everything in Business, plus:</div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                    <span>Up to 10 Pages &amp; Advanced Custom Sections</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                    <span>Booking / Appointment System</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                    <span>Product / Service Catalogue</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                    <span>Customer Enquiry Management</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                    <span>Advanced SEO Foundation &amp; Analytics</span>
                  </div>
                  <div className="flex items-start gap-2 font-bold text-emerald-400">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Priority Engineering Support</span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout?plan=business_pro_inr"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-extrabold text-xs text-center shadow-lg shadow-violet-500/25 hover:opacity-90 transition-all"
              >
                Select Business Pro →
              </Link>
            </div>

            {/* 4. BUSINESS GROWTH */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 flex flex-col justify-between hover:border-violet-500/30 transition-all">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Business Growth</div>
                <div className="text-3xl font-black text-white font-mono mb-2">₹75,000+</div>
                <p className="text-xs text-slate-400 mb-6 min-h-[36px]">
                  Complete business website system with custom development &amp; database integrations.
                </p>

                <div className="space-y-2.5 text-xs text-slate-300 mb-6 border-t border-white/5 pt-4">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Complete Custom Website System</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Multiple Business Pages &amp; Custom Scope</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Database &amp; Admin Functionality</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Product / Service Management Systems</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Advanced SEO, Analytics &amp; Security</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Custom Development Built Around Your Workflow</span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout?plan=business_growth_inr"
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs text-center transition-all"
              >
                Request Scope Quote →
              </Link>
            </div>
          </div>
        ) : (
          /* INTERNATIONAL PLANS GRID */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {/* Entry Managed */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 flex flex-col justify-between hover:border-violet-500/30 transition-all">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Starter Managed</div>
                <div className="text-4xl font-black text-white font-mono mb-2">$499 <span className="text-xs font-normal text-slate-400">USD</span></div>
                <p className="text-xs text-slate-400 mb-6">
                  Essential custom website with hosting &amp; deployment configuration for international businesses.
                </p>

                <div className="space-y-3 text-xs text-slate-300 mb-8 border-t border-white/5 pt-5">
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Custom Responsive Website</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>1-Year Custom Domain &amp; Email</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Hosting Setup &amp; Cloud Deployment</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Basic SEO &amp; Security Setup</span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout?plan=starter_usd"
                className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs text-center transition-all"
              >
                Select $499 Plan →
              </Link>
            </div>

            {/* $4,999 MANAGED BUSINESS PLAN (FLAGSHIP) */}
            <div className="md:col-span-2 rounded-3xl border-2 border-amber-500/60 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 p-8 flex flex-col justify-between relative shadow-2xl shadow-amber-500/10">
              <div className="absolute -top-4 left-6 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                <Star className="w-3.5 h-3.5 fill-white" /> 1-Year Managed Development Partner
              </div>

              <div className="space-y-6 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div>
                    <h3 className="text-2xl font-black text-white">THE COMPLETE BUSINESS WEBSITE + 1 YEAR MANAGEMENT</h3>
                    <p className="text-xs text-amber-300 font-semibold mt-1">
                      Not just a website. Your infrastructure &amp; development partner for the next 12 months.
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-4xl font-black text-amber-300 font-mono">$4,999 <span className="text-xs font-normal text-slate-400">USD</span></div>
                    <div className="text-[10px] text-emerald-400 font-bold">$100/mo after 1st Year (Optional)</div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 text-xs text-slate-200">
                  <div className="space-y-3">
                    <div className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-amber-300">
                      <Globe className="w-4 h-4" /> Core Website Infrastructure
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Fully Custom Conversion-Focused Website</span>
                    </div>
                    <div className="flex items-start gap-2 font-bold text-amber-300">
                      <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>🌐 4-YEAR CUSTOM DOMAIN INCLUDED</span>
                    </div>
                    <div className="flex items-start gap-2 font-bold text-amber-300">
                      <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>✉️ 4-YEAR BUSINESS EMAIL INCLUDED</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>☁️ Cloud Hosting &amp; Technical Deployment Included</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>WhatsApp, Maps &amp; Social Media Integration</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-amber-300">
                      <ShieldCheck className="w-4 h-4" /> 1-Year Dedicated Management
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>We handle technical bugs, fixes &amp; deployment issues</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Minor content updates &amp; layout adjustments</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Performance checks &amp; security maintenance</span>
                    </div>
                    <div className="flex items-start gap-2 font-bold text-emerald-400">
                      <Gift className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>🎁 40% OFF YOUR NEXT WEBSITE PROJECT</span>
                    </div>
                    <div className="flex items-start gap-2 font-bold text-violet-300">
                      <Lock className="w-4 h-4 text-violet-300 shrink-0 mt-0.5" />
                      <span>🔐 Full Code &amp; Asset Ownership (No Lock-In)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-400">
                  <strong className="text-white">You focus on your business. We handle the technology.</strong>
                </p>
                <Link
                  href="/checkout?plan=managed_4999_usd"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs text-center shadow-xl shadow-amber-500/25 hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  Get 1-Year Managed Partner ($4,999) <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Footer Motto */}
        <div className="mt-16 text-center text-xs text-slate-400">
          <p className="font-semibold text-slate-300 text-sm mb-1">You run the business. We take care of the technology.</p>
          <p>All plans include full asset ownership and enterprise-grade code handover.</p>
        </div>
      </div>
    </section>
  )
}
