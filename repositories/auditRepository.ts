import supabaseAdmin from '../lib/supabaseServer'

export const createAudit = async (audit: { website_id: string; organization_id: string; user_id?: string; url: string }) => {
  const { data, error } = await supabaseAdmin.from('audits').insert([{
    website_id: audit.website_id,
    organization_id: audit.organization_id,
    user_id: audit.user_id || null,
    url: audit.url,
    status: 'queued',
    created_at: new Date().toISOString()
  }]).select().single()

  if (error) throw error
  return data
}

export const getAuditById = async (id: string) => {
  const { data, error } = await supabaseAdmin.from('audits').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export const updateAuditStatus = async (id: string, status: string, updates: any = {}) => {
  const payload = { status, ...updates }
  const { data, error } = await supabaseAdmin.from('audits').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data
}

export const insertPagespeedReport = async (audit_id: string, payload: any, metrics: any) => {
  const { data, error } = await supabaseAdmin.from('pagespeed_reports').insert([{ audit_id, payload, ...metrics }]).select().single()
  if (error) throw error
  return data
}

export const insertAIReport = async (audit_id: string, aiPayload: any) => {
  const { data, error } = await supabaseAdmin.from('ai_reports').insert([{ audit_id, ...aiPayload }]).select().single()
  if (error) throw error
  return data
}

export const insertReport = async (table: string, audit_id: string, payload: any) => {
  // Generic insert into a named table; ensure table whitelist in production
  const { data, error } = await supabaseAdmin.from(table).insert([{ audit_id, payload }]).select().single()
  if (error) throw error
  return data
}

export default { createAudit, getAuditById, updateAuditStatus, insertPagespeedReport, insertAIReport }
