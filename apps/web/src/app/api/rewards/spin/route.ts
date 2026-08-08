import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@auditai/db'

function generateRewardId() {
  const rand = String(Math.floor(Math.random() * 90000000) + 10000000)
  return `YPL-RWD-${rand}`
}

const REWARD_OPTIONS = [
  {
    type: 'free_service',
    name: 'Free Professional Logo Design',
    originalValueUSD: 199,
    discountAmountUSD: 199,
    finalValueUSD: 0,
    emoji: '🎨',
    category: 'Branding & Design',
    description: 'Custom vector logo design suite with brand guideline palette.',
  },
  {
    type: 'free_service',
    name: 'Free SEO Schema Hardening',
    originalValueUSD: 149,
    discountAmountUSD: 149,
    finalValueUSD: 0,
    emoji: '🔍',
    category: 'SEO Suite',
    description: 'JSON-LD rich snippet schema implementation for Google Search.',
  },
  {
    type: 'percentage_discount',
    name: '15% OFF Launch Special',
    originalValueUSD: 189,
    discountAmountUSD: 189,
    finalValueUSD: 0,
    emoji: '🚀',
    category: 'Promotional Discount',
    description: '15% instant reduction applied to your entire growth bundle.',
  },
  {
    type: 'percentage_discount',
    name: '10% OFF Growth Overhaul',
    originalValueUSD: 125,
    discountAmountUSD: 125,
    finalValueUSD: 0,
    emoji: '🔥',
    category: 'Promotional Discount',
    description: '10% instant reduction applied to your entire growth package.',
  },
]

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { sessionId, customerId, userEmail } = body

    const effectiveSessionId = sessionId || request.headers.get('x-session-id') || 'guest-session'
    const adminClient = createAdminSupabaseClient()

    // 1. Database check: Has this customer/session already spun?
    try {
      let query = (adminClient.from as any)('rewards').select('id, reward_name, status, expiry_timestamp')

      if (customerId) {
        query = query.eq('customer_id', customerId)
      } else if (effectiveSessionId && effectiveSessionId !== 'guest-session') {
        query = query.eq('session_id', effectiveSessionId)
      }

      const { data: existingSpins } = await query

      if (existingSpins && existingSpins.length > 0) {
        return NextResponse.json({
          success: false,
          code: 'ALREADY_SPUN',
          message: 'You have already used your promotional spin.',
          existingReward: existingSpins[0],
        }, { status: 400 })
      }
    } catch {
      // Continue cleanly if table is freshly created
    }

    // 2. Select random reward from authoritative pool
    const selectedPoolIndex = Math.floor(Math.random() * REWARD_OPTIONS.length)
    const prizeConfig = REWARD_OPTIONS[selectedPoolIndex]

    const rewardId = generateRewardId()
    const now = new Date()
    const expiryDate = new Date(now.getTime() + 15 * 60 * 1000) // 15 Minutes expiry

    const rewardRecord = {
      id: rewardId,
      customer_id: customerId || null,
      session_id: effectiveSessionId,
      reward_type: prizeConfig.type,
      reward_name: prizeConfig.name,
      discount_amount: prizeConfig.discountAmountUSD,
      original_value: prizeConfig.originalValueUSD,
      final_value: prizeConfig.finalValueUSD,
      spin_timestamp: now.toISOString(),
      expiry_timestamp: expiryDate.toISOString(),
      status: 'Available' as const,
      created_at: now.toISOString(),
    }

    // 3. Persist in Supabase DB
    try {
      await (adminClient.from as any)('rewards').insert(rewardRecord)
    } catch (e) {
      console.warn('[Reward Spin API] Supabase insert warning:', e)
    }

    return NextResponse.json({
      success: true,
      data: {
        ...rewardRecord,
        emoji: prizeConfig.emoji,
        category: prizeConfig.category,
        description: prizeConfig.description,
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Spin generation error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
