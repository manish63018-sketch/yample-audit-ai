-- AuditAI Enterprise SaaS Database Architecture Extension
-- Migration: 20260808000003_enterprise_saas_schema.sql

-- ===================================================
-- 1. HELPER RPC FUNCTIONS
-- ===================================================

-- Fast indexed admin check helper function for RLS policies
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND user_role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===================================================
-- 2. SCHEMA RELATIONSHIP EXTENSIONS
-- ===================================================

-- Extend invoices table to link directly to orders
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

-- Extend quotes table to link directly to crm_leads
ALTER TABLE public.quotes
  ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES public.crm_leads(id) ON DELETE SET NULL;

-- Extend orders table to link to B2B organization tenants
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;

-- ===================================================
-- 3. NEW ENTERPRISE TABLES
-- ===================================================

-- 3.1 DIGITAL CONTRACTS TABLE (Master Service Agreement & E-Signature)
CREATE TABLE IF NOT EXISTS public.digital_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id TEXT UNIQUE NOT NULL DEFAULT (
    'CTR-' || to_char(NOW(), 'YYYYMM') || '-' || LPAD(FLOOR(RANDOM() * 9999 + 1)::TEXT, 4, '0')
  ),

  -- Relations
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  signed_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,

  -- Signature Details
  client_name TEXT NOT NULL,
  signature_text TEXT NOT NULL,
  signature_hash TEXT NOT NULL,
  msa_version TEXT NOT NULL DEFAULT 'v1.0-2026',
  ip_address TEXT,
  user_agent TEXT,

  -- Timestamps
  signed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER digital_contracts_updated_at
  BEFORE UPDATE ON public.digital_contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 3.2 PROJECT REVISIONS TABLE (Structured Client Scope Feedback)
CREATE TABLE IF NOT EXISTS public.project_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  revision_id TEXT UNIQUE NOT NULL DEFAULT (
    'REV-' || to_char(NOW(), 'YYYYMM') || '-' || LPAD(FLOOR(RANDOM() * 9999 + 1)::TEXT, 4, '0')
  ),

  -- Relations
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  requested_by UUID REFERENCES public.users(id) ON DELETE SET NULL,

  -- Revision Brief
  title TEXT NOT NULL,
  details TEXT NOT NULL,
  round_number INTEGER NOT NULL DEFAULT 1,

  -- Status
  status TEXT NOT NULL DEFAULT 'submitted',
  -- 'submitted' | 'under_review' | 'in_progress' | 'completed' | 'declined'
  admin_notes TEXT,

  -- Timestamps
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER project_revisions_updated_at
  BEFORE UPDATE ON public.project_revisions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 3.3 PROJECT FILES TABLE (Deliverables & Shared Assets)
CREATE TABLE IF NOT EXISTS public.project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relations
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,

  -- File Details
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_size_bytes BIGINT,
  mime_type TEXT,
  is_client_visible BOOLEAN NOT NULL DEFAULT TRUE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.4 ORDER CONSENTS TABLE (Checkout Policy Compliance Log)
CREATE TABLE IF NOT EXISTS public.order_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relations
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,

  -- Audit Log Details
  ip_address TEXT,
  user_agent TEXT,
  policy_version TEXT NOT NULL DEFAULT '2026-v1',
  consent_terms BOOLEAN NOT NULL DEFAULT TRUE,
  consent_privacy BOOLEAN NOT NULL DEFAULT TRUE,

  consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.5 LOGIN HISTORY TABLE (Security Audit Trail)
CREATE TABLE IF NOT EXISTS public.login_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  login_status TEXT NOT NULL DEFAULT 'success',
  logged_in_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.6 ACTIVITY LOGS TABLE (Admin & System Audit Trail)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===================================================
-- 4. PERFORMANCE INDEXES
-- ===================================================
CREATE INDEX IF NOT EXISTS idx_invoices_order_id ON public.invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_quotes_lead_id ON public.quotes(lead_id);
CREATE INDEX IF NOT EXISTS idx_orders_organization_id ON public.orders(organization_id);

CREATE INDEX IF NOT EXISTS idx_digital_contracts_order_id ON public.digital_contracts(order_id);
CREATE INDEX IF NOT EXISTS idx_digital_contracts_signed_by ON public.digital_contracts(signed_by_user_id);

CREATE INDEX IF NOT EXISTS idx_project_revisions_order_id ON public.project_revisions(order_id);
CREATE INDEX IF NOT EXISTS idx_project_revisions_status ON public.project_revisions(status);

CREATE INDEX IF NOT EXISTS idx_project_files_order_id ON public.project_files(order_id);
CREATE INDEX IF NOT EXISTS idx_order_consents_order_id ON public.order_consents(order_id);
CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON public.login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_actor ON public.activity_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- ===================================================
-- 5. ROW LEVEL SECURITY (RLS) & POLICIES
-- ===================================================
ALTER TABLE public.digital_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Digital Contracts Policies
CREATE POLICY "Clients read own digital contracts"
  ON public.digital_contracts FOR SELECT
  USING (
    signed_by_user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = digital_contracts.order_id AND (o.customer_id = auth.uid() OR o.customer_email = auth.jwt()->>'email')
    )
  );

CREATE POLICY "Admins manage digital contracts"
  ON public.digital_contracts FOR ALL
  USING (public.is_admin());

-- Project Revisions Policies
CREATE POLICY "Clients manage own revisions"
  ON public.project_revisions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = project_revisions.order_id AND (o.customer_id = auth.uid() OR o.customer_email = auth.jwt()->>'email')
    )
  );

CREATE POLICY "Admins manage project revisions"
  ON public.project_revisions FOR ALL
  USING (public.is_admin());

-- Project Files Policies
CREATE POLICY "Clients read visible project files"
  ON public.project_files FOR SELECT
  USING (
    is_client_visible = TRUE AND
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = project_files.order_id AND (o.customer_id = auth.uid() OR o.customer_email = auth.jwt()->>'email')
    )
  );

CREATE POLICY "Admins manage project files"
  ON public.project_files FOR ALL
  USING (public.is_admin());

-- Login History Policies
CREATE POLICY "Users read own login history"
  ON public.login_history FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins read all login history"
  ON public.login_history FOR SELECT
  USING (public.is_admin());

-- Activity Logs Policies
CREATE POLICY "Admins manage activity logs"
  ON public.activity_logs FOR ALL
  USING (public.is_admin());

-- ===================================================
-- 6. SUPABASE STORAGE BUCKET DEFINITIONS
-- ===================================================
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('project-files', 'project-files', false),
  ('voice-audios', 'voice-audios', false),
  ('pdf-documents', 'pdf-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Authenticated users upload voice audios"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'voice-audios' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins full access storage"
  ON storage.objects FOR ALL
  USING (public.is_admin());
