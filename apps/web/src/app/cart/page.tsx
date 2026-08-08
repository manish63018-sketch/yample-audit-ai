'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useGeo } from '@/context/GeoContext';
import { useState } from 'react';
import { LaunchRewardWheel } from '@/components/journey/LaunchRewardWheel';
import { CurrencyToggle } from '@/components/CurrencyToggle';
import {
  ShoppingBag,
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  Tag,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    discount,
    discountLabel,
    setDiscount,
    setDiscountLabel,
    summary,
    toastMessage,
    clearToast,
  } = useCart();

  const { activeCurrency } = useGeo();
  const [showWheel, setShowWheel] = useState(false);
  const [expandedDetailsId, setExpandedDetailsId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-center text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg">
          <span>✓ {toastMessage}</span>
          <button
            onClick={clearToast}
            className="text-white/60 hover:text-white ml-2 text-sm font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-slate-400 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4 text-violet-400" />
          <span>Continue Shopping</span>
        </Link>
        <h1 className="text-base font-extrabold text-white flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-violet-400" />
          <span>Your Business Cart</span>
        </h1>
        <div className="flex items-center gap-3">
          <CurrencyToggle />
          <Link
            href="/#services"
            className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors hidden sm:inline"
          >
            + Add Services
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="md:col-span-2 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-20 rounded-3xl border border-white/10 bg-white/5 p-8">
              <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Your Cart is Currently Empty</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
                Add an AI Audit package or select custom website growth services to calculate your
                quote and kickoff timeline.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/audit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-violet-500/25 hover:opacity-90 transition-all flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" /> Start Free AI Audit
                </Link>
                <Link
                  href="/#services"
                  className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-xs font-semibold hover:bg-white/10 transition-all"
                >
                  Browse Services
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Selected Services ({items.length})
                </span>
                <button
                  onClick={clearCart}
                  className="text-xs text-red-400/70 hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear Cart
                </button>
              </div>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4 transition-all hover:border-violet-500/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                          {item.category || 'Service'}
                        </span>
                        {item.timeline && (
                          <span className="text-[10px] text-slate-400">Est. {item.timeline}</span>
                        )}
                      </div>
                      <h3 className="font-bold text-white text-base">{item.name}</h3>
                      {item.description && (
                        <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-lg font-black text-violet-300 font-mono">
                        {summary.currencySymbol}
                        {(
                          item.price *
                          (item.quantity || 1) *
                          (activeCurrency.code === 'INR' ? 84 : 1)
                        ).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {summary.currencySymbol}
                        {(
                          item.price * (activeCurrency.code === 'INR' ? 84 : 1)
                        ).toLocaleString()}{' '}
                        each
                      </div>
                    </div>
                  </div>

                  {/* Benefit Pills */}
                  {item.benefits && item.benefits.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                      {item.benefits.map((b: string) => (
                        <div
                          key={b}
                          className="flex items-center gap-1.5 text-xs text-slate-300 bg-white/5 rounded-lg px-2.5 py-1.5 border border-white/5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{b}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quantity Controls & Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">Quantity:</span>
                      <div className="flex items-center border border-white/10 rounded-lg bg-white/5">
                        <button
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-all rounded-l-lg"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-mono font-bold text-white">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-all rounded-r-lg"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          setExpandedDetailsId(expandedDetailsId === item.id ? null : item.id)
                        }
                        className="text-xs text-violet-400 hover:text-violet-300 underline transition-colors"
                      >
                        {expandedDetailsId === item.id ? 'Hide Details' : 'View Scope'}
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-red-400 transition-colors p-1"
                        aria-label="Remove service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details Drawer */}
                  {expandedDetailsId === item.id && (
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-violet-500/20 text-xs text-slate-300 space-y-1 animate-fadeIn">
                      <div className="font-bold text-violet-300">Deliverables Included:</div>
                      <div>• Dedicated Senior Engineer Assignment</div>
                      <div>• Full Code Inspection &amp; Performance Hardening</div>
                      <div>• 30-Day Post-Launch Technical Support</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary & Pricing Sidebar */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
            <h2 className="font-extrabold text-white text-base flex items-center justify-between">
              <span>Investment Breakdown</span>
              <span className="text-xs font-normal text-slate-400">
                Currency: {activeCurrency.code}
              </span>
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>
                  Subtotal ({summary.totalQuantity} item{summary.totalQuantity !== 1 ? 's' : ''})
                </span>
                <span className="font-mono font-medium">{summary.subtotalFormatted}</span>
              </div>

              {summary.bundleDiscountPct > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Bundle Discount ({summary.bundleDiscountPct}%)
                  </span>
                  <span className="font-mono">-{summary.bundleDiscountFormatted}</span>
                </div>
              )}

              {discount > 0 && (
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

            {/* Spin Wheel Promo Button */}
            {!discount && items.length > 0 && (
              <button
                onClick={() => setShowWheel(true)}
                className="w-full py-2.5 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 text-xs font-bold hover:bg-yellow-500/20 transition-all flex items-center justify-center gap-1.5 animate-pulse"
              >
                <span>🎰 Spin for Launch Discount!</span>
              </button>
            )}

            {/* Action Buttons */}
            {items.length > 0 ? (
              <Link
                href="/checkout"
                className="block w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-center text-xs shadow-xl shadow-violet-500/25 hover:opacity-90 transition-opacity"
              >
                Proceed to Checkout ({summary.finalTotalFormatted}) →
              </Link>
            ) : (
              <button
                disabled
                className="w-full py-3.5 rounded-xl bg-white/5 text-slate-500 font-bold text-center text-xs border border-white/5 cursor-not-allowed"
              >
                Add Items to Continue
              </button>
            )}

            <div className="pt-2 text-center">
              <Link
                href="/#services"
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                ← Browse all services &amp; add options
              </Link>
            </div>
          </div>

          {/* Guarantee & Workflow Box */}
          {items.length > 0 && (
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4 space-y-3">
              <div className="font-bold text-violet-300 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> What Happens Next
              </div>
              <div className="space-y-2">
                {[
                  'Proceed to Checkout & Enter Details',
                  'Generate Customer ID, Quote & Order Ref',
                  'Receive WhatsApp & Email Confirmation',
                  'Kickoff Senior Engineering Sprint',
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showWheel && (
        <LaunchRewardWheel
          onClose={() => setShowWheel(false)}
          onReward={(amount, label) => {
            setDiscount(amount);
            setDiscountLabel(label);
            setShowWheel(false);
          }}
          cartTotal={summary.subtotalUSD}
        />
      )}
    </div>
  );
}
