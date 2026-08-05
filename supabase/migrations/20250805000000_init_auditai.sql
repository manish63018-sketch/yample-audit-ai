-- AuditAI by Yample Labs — Infrastructure Database Migration
-- PostgreSQL, RLS, Storage Buckets, and Auth Setup

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations Table
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(CASCADE),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    website TEXT,
    email TEXT,
    phone TEXT,
    country TEXT,
    city TEXT,
    industry TEXT,
    status TEXT DEFAULT 'new',
    priority TEXT DEFAULT 'medium',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Audits Table
CREATE TABLE IF NOT EXISTS public.audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    url TEXT NOT NULL,
    status TEXT DEFAULT 'completed',
    score_performance INT DEFAULT 0,
    score_seo INT DEFAULT 0,
    score_accessibility INT DEFAULT 0,
    score_security INT DEFAULT 0,
    score_business INT DEFAULT 0,
    raw_results JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_id UUID REFERENCES public.audits(id) ON DELETE CASCADE,
    pdf_url TEXT,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Base RLS Policies (Allow service role and authenticated users)
CREATE POLICY "Allow service role full access organizations" ON public.organizations FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access profiles" ON public.profiles FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access leads" ON public.leads FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access audits" ON public.audits FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access reports" ON public.reports FOR ALL USING (auth.role() = 'service_role');

-- Public lead submission policy for web audit forms
CREATE POLICY "Allow anonymous lead submission" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous audit creation" ON public.audits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous audit read" ON public.audits FOR SELECT USING (true);

-- Storage bucket for PDF reports
INSERT INTO storage.buckets (id, name, public)
VALUES ('audit-reports', 'audit-reports', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Access for Reports" ON storage.objects
FOR SELECT USING (bucket_id = 'audit-reports');

CREATE POLICY "Service Role Upload Access for Reports" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'audit-reports');
