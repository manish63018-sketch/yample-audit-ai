-- 0002_volume3_tables.sql — additional tables for Volume 3

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Team members
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

-- AI Reports
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
