import { NextResponse } from 'next/server'
import { RevenueOpportunityCalculator } from '@auditai/ai'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      monthlyTraffic,
      conversionRatePercent,
      averageOrderValueCents,
      currentLcpSeconds,
      targetLcpSeconds,
    } = body

    if (!monthlyTraffic || !conversionRatePercent || !averageOrderValueCents || !currentLcpSeconds) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'monthlyTraffic, conversionRatePercent, averageOrderValueCents, and currentLcpSeconds are required.',
          },
        },
        { status: 400 }
      )
    }

    const result = RevenueOpportunityCalculator.calculate({
      monthlyTraffic,
      conversionRatePercent,
      averageOrderValueCents,
      currentLcpSeconds,
      targetLcpSeconds,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to calculate revenue opportunity.'
    return NextResponse.json(
      { success: false, error: { code: 'CALCULATION_FAILED', message } },
      { status: 500 }
    )
  }
}
