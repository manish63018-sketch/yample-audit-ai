import { NextResponse } from 'next/server'
import { AuditRepository, createAdminSupabaseClient } from '@auditai/db'

// Maps DB status → progress percentage + display label
const STATUS_PROGRESS: Record<string, { progress: number; label: string; step: number }> = {
  queued:      { progress: 5,  label: 'Validating Website',          step: 0 },
  running:     { progress: 20, label: 'Checking Availability',        step: 1 },
  crawling:    { progress: 35, label: 'Crawling Website Structure',   step: 2 },
  performance: { progress: 50, label: 'Running Performance Analysis', step: 3 },
  seo:         { progress: 62, label: 'Running SEO Analysis',         step: 4 },
  accessibility:{ progress: 72, label: 'Running Accessibility Checks', step: 5 },
  security:    { progress: 80, label: 'Running Security Checks',      step: 6 },
  analyzing:   { progress: 88, label: 'AI Business Analysis',         step: 7 },
  generating:  { progress: 94, label: 'Generating Report',            step: 8 },
  completed:   { progress: 100, label: 'Preparing Dashboard',         step: 9 },
  failed:      { progress: 0,  label: 'Audit failed',                 step: -1 },
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_ID', message: 'Audit ID is required.' } },
        { status: 400 }
      )
    }

    const adminClient = createAdminSupabaseClient()
    const auditRepo = new AuditRepository(adminClient)
    const audit = await auditRepo.findById(id)

    if (!audit) {
      // Audit not in DB yet (local dev / race condition) — return queued
      return NextResponse.json({
        success: true,
        data: {
          status: 'queued',
          progress: 5,
          label: 'Starting audit...',
          step: 0,
          score: null,
        },
      })
    }

    const statusInfo = STATUS_PROGRESS[audit.status] ?? STATUS_PROGRESS['queued']

    return NextResponse.json({
      success: true,
      data: {
        status: audit.status,
        progress: statusInfo.progress,
        label: statusInfo.label,
        step: statusInfo.step,
        score: audit.score,
        finishedAt: audit.finished_at,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch audit status.'
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message } },
      { status: 500 }
    )
  }
}
