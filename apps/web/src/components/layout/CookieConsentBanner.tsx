'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, Shield, Check, X, Settings } from 'lucide-react';

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: true,
    analytics: false,
  });

  useEffect(() => {
    try {
      const savedConsent = localStorage.getItem('auditai_cookie_consent');
      if (!savedConsent) {
        // Small delay to prevent layout flicker on page load
        const timer = setTimeout(() => setShowBanner(true), 600);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const saveConsent = (type: 'all' | 'necessary' | 'custom') => {
    try {
      const consentData = {
        type,
        preferences: type === 'all' ? { necessary: true, functional: true, analytics: true } : preferences,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('auditai_cookie_consent', JSON.stringify(consentData));
      document.cookie = `auditai_consent=true; path=/; max-age=31536000; SameSite=Lax`;
    } catch {}
    setShowBanner(false);
    setShowModal(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Floating Cookie Consent Bar */}
      <div
        id="cookie-consent-banner"
        role="dialog"
        aria-labelledby="cookie-banner-title"
        aria-describedby="cookie-banner-desc"
        className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-xl z-50 transition-all duration-500 ease-out"
      >
        <div className="rounded-2xl border border-white/15 bg-[#0F172A]/95 p-5 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Subtle Top Ambient Accent */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500" />

          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0 text-violet-400 mt-0.5">
              <Cookie className="w-5 h-5" />
            </div>

            <div className="space-y-3 flex-1">
              <div>
                <h3 id="cookie-banner-title" className="text-sm font-bold text-white mb-1">
                  Cookie &amp; Privacy Preferences
                </h3>
                <p id="cookie-banner-desc" className="text-xs text-slate-300 leading-relaxed">
                  We use cookies and similar technologies to improve your experience. Some of these cookies are needed for our site to function properly, while others help us tailor the site to you.{' '}
                  <button
                    onClick={() => setShowModal(true)}
                    className="text-violet-400 hover:text-violet-300 font-semibold underline underline-offset-2 transition-colors inline-flex items-center gap-1"
                  >
                    Consent Management Tool
                  </button>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                <button
                  onClick={() => saveConsent('all')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold text-center shadow-lg shadow-violet-500/20 transition-all min-h-[40px]"
                >
                  Accept
                </button>
                <button
                  onClick={() => saveConsent('necessary')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold text-center border border-white/10 transition-all min-h-[40px]"
                >
                  Accept Only Necessary Cookies
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consent Management Preferences Modal */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-modal-title"
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#0F172A] p-6 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-violet-400" />
                <h3 id="consent-modal-title" className="text-base font-bold text-white">
                  Consent Management Tool
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-slate-300">
                Manage your cookie preferences below. You can update these settings at any time in accordance with our{' '}
                <Link href="/cookies" target="_blank" className="text-violet-400 hover:underline">
                  Cookie Policy
                </Link>.
              </p>

              {/* 1. Necessary */}
              <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" /> Essential &amp; Necessary Cookies
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    Always Active
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Required for core site functions, user login sessions, security validation, and payment processing.
                </p>
              </div>

              {/* 2. Functional & Personalization */}
              <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Functional &amp; Tailored Experience</span>
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={(e) => setPreferences((p) => ({ ...p, functional: e.target.checked }))}
                    className="h-4 w-4 rounded border-white/20 bg-slate-900 text-violet-600 focus:ring-violet-500"
                  />
                </div>
                <p className="text-slate-400 text-[11px]">
                  Helps us remember your currency, country preferences, spin reward status, and custom workflow choices.
                </p>
              </div>

              {/* 3. Analytics */}
              <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Analytics &amp; Performance</span>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences((p) => ({ ...p, analytics: e.target.checked }))}
                    className="h-4 w-4 rounded border-white/20 bg-slate-900 text-violet-600 focus:ring-violet-500"
                  />
                </div>
                <p className="text-slate-400 text-[11px]">
                  Allows anonymous metrics monitoring to optimize page load speeds and audit report processing times.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
              <button
                onClick={() => saveConsent('necessary')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold"
              >
                Reject Non-Essential
              </button>
              <button
                onClick={() => saveConsent('custom')}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
