-- 0003_add_crm_leads_audit_id.sql

ALTER TABLE IF EXISTS crm_leads
ADD COLUMN IF NOT EXISTS audit_id UUID REFERENCES audits(id) ON DELETE SET NULL;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_crm_leads_website ON crm_leads(website);
CREATE INDEX IF NOT EXISTS idx_crm_leads_org ON crm_leads(organization_id);
