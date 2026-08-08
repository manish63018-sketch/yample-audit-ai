'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useGeo } from '@/context/GeoContext';
import { calculateOrderSummary } from '@/lib/pricing';
import { CurrencyToggle } from '@/components/CurrencyToggle';
import { InternationalOfferBanner } from '@/components/InternationalOfferBanner';
import { ShieldCheck, ArrowRight, Lock, ShoppingBag, Mic, MicOff, AlertCircle } from 'lucide-react';

/* ── Razorpay global type declaration ───────────────────────────── */
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
}
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
interface RazorpayInstance {
  open(): void;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const COUNTRIES = [
  'United States',
  'India',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'United Arab Emirates',
  'Singapore',
  'Other',
];

const TIMELINES = [
  '7-10 Business Days (Standard)',
  '3-5 Business Days (Express)',
  '14-21 Business Days (Custom SaaS)',
  'Flexible',
];

export default function CheckoutPage() {
  const { items: cartItems, discount: cartDiscount, discountLabel, clearCart } = useCart();
  const { activeCurrency, geo } = useGeo();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: geo.country || 'United States',
    address: '',
    business: '',
    websiteUrl: '',
    requirements: '',
    timeline: TIMELINES[0],
    budget: '',
    voiceNotes: '',
    referenceLinks: '',
  });

  const [isRecording, setIsRecording] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [payingStripe, setPayingStripe] = useState(false);
  const [payingRazorpay, setPayingRazorpay] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);
  const [error, setError] = useState('');

  // 1. Hydrate form and quote context from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedForm = localStorage.getItem('auditai_checkout_form');
      if (savedForm) {
        try {
          const parsed = JSON.parse(savedForm);
          setForm((prev) => ({ ...prev, ...parsed }));
        } catch {}
      }
    }
  }, []);

  // 2. Persist form drafts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('auditai_checkout_form', JSON.stringify(form));
    } catch {}
  }, [form]);

  // Set country when geo resolves
  useEffect(() => {
    if (geo.country && !form.country) {
      setForm((f) => ({ ...f, country: geo.country }));
    }
  }, [geo.country, form.country]);

  // Items to use: cart items or active fallback package
  const activeItems =
    cartItems.length > 0
      ? cartItems
      : [
          {
            id: 'website-upgrade',
            name: 'Website Upgrade & Core Web Vitals Overhaul',
            price: 599,
            quantity: 1,
            timeline: '7 Days',
            benefits: [
              'Core Web Vitals Optimization',
              'SEO Hardening',
              '30-Day Technical Warranty',
            ],
            category: 'Website Services',
          },
        ];

  const isIndia =
    form.country === 'India' || form.country === 'IN' || activeCurrency.code === 'INR';
  const summary = calculateOrderSummary(activeItems, activeCurrency.code, cartDiscount, isIndia);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // Voice-to-Text simulation / Web Speech API integration
  const toggleVoiceRecording = () => {
    if (typeof window === 'undefined') return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Voice-to-text is not supported by your browser. Please type your requirements.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsRecording(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setForm((f) => ({
            ...f,
            voiceNotes: (f.voiceNotes ? f.voiceNotes + ' ' : '') + transcript,
          }));
        }
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  /* ── Official Proposal Submission ───────────────────────────────────── */
  const handleProposalSubmission = async () => {
    if (!form.name || !form.email || !form.phone) {
      setError('Please fill in your Full Name, Email Address, and Phone Number.');
      return;
    }
    if (!consentTerms) {
      setError('Please accept the Terms of Service & Privacy Policy to proceed.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/checkout/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          country: form.country,
          address: form.address,
          business: form.business,
          websiteUrl: form.websiteUrl,
          requirements: form.requirements,
          timeline: form.timeline,
          budget: form.budget || summary.finalTotalFormatted,
          voiceNotes: form.voiceNotes,
          referenceLinks: form.referenceLinks,
          items: activeItems,
          discount: summary.promoDiscountUSD,
          currency: activeCurrency.code,
          paymentMethod: 'proposal',
          paymentStatus: 'Unpaid',
          orderStatus: 'Quote Requested',
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        clearCart();
        localStorage.removeItem('auditai_checkout_form');
        sessionStorage.setItem(`verified_order_${data.data.orderId}`, JSON.stringify(data.data));
        router.push(
          `/thankyou?quoteId=${data.data.quoteId}&orderId=${data.data.orderId}&whatsappSent=${
            data.data.whatsappSentViaApi ? '1' : '0'
          }`
        );
      } else {
        setError(data.error || 'Failed to submit proposal. Please verify fields and try again.');
      }
    } catch {
      setError('Connection error. Please try submitting again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Razorpay Online Payment Handler ─────────────────────────────── */
  const handleRazorpayCheckout = async () => {
    if (!form.name || !form.email || !form.phone) {
      setError('Please fill in Name, Email, and Phone for online payment.');
      return;
    }
    if (!consentTerms) {
      setError('Please accept the Terms of Service & Privacy Policy.');
      return;
    }

    setPayingRazorpay(true);
    setError('');

    try {
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        setError('Failed to load Razorpay checkout SDK. Please retry.');
        setPayingRazorpay(false);
        return;
      }

      const orderRes = await fetch('/api/checkout/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: activeItems,
          customerEmail: form.email,
          discount: summary.promoDiscountUSD,
          currency: 'INR',
        }),
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        setError(orderData.error || 'Failed to create payment order.');
        setPayingRazorpay(false);
        return;
      }

      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: 'INR',
        name: 'Yample Labs',
        description: activeItems.map((i) => i.name).join(', '),
        order_id: orderData.orderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#6366f1' },
        handler: async (response: RazorpayResponse) => {
          try {
            const verifyRes = await fetch('/api/checkout/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                customerName: form.name,
                customerEmail: form.email,
                items: activeItems,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              clearCart();
              localStorage.removeItem('auditai_checkout_form');
              router.push(`/thankyou?payment=razorpay&id=${response.razorpay_payment_id}`);
            } else {
              setError(verifyData.error || 'Payment verification failed.');
            }
          } catch {
            setError('Payment succeeded but verification failed.');
          }
          setPayingRazorpay(false);
        },
        modal: { ondismiss: () => setPayingRazorpay(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setError('Razorpay checkout error. Please try again.');
      setPayingRazorpay(false);
    }
  };

  /* ── Stripe Online Payment Handler ───────────────────────────────── */
  const handleStripeCheckout = async () => {
    if (!form.name || !form.email) {
      setError('Please fill in your Name and Email for online checkout.');
      return;
    }
    if (!consentTerms) {
      setError('Please accept the Terms of Service & Privacy Policy.');
      return;
    }

    setPayingStripe(true);
    setError('');

    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: activeItems,
          customerEmail: form.email,
          discount: summary.promoDiscountUSD,
          discountLabel: discountLabel || 'Bundle Savings',
          currency: activeCurrency.code,
        }),
      });
      const data = await res.json();
      if (data.success && data.url) {
        clearCart();
        localStorage.removeItem('auditai_checkout_form');
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to initialize Stripe checkout.');
      }
    } catch {
      setError('Stripe connection error. Please try again.');
    } finally {
      setPayingStripe(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      {/* Top Header */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link
          href="/cart"
          className="text-slate-400 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5"
        >
          ← Edit Cart
        </Link>
        <h1 className="text-base font-extrabold text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Checkout &amp; Order Requirements</span>
        </h1>
        <div className="flex items-center gap-3">
          <CurrencyToggle />
          <span className="text-[11px] text-violet-400 font-semibold bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">
            Step 2 of 2
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <InternationalOfferBanner />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Itemized Order Summary */}
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-violet-400" /> Order Summary
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Review your selected services and investment details.
              </p>
            </div>

            {/* Individual Line Items */}
            <div className="space-y-3">
              {activeItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-white text-sm">{item.name}</div>
                      {item.quantity && item.quantity > 1 && (
                        <span className="text-xs text-violet-300 font-semibold">
                          Qty: {item.quantity}
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-black text-violet-300 font-mono">
                      {summary.currencySymbol}
                      {(
                        item.price *
                        (item.quantity || 1) *
                        (activeCurrency.code === 'INR' ? 84 : 1)
                      ).toLocaleString()}
                    </div>
                  </div>
                  {item.benefits && item.benefits.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.benefits.map((b: string) => (
                        <span
                          key={b}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10"
                        >
                          ✓ {b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Transparent Cost Breakdown */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>
                  Subtotal ({summary.totalQuantity} service{summary.totalQuantity !== 1 ? 's' : ''})
                </span>
                <span className="font-mono font-medium">{summary.subtotalFormatted}</span>
              </div>

              {summary.bundleDiscountPct > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>🎁 Bundle Savings ({summary.bundleDiscountPct}%)</span>
                  <span className="font-mono">-{summary.bundleDiscountFormatted}</span>
                </div>
              )}

              {summary.promoDiscountUSD > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>🎁 {discountLabel || 'Promo Discount'}</span>
                  <span className="font-mono">-{summary.promoDiscountFormatted}</span>
                </div>
              )}

              {summary.processingFeeUSD > 0 && (
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>International Processing Fee</span>
                  <span className="font-mono">+{summary.processingFeeFormatted}</span>
                </div>
              )}

              <div className="flex justify-between font-black text-white text-base pt-3 border-t border-white/10">
                <span>Final Investment</span>
                <span className="text-emerald-400 font-mono text-lg">
                  {summary.finalTotalFormatted}
                </span>
              </div>
            </div>

            {/* Guarantees */}
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4 text-xs text-slate-300 space-y-2">
              <div className="font-bold text-violet-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Yample Labs Enterprise
                Guarantee:
              </div>
              <div>✓ 30-Day Post-Launch Technical Warranty Included</div>
              <div>✓ Senior Software Engineer Assigned</div>
              <div>✓ Est. Timeline: {form.timeline}</div>
            </div>
          </div>

          {/* Right: Client Details & Submission Actions */}
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-black text-white">
                Client Information &amp; Requirements
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Required to generate formal Customer, Quote, and Order IDs.
              </p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
              {/* Name & Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Full Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-xs placeholder-white/20 focus:outline-none focus:border-violet-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Email Address *</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-xs placeholder-white/20 focus:outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>

              {/* Phone & Country */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Mobile / WhatsApp *</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-xs placeholder-white/20 focus:outline-none focus:border-violet-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Country *</label>
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0F172A] text-white text-xs focus:outline-none focus:border-violet-500/50"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Business Name & Website URL */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Business / Company Name
                  </label>
                  <input
                    name="business"
                    value={form.business}
                    onChange={handleChange}
                    placeholder="Acme Corp"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-xs placeholder-white/20 focus:outline-none focus:border-violet-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Website URL</label>
                  <input
                    name="websiteUrl"
                    value={form.websiteUrl}
                    onChange={handleChange}
                    placeholder="https://company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-xs placeholder-white/20 focus:outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">Address / Location</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Street, City, State, ZIP"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-xs placeholder-white/20 focus:outline-none focus:border-violet-500/50"
                />
              </div>

              {/* Project Requirements & Timeline */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-slate-400">Project Requirements &amp; Scope</label>
                  <button
                    type="button"
                    onClick={toggleVoiceRecording}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all ${
                      isRecording
                        ? 'bg-red-500/20 border-red-500/40 text-red-300 animate-pulse'
                        : 'bg-white/5 border-white/10 text-violet-300 hover:bg-white/10'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                    <span>{isRecording ? 'Listening...' : 'Voice-to-Text'}</span>
                  </button>
                </div>
                <textarea
                  name="requirements"
                  value={form.requirements}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Describe your design preferences, key goals, target audience, or specific feature requests..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-xs placeholder-white/20 focus:outline-none focus:border-violet-500/50 resize-none"
                />
                {form.voiceNotes && (
                  <div className="mt-1 text-[11px] text-violet-300 bg-violet-500/10 border border-violet-500/20 p-2 rounded-lg">
                    🎙️ Voice Note Transcript: {form.voiceNotes}
                  </div>
                )}
              </div>

              {/* Reference Links & Timeline */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Preferred Timeline</label>
                  <select
                    name="timeline"
                    value={form.timeline}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0F172A] text-white text-xs focus:outline-none focus:border-violet-500/50"
                  >
                    {TIMELINES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Reference Links / Files
                  </label>
                  <input
                    name="referenceLinks"
                    value={form.referenceLinks}
                    onChange={handleChange}
                    placeholder="https://figma.com/... or Google Drive link"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-xs placeholder-white/20 focus:outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>

              {/* Terms Consent Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentTerms}
                    onChange={(e) => setConsentTerms(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 bg-white/5 text-violet-500"
                  />
                  <span>
                    I accept the{' '}
                    <Link href="/terms" className="text-violet-400 underline">
                      Terms of Service
                    </Link>
                    ,{' '}
                    <Link href="/privacy" className="text-violet-400 underline">
                      Privacy Policy
                    </Link>
                    , and{' '}
                    <Link href="/service-agreement" className="text-violet-400 underline">
                      Service Agreement
                    </Link>
                    .
                  </span>
                </label>
              </div>

              {error && (
                <div className="flex items-center gap-1.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submission Action Buttons */}
              <div className="pt-2 space-y-2.5">
                {/* Submit Official Proposal */}
                <button
                  type="button"
                  onClick={handleProposalSubmission}
                  disabled={submitting || payingStripe || payingRazorpay}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-extrabold text-xs shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating Customer &amp; Order IDs...
                    </>
                  ) : (
                    <>
                      <span>Submit Proposal &amp; Issue Order ({summary.finalTotalFormatted})</span>{' '}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Instant Online Payment Option */}
                {isIndia ? (
                  <button
                    type="button"
                    onClick={handleRazorpayCheckout}
                    disabled={submitting || payingStripe || payingRazorpay}
                    className="w-full py-2.5 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-300 font-bold text-xs hover:bg-blue-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    {payingRazorpay
                      ? 'Opening Razorpay...'
                      : `Pay Online via Razorpay (${summary.finalTotalFormatted})`}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStripeCheckout}
                    disabled={submitting || payingStripe || payingRazorpay}
                    className="w-full py-2.5 rounded-xl bg-violet-600/20 border border-violet-500/40 text-violet-300 font-bold text-xs hover:bg-violet-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    {payingStripe
                      ? 'Opening Stripe...'
                      : `Pay Card Online via Stripe (${summary.finalTotalFormatted})`}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
