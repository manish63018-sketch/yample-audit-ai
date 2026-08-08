import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customerName,
      customerEmail,
      items,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing payment verification parameters.' },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment verification is not configured. Please contact support.',
        },
        { status: 503 }
      );
    }

    // --- HMAC-SHA256 Signature Verification ---
    // Razorpay signature = HMAC_SHA256(orderId + "|" + paymentId, keySecret)
    const body_str = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto.createHmac('sha256', keySecret).update(body_str).digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('Razorpay signature mismatch', {
        expected: expectedSignature,
        received: razorpay_signature,
      });
      return NextResponse.json(
        { success: false, error: 'Payment verification failed. Signature mismatch.' },
        { status: 400 }
      );
    }

    // ✅ Payment is genuine — optionally save order to DB here
    try {
      // Save lead/order record
      await fetch(`${req.nextUrl.origin}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customerName || 'Razorpay Customer',
          email: customerEmail || '',
          services: Array.isArray(items)
            ? items.map((i: { name: string }) => i.name).join(', ')
            : '',
          source: 'razorpay_checkout',
          payment_id: razorpay_payment_id,
          order_id: razorpay_order_id,
        }),
      });
    } catch {
      // Non-fatal — don't block the success response
    }

    return NextResponse.json({
      success: true,
      verified: true,
      paymentId: razorpay_payment_id,
      redirectUrl: `/thankyou?payment=razorpay&id=${razorpay_payment_id}`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Payment verification failed';
    console.error('Razorpay verify error:', err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
