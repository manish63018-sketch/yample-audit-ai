-- 0004_rls_policies.sql — Multi-tenant Row-Level Security (RLS) policies for AuditAI
-- Enforces strict tenant isolation based on organization_id matching JWT claim or membership

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagespeed_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE lighthouse_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE accessibility_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs_detailed ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Users policies
-- ============================================================
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (id = auth.uid());

-- ============================================================
-- Organizations policies
-- ============================================================
CREATE POLICY "orgs_select_member" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "orgs_update_admin" ON organizations
  FOR UPDATE USING (
    id IN (
      SELECT organization_id FROM team_members WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- Team Members policies
-- ============================================================
CREATE POLICY "team_members_select" ON team_members
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- Websites policies
-- ============================================================
CREATE POLICY "websites_select_org" ON websites
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "websites_insert_org" ON websites
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "websites_delete_org" ON websites
  FOR DELETE USING (
    organization_id IN (
      SELECT organization_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- Audits policies
-- ============================================================
CREATE POLICY "audits_select_org" ON audits
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM team_members WHERE user_id = auth.uid()
    )
    OR organization_id IS NULL -- Allow public free tier audits
  );

CREATE POLICY "audits_insert_all" ON audits
  FOR INSERT WITH CHECK (true); -- Allow anonymous audit queue triggers

-- ============================================================
-- CRM Leads policies
-- ============================================================
CREATE POLICY "crm_leads_all_org" ON crm_leads
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- Proposals policies
-- ============================================================
CREATE POLICY "proposals_all_org" ON proposals
  FOR ALL USING (
    lead_id IN (
      SELECT id FROM crm_leads WHERE organization_id IN (
        SELECT organization_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================================
-- Notifications policies
-- ============================================================
CREATE POLICY "notifications_own" ON notifications
  FOR ALL USING (user_id = auth.uid());
