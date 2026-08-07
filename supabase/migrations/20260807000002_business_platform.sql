-- AuditAI Business Platform Extension
-- Migration: 20260807000002_business_platform.sql

-- =========================================
-- EXTEND USERS TABLE (Profile Fields)
-- =========================================
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS mobile TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS country_code TEXT,
  ADD COLUMN IF NOT EXISTS website_url TEXT,
  ADD COLUMN IF NOT EXISTS company_name TEXT,
  ADD COLUMN IF NOT EXISTS user_role TEXT NOT NULL DEFAULT 'customer',
  -- 'customer' | 'admin' | 'support'
  ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS consent_privacy BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS consent_terms BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS consent_cookies BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS consent_data_processing BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS consent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Auto-update users updated_at
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =========================================
-- EXTEND ORDERS TABLE (Tracking Stages)
-- =========================================
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS current_stage TEXT NOT NULL DEFAULT 'order_received',
  -- order_received | planning | design | development | testing | review | completed | delivered
  ADD COLUMN IF NOT EXISTS stage_history JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS progress_percent INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS project_name TEXT,
  ADD COLUMN IF NOT EXISTS delivery_notes TEXT;

-- =========================================
-- SUPPORT TICKETS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id TEXT UNIQUE NOT NULL DEFAULT (
    'TKT-' || to_char(NOW(), 'YYYYMM') || '-' ||
    LPAD(FLOOR(RANDOM() * 9999 + 1)::TEXT, 4, '0')
  ),

  -- Customer
  customer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  customer_email TEXT,
  customer_name TEXT,

  -- Ticket Details
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  -- general | billing | technical | project | other

  priority TEXT NOT NULL DEFAULT 'medium',
  -- low | medium | high | urgent

  status TEXT NOT NULL DEFAULT 'open',
  -- open | in_progress | waiting_response | resolved | closed

  -- Order/Project Reference
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,

  -- Messages thread (JSONB array of {sender, message, timestamp})
  messages JSONB DEFAULT '[]',

  -- Assignment
  assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,

  -- Timestamps
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =========================================
-- COUPONS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,

  -- Discount
  discount_type TEXT NOT NULL DEFAULT 'percent',
  -- 'percent' | 'fixed'
  discount_value NUMERIC NOT NULL,
  discount_currency TEXT DEFAULT 'USD',
  -- only used when discount_type = 'fixed'

  -- Validity
  min_order_amount NUMERIC DEFAULT 0,
  max_uses INTEGER,
  uses_count INTEGER NOT NULL DEFAULT 0,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMPTZ,

  -- Status
  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER coupons_updated_at
  BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =========================================
-- EMAIL LOGS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Recipient
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,

  -- Email Details
  template TEXT NOT NULL,
  -- account_created | audit_completed | quote_generated | payment_confirmation
  -- project_started | project_updated | project_completed | invoice
  subject TEXT NOT NULL,

  -- Status
  status TEXT NOT NULL DEFAULT 'pending',
  -- pending | sent | failed | bounced

  -- Reference
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  quote_id UUID REFERENCES public.quotes(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,

  -- Error
  error_message TEXT,

  -- Timestamps
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================
-- COUPON USES TABLE (Track which user used which coupon)
-- =========================================
CREATE TABLE IF NOT EXISTS public.coupon_uses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  discount_applied NUMERIC NOT NULL,
  used_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================
-- INDEXES
-- =========================================
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_id ON public.support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON public.support_tickets(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON public.coupons(is_active);

CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON public.email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON public.email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_template ON public.email_logs(template);

CREATE INDEX IF NOT EXISTS idx_users_user_role ON public.users(user_role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- =========================================
-- RLS (Row Level Security)
-- =========================================
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_uses ENABLE ROW LEVEL SECURITY;

-- Support Tickets: customers can manage their own
CREATE POLICY "Customers manage own tickets"
  ON public.support_tickets FOR ALL
  USING (customer_id = auth.uid() OR customer_email = auth.jwt()->>'email');

-- Admins can manage all tickets
CREATE POLICY "Admins full access tickets"
  ON public.support_tickets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );

-- Coupons: anyone can read active ones, only admins can write
CREATE POLICY "Public read active coupons"
  ON public.coupons FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admins manage coupons"
  ON public.coupons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );

-- Email logs: only admins
CREATE POLICY "Admins read email logs"
  ON public.email_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );

-- =========================================
-- SEED: Default Admin Coupon Examples
-- =========================================
INSERT INTO public.coupons (code, description, discount_type, discount_value, max_uses, valid_until)
VALUES
  ('LAUNCH20', 'Launch Special - 20% off', 'percent', 20, 100, NOW() + INTERVAL '90 days'),
  ('FIRSTORDER', 'First Order Flat ₹500 off', 'fixed', 500, 50, NOW() + INTERVAL '30 days')
ON CONFLICT (code) DO NOTHING;
