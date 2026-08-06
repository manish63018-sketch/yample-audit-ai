import { createAdminSupabaseClient } from '@auditai/db'

const supabaseAdmin = createAdminSupabaseClient()
import auditRepo from './auditRepository'

export async function findLeadByWebsite(website: string) {
  const { data } = await supabaseAdmin.from('crm_leads').select('*').eq('website', website).limit(1)
  return data?.[0] || null
}

export async function createLead(payload: any) {
  // Upsert by website or email to avoid duplicates
  const website = payload.website || payload.url || null
  if (website) {
    const existing = await findLeadByWebsite(website)
    if (existing) {
      const { data, error } = await supabaseAdmin.from('crm_leads').update(payload).eq('id', existing.id).select().single()
      if (error) throw error
      return data
    }
  }

  const { data, error } = await supabaseAdmin.from('crm_leads').insert([payload]).select().single()
  if (error) throw error
  return data
}

export async function getLeadById(id: string) {
  const { data, error } = await supabaseAdmin.from('crm_leads').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function attachAuditToLead(leadId: string, auditId: string) {
  const { data, error } = await supabaseAdmin.from('crm_leads').update({ audit_id: auditId }).eq('id', leadId).select().single()
  if (error) throw error
  return data
}

export default { createLead, getLeadById, findLeadByWebsite, attachAuditToLead }
