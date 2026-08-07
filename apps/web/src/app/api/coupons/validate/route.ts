import { NextRequest, NextResponse } from 'next/server'

/**
 * Coupon Code Validation API
 * POST /api/coupons/validate
 */

const VALID_COUPONS: Record<string, { discountPercent: number; fixedUSD: number; description: string }> = {
  YAMPLE10: { discountPercent: 10, fixedUSD: 0, description: '10% Launch Discount' },
  WELCOME50: { discountPercent: 0, fixedUSD: 50, description: '$50 Off Welcome Offer' },
  PROMO20: { discountPercent: 20, fixedUSD: 0, description: '20% Special Promotion' },
}

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ success: false, error: 'Coupon code is required' }, { status: 400 })
    }

    const cleanCode = code.trim().toUpperCase()
    const coupon = VALID_COUPONS[cleanCode]

    if (!coupon) {
      return NextResponse.json({ success: false, error: 'Invalid or expired coupon code' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      code: cleanCode,
      discountPercent: coupon.discountPercent,
      fixedUSD: coupon.fixedUSD,
      description: coupon.description,
    })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
