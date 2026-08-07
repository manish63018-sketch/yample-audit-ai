import { NextRequest, NextResponse } from 'next/server'

/**
 * Server-Side PDF & Printable Document Generation Engine
 * GET /api/pdf/generate?type=invoice|quote|audit&id=...
 *
 * Generates a self-contained, beautifully styled HTML document with full print headers,
 * footers, CSS page breaks, Yample Labs branding, watermark, and direct print trigger.
 */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'quote'
  const id = searchParams.get('id') || 'Q-2026-9401'
  const name = searchParams.get('name') || 'Valued Client'
  const amount = searchParams.get('amount') || '$837.00'
  const date = searchParams.get('date') || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const website = searchParams.get('website') || 'https://clientwebsite.com'
  const services = searchParams.get('services')?.split(',') || [
    'Custom Website Redesign (Next.js 15 & React 19)',
    '24/7 AI Voice & Chat Support Agent Integration',
    'Core Web Vitals Performance Engineering (Score 90+)',
    'On-Page Technical SEO & Schema Markup',
  ]

  const titleMap: Record<string, string> = {
    quote: `Official Quotation #${id}`,
    invoice: `Tax Invoice #${id}`,
    audit: `AI Audit Report — ${website}`,
  }

  const documentTitle = titleMap[type] || `Document #${id}`

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${documentTitle} — Yample Labs</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    
    @page {
      size: A4;
      margin: 15mm;
    }
    
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      margin: 0;
      padding: 32px;
      color: #0f172a;
      background: #ffffff;
      font-size: 13px;
      line-height: 1.6;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 40px;
      position: relative;
      background: #ffffff;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
    }

    .watermark {
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-size: 80px;
      font-weight: 900;
      color: rgba(124, 58, 237, 0.03);
      letter-spacing: 4px;
      pointer-events: none;
      white-space: nowrap;
      text-transform: uppercase;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #7c3aed;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }

    .logo-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }

    .logo-icon {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      border-radius: 8px;
      color: #ffffff;
      font-weight: 900;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .brand-name {
      font-size: 22px;
      font-weight: 900;
      color: #0f172a;
    }

    .brand-highlight {
      color: #7c3aed;
    }

    .company-sub {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
    }

    .doc-meta {
      text-align: right;
    }

    .doc-type-badge {
      display: inline-block;
      padding: 6px 14px;
      background: rgba(124, 58, 237, 0.1);
      color: #7c3aed;
      font-weight: 800;
      font-size: 12px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .doc-id {
      font-family: monospace;
      font-size: 14px;
      font-weight: 700;
      color: #334155;
    }

    .doc-date {
      font-size: 11px;
      color: #64748b;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 32px;
    }

    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 16px 20px;
    }

    .card-title {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748b;
      margin-bottom: 8px;
    }

    .card-body {
      font-size: 13px;
      font-weight: 600;
      color: #1e293b;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 32px;
    }

    .table th {
      background: #f1f5f9;
      color: #475569;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #cbd5e1;
    }

    .table td {
      padding: 14px 16px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
    }

    .table tr:last-child td {
      border-bottom: none;
    }

    .total-card {
      background: linear-gradient(135deg, #0f172a, #1e1b4b);
      color: #ffffff;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .total-label {
      font-size: 13px;
      color: #94a3b8;
      font-weight: 600;
    }

    .total-amount {
      font-size: 28px;
      font-weight: 900;
      color: #38bdf8;
      font-family: monospace;
    }

    .terms-box {
      border-left: 3px solid #7c3aed;
      background: #f8fafc;
      padding: 16px;
      border-radius: 0 8px 8px 0;
      margin-bottom: 32px;
    }

    .terms-title {
      font-size: 11px;
      font-weight: 800;
      color: #7c3aed;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .terms-text {
      font-size: 11px;
      color: #64748b;
      line-height: 1.5;
    }

    .footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #94a3b8;
    }

    .no-print-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .print-btn {
      background: #7c3aed;
      color: #ffffff;
      border: none;
      padding: 8px 20px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .print-btn:hover {
      background: #6d28d9;
    }

    @media print {
      .no-print-bar {
        display: none !important;
      }
      body {
        padding: 0;
      }
      .container {
        border: none;
        box-shadow: none;
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <!-- Print Control Header -->
  <div class="no-print-bar">
    <div style="font-weight: 600; font-size: 13px;">
      AuditAI Document Engine — ${documentTitle}
    </div>
    <button class="print-btn" onclick="window.print()">
      Print / Save as PDF
    </button>
  </div>

  <div style="height: 50px;" class="no-print-bar-spacer"></div>

  <div class="container">
    <div class="watermark">Yample Labs</div>

    <!-- Header -->
    <div class="header">
      <div class="logo-badge">
        <div class="logo-icon">A</div>
        <div>
          <div class="brand-name">Audit<span class="brand-highlight">AI</span></div>
          <div class="company-sub">by Yample Labs Technology Studio</div>
        </div>
      </div>
      <div class="doc-meta">
        <div class="doc-type-badge">${type.toUpperCase()}</div>
        <div class="doc-id">Ref: ${id}</div>
        <div class="doc-date">Issued Date: ${date}</div>
      </div>
    </div>

    <!-- Client & Provider Meta -->
    <div class="grid-2">
      <div class="card">
        <div class="card-title">Billed To / Client Details</div>
        <div class="card-body">${name}</div>
        <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Target Website: ${website}</div>
      </div>
      <div class="card">
        <div class="card-title">Service Provider</div>
        <div class="card-body">Yample Labs</div>
        <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Support: yamplelabs@gmail.com</div>
        <div style="font-size: 11px; color: #64748b;">WhatsApp: +91 63056 30468</div>
      </div>
    </div>

    <!-- Line Items -->
    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Service Description</th>
          <th>Delivery Window</th>
          <th style="text-align: right;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${services
          .map(
            (item: string, idx: number) => `
          <tr>
            <td style="font-weight: 700; color: #7c3aed;">0${idx + 1}</td>
            <td style="font-weight: 600;">${item.trim()}</td>
            <td style="color: #64748b;">7 Business Days</td>
            <td style="text-align: right;"><span style="background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 10px;">INCLUDED</span></td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>

    <!-- Total -->
    <div class="total-card">
      <div>
        <div class="total-label">Total Investment</div>
        <div style="font-size: 11px; color: #94a3b8;">Includes 30-day post-launch support SLA</div>
      </div>
      <div class="total-amount">${amount}</div>
    </div>

    <!-- Terms -->
    <div class="terms-box">
      <div class="terms-title">Terms & Compliance</div>
      <div class="terms-text">
        This computer-generated ${type} is legally valid and issued under Yample Labs Master Service Agreement (MSA).
        Quotation validity is locked upon confirmation. All deliverables include a complimentary 30-day post-launch maintenance window.
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div>© ${new Date().getFullYear()} Yample Labs. All rights reserved.</div>
      <div>AuditAI Platform · https://auditai.yamplelabs.com</div>
    </div>
  </div>

  <script>
    // Auto-trigger print prompt on load if requested
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('autoprint') === 'true') {
      window.onload = function() {
        setTimeout(() => window.print(), 500);
      }
    }
  </script>
</body>
</html>`

  return new NextResponse(htmlContent, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}
