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

export type LeadPriority = 'high' | 'medium' | 'low'

export interface RawLeadRow {
  business_name?: string
  businessName?: string
  name?: string
  website?: string
  url?: string
  email?: string
  phone?: string
  country?: string
  city?: string
  industry?: string
  notes?: string
}

export interface NormalizedLead {
  businessName: string
  website: string
  email: string | null
  phone: string | null
  country: string | null
  city: string | null
  industry: string | null
  notes: string | null
}

export interface LeadScoreBreakdown {
  score: number // 0 - 100
  priority: LeadPriority
  reasons: string[]
}

export interface CSVImportResult {
  totalProcessed: number
  importedCount: number
  skippedDuplicates: number
  errors: string[]
  leads: NormalizedLead[]
}

export interface PlacesEnrichmentResult {
  placeId: string | null
  rating: number | null
  reviewCount: number | null
  formattedAddress: string | null
}
