
import leadRepo from '../repositories/leadRepository'
import { processAudit } from './pipelineManager'
import { createAdminSupabaseClient } from '@auditai/db'

const supabaseAdmin = createAdminSupabaseClient()

export async function ingestLeadFromUrl(url: string, source: string = 'manual', organization_id: string | null = null) {
  // Create lead record
  const lead = await leadRepo.createLead({ source, website: url, status: 'new', organization_id, created_at: new Date().toISOString() })

  // Ensure website record exists or create minimal entry
  let websiteRecord: any = null
  try {
    const { data } = await supabaseAdmin.from('websites').select('*').eq('url', url).limit(1).single()
    websiteRecord = data
  } catch (e) {
    // not found
  }

  if (!websiteRecord) {
    const { data: wdata, error: werr } = await supabaseAdmin.from('websites').insert([{ url, name: null, organization_id }]).select().single()
    if (werr) console.warn('Failed to create website record', werr.message)
    websiteRecord = wdata
  }

  // Create audit linked to website
  const audit = await auditRepo.createAudit({ website_id: websiteRecord?.id, organization_id: organization_id || websiteRecord?.organization_id || null, url })

  // Attach audit id to lead
  try { await leadRepo.attachAuditToLead(lead.id, audit.id) } catch (e) { console.warn('Failed attach audit to lead', e.message) }

  // Trigger audit pipeline asynchronously
  processAudit(audit.id, url).catch((e) => console.error('Audit failed for lead', lead.id, e))

  return { lead, audit }
}

export async function scoreLead(lead: any) {
  // Basic scoring heuristic - to be improved
  let score = 0
  if (lead.website_quality) score += Math.min(20, lead.website_quality)
  if (lead.seo_score) score += Math.min(10, lead.seo_score)
  if (lead.performance_score) score += Math.min(15, lead.performance_score)
  return { score }
}

export default { ingestLeadFromUrl, scoreLead }
