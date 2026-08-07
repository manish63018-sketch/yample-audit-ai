/**
 * AuditAI — Shared Frontend Types
 * These types are the client-side representations of the API response shapes.
 * Full Zod schemas live in docs/api-spec-expanded.md and will be in packages/shared.
 */

// ============================================================
// Core enums
// ============================================================

export type AuditStatus = 'queued' | 'running' | 'completed' | 'failed'

export type PlanType = 'free' | 'pro' | 'agency'

export type UserRole = 'admin' | 'developer' | 'billing' | 'client'

export type LeadStatus =
  | 'new'
  | 'qualified'
  | 'audit_generated'
  | 'contacted'
  | 'replied'
  | 'meeting_scheduled'
  | 'proposal_sent'
  | 'negotiation'
  | 'won'
  | 'lost'

export type Priority = 'low' | 'medium' | 'high' | 'critical'

export type AIProvider = 'claude' | 'openai' | 'gemini' | 'ollama'

export type ReportTone = 'concise' | 'detailed'

// ============================================================
// User & Organization
// ============================================================

export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  plan: PlanType
  billing_customer_id: string | null
  created_at: string
}

export interface TeamMember {
  id: string
  user_id: string
  organization_id: string
  role: UserRole
  user: Pick<User, 'id' | 'email' | 'full_name' | 'avatar_url'>
  invited_at: string
  accepted_at: string | null
}

// ============================================================
// Website & Audits
// ============================================================

export interface Website {
  id: string
  organization_id: string
  url: string
  name: string | null
  created_at: string
}

export interface AuditSummary {
  id: string
  website_id: string | null
  organization_id: string | null
  url: string
  status: AuditStatus
  score: number | null
  created_at: string
  finished_at: string | null
}

export interface AuditRunOptions {
  pagespeed?: boolean
  lighthouse?: boolean
  accessibility?: boolean
  seo?: boolean
  security?: boolean
  ai?: boolean
}

// ============================================================
// Report types
// ============================================================

export interface PagespeedMetrics {
  lcp: number | null
  cls: number | null
  inp: number | null
  ttfb: number | null
  fcp: number | null
  speed_index: number | null
  performance_score: number | null
}

export interface AccessibilityIssue {
  id: string
  impact: 'critical' | 'serious' | 'moderate' | 'minor'
  description: string
  nodes: string[]
  help_url: string
}

export interface SEOData {
  title: string | null
  meta_description: string | null
  h1_count: number
  canonical: string | null
  robots: string | null
  sitemap_found: boolean
  score: number | null
}

export interface SecurityData {
  https: boolean
  ssl_valid: boolean
  hsts: boolean
  csp: boolean
  x_frame_options: boolean
  score: number | null
}

export interface AIRecommendation {
  id: string
  category: string
  problem: string
  business_impact: string
  recommendation: string
  priority: Priority
  estimated_effort: 'low' | 'medium' | 'high'
  estimated_benefit: 'low' | 'medium' | 'high'
  confidence: 'low' | 'medium' | 'high'
}

export interface AIReport {
  summary: string | null
  executive_summary: string | null
  recommendations: AIRecommendation[]
  revenue_analysis: {
    opportunity: string
    confidence: 'low' | 'medium' | 'high'
    reasoning: string
  } | null
  business_analysis: {
    industry: string | null
    detected_cms: string | null
    strengths: string[]
    weaknesses: string[]
  } | null
  created_at: string
}

export interface FullAuditReport {
  audit: AuditSummary
  reports: {
    pagespeed: (PagespeedMetrics & { raw_payload?: unknown }) | null
    lighthouse: { opportunities: unknown; diagnostics: unknown; score: number | null } | null
    accessibility: { issues: AccessibilityIssue[]; passed_count: number } | null
    seo: SEOData | null
    security: SecurityData | null
    ai: AIReport | null
  }
  scores: {
    overall: number | null
    performance: number | null
    accessibility: number | null
    seo: number | null
    security: number | null
    ux: number | null
    business: number | null
    mobile: number | null
  }
}

// ============================================================
// CRM & Leads
// ============================================================

export interface Lead {
  id: string
  organization_id: string
  business_name: string | null
  website: string | null
  email: string | null
  phone: string | null
  country: string | null
  city: string | null
  industry: string | null
  status: LeadStatus
  priority: Priority | null
  score: number | null
  notes: string | null
  assigned_to: string | null
  audit_id: string | null
  created_at: string
}

export interface Proposal {
  id: string
  lead_id: string
  title: string | null
  price_cents: number
  currency: string
  features: string[]
  timeline: string | null
  status: 'draft' | 'sent' | 'accepted' | 'rejected'
  pdf_url: string | null
  created_at: string
}

// ============================================================
// Enterprise SaaS Entities
// ============================================================

export interface DigitalContract {
  id: string
  contract_id: string
  order_id: string
  signed_by_user_id: string | null
  client_name: string
  signature_text: string
  signature_hash: string
  msa_version: string
  ip_address: string | null
  user_agent: string | null
  signed_at: string
  created_at: string
}

export interface ProjectRevision {
  id: string
  revision_id: string
  order_id: string
  requested_by: string | null
  title: string
  details: string
  round_number: number
  status: 'submitted' | 'under_review' | 'in_progress' | 'completed' | 'declined'
  admin_notes: string | null
  completed_at: string | null
  created_at: string
}

export interface ProjectFile {
  id: string
  order_id: string
  uploaded_by: string | null
  file_name: string
  storage_path: string
  file_size_bytes: number | null
  mime_type: string | null
  is_client_visible: boolean
  created_at: string
}

export interface OrderConsent {
  id: string
  order_id: string | null
  user_id: string | null
  ip_address: string | null
  user_agent: string | null
  policy_version: string
  consent_terms: boolean
  consent_privacy: boolean
  consented_at: string
}

export interface LoginHistory {
  id: string
  user_id: string
  ip_address: string | null
  user_agent: string | null
  country: string | null
  city: string | null
  login_status: 'success' | 'failed'
  logged_in_at: string
}

export interface ActivityLog {
  id: string
  actor_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  metadata: Record<string, unknown>
  ip_address: string | null
  created_at: string
}

// ============================================================
// API response shapes
// ============================================================

export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// ============================================================
// Navigation & UI state
// ============================================================

export interface NavItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string | number
  children?: NavItem[]
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface ToastMessage {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  description?: string
  duration?: number
}
