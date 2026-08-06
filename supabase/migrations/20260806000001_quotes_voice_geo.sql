-- AuditAI Schema Extension: Quotes, Orders, Voice, Geo
-- Migration: 20260806000001_quotes_voice_geo.sql

-- =========================================
-- QUOTES TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id TEXT UNIQUE NOT NULL DEFAULT ('QT-' || to_char(NOW(), 'YYYYMM') || '-' || LPAD(FLOOR(RANDOM() * 9999 + 1)::TEXT, 4, '0')),

  -- Customer
  customer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  customer_email TEXT,

  -- Project Details
  project_name TEXT,
  business_name TEXT,
  industry TEXT,
  timeline TEXT,
  existing_website TEXT,
  additional_notes TEXT,
  required_features JSONB DEFAULT '[]',

  -- Budget
  budget_amount NUMERIC,
  budget_currency TEXT DEFAULT 'USD',

  -- Voice
  voice_original_text TEXT,
  voice_detected_language TEXT,
  voice_translated_text TEXT,
  voice_audio_url TEXT,

  -- AI Analysis
  ai_summary JSONB DEFAULT '[]',
  ai_estimated_cost_usd NUMERIC,
  ai_budget_fit TEXT,
  ai_recommendation TEXT,

  -- Geo
  customer_country TEXT,
  customer_country_code TEXT,
  customer_currency TEXT,

  -- Offer
  offer_applied BOOLEAN DEFAULT FALSE,
  offer_discount_amount NUMERIC DEFAULT 0,
  offer_discount_currency TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'draft',
  -- draft | submitted | reviewed | quoted | accepted | rejected

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quotes_updated_at
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =========================================
-- ORDERS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT UNIQUE NOT NULL DEFAULT ('ORD-' || to_char(NOW(), 'YYYYMM') || '-' || LPAD(FLOOR(RANDOM() * 9999 + 1)::TEXT, 4, '0')),

  -- Relations
  quote_id UUID REFERENCES public.quotes(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  customer_email TEXT,

  -- Services
  services JSONB DEFAULT '[]',

  -- Pricing
  subtotal_amount NUMERIC,
  discount_amount NUMERIC DEFAULT 0,
  transfer_fee_amount NUMERIC DEFAULT 0,
  total_amount NUMERIC,
  currency TEXT DEFAULT 'USD',

  -- Status
  status TEXT NOT NULL DEFAULT 'pending',
  -- pending | payment_initiated | paid | in_progress | review | delivered | cancelled

  -- Payment
  payment_provider TEXT,
  transaction_id TEXT,
  payment_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =========================================
-- INDEXES
-- =========================================
CREATE INDEX IF NOT EXISTS idx_quotes_customer_id ON public.quotes(customer_id);
CREATE INDEX IF NOT EXISTS idx_quotes_customer_email ON public.quotes(customer_email);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON public.quotes(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_quote_id ON public.orders(quote_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_transaction_id ON public.orders(transaction_id);

-- =========================================
-- RLS (Row Level Security)
-- =========================================
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Admins can read all
CREATE POLICY "Admin full access to quotes"
  ON public.quotes FOR ALL
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin full access to orders"
  ON public.orders FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Customers can read their own
CREATE POLICY "Customers read own quotes"
  ON public.quotes FOR SELECT
  USING (customer_id = auth.uid() OR customer_email = auth.jwt()->>'email');

CREATE POLICY "Customers read own orders"
  ON public.orders FOR SELECT
  USING (customer_id = auth.uid() OR customer_email = auth.jwt()->>'email');
