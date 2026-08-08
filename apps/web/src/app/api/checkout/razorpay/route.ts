import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

interface CartItem {
  id: string;
  name: string;
  price: number;
  timeline?: string;
  benefits?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items } = body as {
      items: CartItem[];
      customerEmail?: string;
      discount?: number;
      currency?: string;
    };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No cart items provided' },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // --- Calculate total in INR (Razorpay uses smallest unit: paise) ---
    const INR_RATE = 84; // 1 USD = 84 INR (update as needed)
    const subtotalUSD = items.reduce((sum, item) => sum + item.price, 0);
    const totalUSD = subtotalUSD - discount;
    const totalINR = Math.round(totalUSD * INR_RATE);
    const amountInPaise = totalINR * 100; // Razorpay needs paise

    // Generate a unique receipt ID
    const receipt = `rcpt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    // Notes for dashboard visibility
    const notes = {
      items: items.map((i) => i.name).join(', '),
      customer_email: customerEmail || '',
      discount: discount > 0 ? `$${discount} USD discount applied` : 'none',
      source: 'AuditAI Checkout',
    };

    // --- Live mode: call Razorpay Orders API ---
    if (keyId && keySecret && !keyId.includes('XXXXXXXX')) {
      const credentials = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

      const res = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt,
          notes,
        }),
      });

      const order = await res.json();

      if (!res.ok) {
        console.error('Razorpay order creation failed:', order);
        return NextResponse.json(
          { success: false, error: order.error?.description || 'Razorpay order creation failed.' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount: order.amount, // in paise
        amountINR: totalINR, // in ₹ for display
        amountUSD: totalUSD, // in $ for reference
        currency: 'INR',
        keyId,
        receipt,
      });
    }

    // --- Missing Razorpay credentials ---
    return NextResponse.json(
      { success: false, error: 'Payment gateway is not configured. Please contact support.' },
      { status: 503 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Razorpay checkout failed';
    console.error('Razorpay order error:', err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
