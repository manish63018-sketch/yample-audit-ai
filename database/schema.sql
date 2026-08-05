-- AuditAI core schema (Postgres)
-- Requires pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Organizations
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  billing_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Teams (optional)
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL
);

-- Websites
CREATE TABLE IF NOT EXISTS websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Audits
CREATE TABLE IF NOT EXISTS audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID REFERENCES websites(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  score INT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  finished_at TIMESTAMP WITH TIME ZONE
);

-- Reports (generic)
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID,
  user_id UUID,
  action TEXT,
  meta JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Subscriptions & Payments (simplified)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  plan TEXT,
  status TEXT,
  starts_at TIMESTAMP WITH TIME ZONE,
  ends_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  amount_cents INT,
  currency TEXT,
  status TEXT,
  due_date DATE,
  pdf_url TEXT
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_websites_org ON websites(organization_id);
CREATE INDEX IF NOT EXISTS idx_audits_org ON audits(organization_id);
CREATE INDEX IF NOT EXISTS idx_reports_audit ON reports(audit_id);

-- RLS: Leave policy definitions to `docs/03-Auth-RBAC.md` and runtime migration scripts

-- Additional tables for Volume 3

-- Team members / membership
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE
);

-- Pagespeed Reports
CREATE TABLE IF NOT EXISTS pagespeed_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
  payload JSONB,
  lcp NUMERIC,
  cls NUMERIC,
  inp NUMERIC,
  ttfb NUMERIC,
  fcp NUMERIC,
  speed_index NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Lighthouse Reports
CREATE TABLE IF NOT EXISTS lighthouse_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
  payload JSONB,
  opportunities JSONB,
  diagnostics JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Accessibility Reports
CREATE TABLE IF NOT EXISTS accessibility_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
  issues JSONB,
  warnings JSONB,
  passed_count INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- SEO Reports
CREATE TABLE IF NOT EXISTS seo_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
  meta JSONB,
  schema JSONB,
  robots JSONB,
  sitemap JSONB,
  headings JSONB,
  links JSONB,
  images JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI Reports (summaries & proposals)
CREATE TABLE IF NOT EXISTS ai_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
  summary TEXT,
  recommendations JSONB,
  revenue_analysis JSONB,
  business_analysis JSONB,
  proposal JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Competitors
CREATE TABLE IF NOT EXISTS competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
  name TEXT,
  website TEXT,
  score INT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CRM Leads
CREATE TABLE IF NOT EXISTS crm_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  business_name TEXT,
  website TEXT,
  email TEXT,
  phone TEXT,
  country TEXT,
  city TEXT,
  industry TEXT,
  status TEXT,
  priority TEXT,
  notes TEXT,
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Proposals
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES crm_leads(id) ON DELETE SET NULL,
  price_cents INT,
  currency TEXT,
  features JSONB,
  timeline TEXT,
  status TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE SET NULL,
  amount_cents INT,
  currency TEXT,
  status TEXT,
  payment_provider TEXT,
  invoice_pdf_url TEXT,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  meta JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activity Logs (detailed)
CREATE TABLE IF NOT EXISTS activity_logs_detailed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),
  action TEXT,
  metadata JSONB,
  ip TEXT,
  device TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for new tables
CREATE INDEX IF NOT EXISTS idx_pagespeed_audit ON pagespeed_reports(audit_id);
CREATE INDEX IF NOT EXISTS idx_lighthouse_audit ON lighthouse_reports(audit_id);
CREATE INDEX IF NOT EXISTS idx_ai_reports_audit ON ai_reports(audit_id);
CREATE INDEX IF NOT EXISTS idx_crm_org ON crm_leads(organization_id);

