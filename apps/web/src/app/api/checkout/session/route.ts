import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No cart items provided' },
        { status: 400 }
      );
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    // If live Stripe secret key is present, execute API request to Stripe REST endpoint
    if (stripeSecretKey) {
      const params = new URLSearchParams();
      params.append('payment_method_types[0]', 'card');
      params.append('mode', 'payment');
      params.append(
        'success_url',
        `${req.nextUrl.origin}/thankyou?session_id={CHECKOUT_SESSION_ID}`
      );
      params.append('cancel_url', `${req.nextUrl.origin}/cart`);

      if (customerEmail) {
        params.append('customer_email', customerEmail);
      }

      items.forEach(
        (
          item: { name: string; price: number; timeline?: string; benefits?: string[] },
          idx: number
        ) => {
          params.append(`line_items[${idx}][price_data][currency]`, 'usd');
          params.append(`line_items[${idx}][price_data][product_data][name]`, item.name);
          params.append(
            `line_items[${idx}][price_data][product_data][description]`,
            `Timeline: ${item.timeline || '7 days'}`
          );
          params.append(
            `line_items[${idx}][price_data][unit_amount]`,
            String(Math.round(item.price * 100))
          );
          params.append(`line_items[${idx}][quantity]`, '1');
        }
      );

      const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const session = await res.json();
      if (res.ok && session.url) {
        return NextResponse.json({ success: true, url: session.url });
      } else {
        return NextResponse.json(
          { success: false, error: session.error?.message || 'Stripe Session creation failed' },
          { status: 400 }
        );
      }
    }

    // No Stripe key configured — return error instead of fake checkout
    return NextResponse.json(
      {
        success: false,
        error: 'Stripe payment gateway is not configured. Please use Razorpay or contact support.',
      },
      { status: 503 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Stripe checkout failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
