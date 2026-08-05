import { NextResponse } from 'next/server'
import { ProposalGenerator } from '@auditai/ai'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { clientName, clientWebsite, auditScore, targetBudgetCents } = body

    if (!clientName || !clientWebsite) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'clientName and clientWebsite are required.' } },
        { status: 400 }
      )
    }

    const proposal = ProposalGenerator.generate(
      {
        clientName,
        clientWebsite,
        targetBudgetCents,
      },
      auditScore || 70
    )

    return NextResponse.json({
      success: true,
      data: proposal,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate proposal.'
    return NextResponse.json(
      { success: false, error: { code: 'PROPOSAL_FAILED', message } },
      { status: 500 }
    )
  }
}
