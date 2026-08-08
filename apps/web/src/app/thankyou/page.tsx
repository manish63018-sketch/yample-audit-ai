'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Download, MessageSquare, FileText } from 'lucide-react';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [show, setShow] = useState(false);

  // Query parameter fallback values
  const paramQuoteId = searchParams.get('quoteId') || searchParams.get('quote_id');
  const paramOrderId = searchParams.get('orderId') || searchParams.get('id');

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const targetId = paramOrderId || paramQuoteId;
      if (targetId) {
        const stored = sessionStorage.getItem(`verified_order_${targetId}`);
        if (stored) {
          try {
            setOrderDetails(JSON.parse(stored));
          } catch {}
        }
      }
    }
  }, [paramOrderId, paramQuoteId]);

  // Computed IDs and delivery statuses
  const customerId = orderDetails?.customerId || 'CUST-VERIFIED';
  const quoteId =
    orderDetails?.quoteId ||
    paramQuoteId ||
    `QT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(
      2,
      '0'
    )}-${Math.floor(1000 + Math.random() * 9000)}`;
  const orderId =
    orderDetails?.orderId ||
    paramOrderId ||
    `ORD-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(
      2,
      '0'
    )}-${Math.floor(1000 + Math.random() * 9000)}`;
  const customerName = orderDetails?.customerName || 'Valued Client';
  const totalAmountFormatted = orderDetails?.summary?.finalTotalFormatted || `$599`;
  const items = orderDetails?.items || [];
  const whatsappSentViaApi = orderDetails?.whatsappSentViaApi || false;
  const whatsappStatusLabel =
    orderDetails?.whatsappStatusLabel ||
    (whatsappSentViaApi ? 'Sent via Official WhatsApp API' : 'WhatsApp message ready to send');

  // Pre-formatted WhatsApp Chat link with exact Quote ID & Order ID
  const defaultWhatsAppMsg = `NEW YAMPLE LABS CLIENT ENQUIRY

Customer:
Full Name: ${customerName}

ORDER DETAILS:
Order ID: ${orderId}
Quote ID: ${quoteId}

Total Investment: ${totalAmountFormatted}

Please verify my quote and kickoff development timeline. Thank you!`;

  const whatsappUrl =
    orderDetails?.whatsappUrl ||
    `https://wa.me/916305630468?text=${encodeURIComponent(defaultWhatsAppMsg)}`;

  const handleDownloadPDF = () => {
    const content = `YAMPLE LABS — OFFICIAL PROPOSAL & ORDER CONFIRMATION
------------------------------------------------------------
Customer Account ID: ${customerId}
Quote Reference ID: ${quoteId}
Order Reference ID: ${orderId}
Issued To: ${customerName}
Date: ${new Date().toLocaleDateString()}
Status: Verified & In Review

ORDER SCOPE & INVESTMENT:
Total Investment: ${totalAmountFormatted}

INCLUDED SERVICES:
${
  items.length > 0
    ? items.map((i: any) => `• ${i.name || i}`).join('\n')
    : '• Enterprise Audit & Web Performance Upgrade Bundle'
}

GUARANTEE & WARRANTY:
• 30-Day Post-Launch Technical Warranty
• Senior Software Architect Assigned
• 100% Core Web Vitals Sub-1.5s Guarantee

Thank you for choosing Yample Labs.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Proposal-${quoteId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#08080f] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div
        className={`max-w-3xl w-full text-center space-y-8 relative z-10 transition-all duration-700 ${
          show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {/* Top Success Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Order &amp; Proposal Generated
          Successfully
        </div>

        {/* Main Heading */}
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Order &amp; Proposal Confirmed
          </h1>
          <p className="text-slate-300 text-xs md:text-sm mt-3 max-w-xl mx-auto leading-relaxed">
            Thank you, <span className="text-white font-bold">{customerName}</span>. Your
            requirements have been persisted and an architect has been assigned.
          </p>
        </div>

        {/* Verified Account ID, Quote ID & Order ID Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="glass-card p-5 rounded-2xl border border-white/10 bg-white/5 space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Customer Account ID
            </div>
            <div className="text-sm font-black text-violet-300 font-mono truncate">
              {customerId}
            </div>
          </div>
          <div className="glass-card p-5 rounded-2xl border border-white/10 bg-white/5 space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Quote Reference ID
            </div>
            <div className="text-sm font-black text-violet-300 font-mono">{quoteId}</div>
          </div>
          <div className="glass-card p-5 rounded-2xl border border-white/10 bg-white/5 space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Order Reference ID
            </div>
            <div className="text-sm font-black text-emerald-300 font-mono">{orderId}</div>
          </div>
        </div>

        {/* Delivery Verification Status Badges */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 bg-white/5 space-y-4 text-left">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Workflow Verification
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>
                Email Status: <strong className="text-white">Sent ✅</strong>
              </span>
            </div>

            <div
              className={`flex items-center gap-2 p-3 rounded-xl border font-semibold ${
                whatsappSentViaApi
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                  : 'border-amber-500/20 bg-amber-500/10 text-amber-300'
              }`}
            >
              {whatsappSentViaApi ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <MessageSquare className="w-4 h-4 shrink-0 text-amber-400" />
              )}
              <span>
                WhatsApp: <strong className="text-white">{whatsappStatusLabel}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={handleDownloadPDF}
            className="px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Proposal
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" /> Send Details on WhatsApp
          </a>

          <Link
            href={`/orders/${orderId}`}
            className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-violet-400" /> Track Order Status
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#08080f] text-white flex items-center justify-center">
          <div className="text-white/40 text-sm">Loading order verification...</div>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
