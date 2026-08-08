import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@auditai/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')
    const sessionId = searchParams.get('sessionId') || request.headers.get('x-session-id')

    if (!customerId && !sessionId) {
      return NextResponse.json({ success: true, hasSpun: false, reward: null })
    }

    const adminClient = createAdminSupabaseClient()
    let query = (adminClient.from as any)('rewards').select('*')

    if (customerId) {
      query = query.eq('customer_id', customerId)
    } else if (sessionId) {
      query = query.eq('session_id', sessionId)
    }

    const { data: rewards } = await query

    if (!rewards || rewards.length === 0) {
      return NextResponse.json({ success: true, hasSpun: false, reward: null })
    }

    const activeReward = rewards[0]
    const isExpired = new Date() > new Date(activeReward.expiry_timestamp)

    if (isExpired && activeReward.status === 'Available') {
      // Auto-update status to Expired
      try {
        await (adminClient.from as any)('rewards')
          .update({ status: 'Expired' })
          .eq('id', activeReward.id)
      } catch {}
      activeReward.status = 'Expired'
    }

    return NextResponse.json({
      success: true,
      hasSpun: true,
      reward: activeReward,
      isExpired,
    })
  } catch (err: unknown) {
    return NextResponse.json({ success: true, hasSpun: false, reward: null })
  }
}
