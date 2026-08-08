/**
 * AuditAI — Supabase Database Types
 * Source of truth matching database/schema.sql
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          billing_customer_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          billing_customer_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          billing_customer_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          id: string
          organization_id: string
          name: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          role: string
          invited_at: string
          accepted_at: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          role: string
          invited_at?: string
          accepted_at?: string | null
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          role?: string
          invited_at?: string
          accepted_at?: string | null
        }
        Relationships: []
      }
      websites: {
        Row: {
          id: string
          organization_id: string
          url: string
          name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          url: string
          name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          url?: string
          name?: string | null
          created_at?: string
        }
        Relationships: []
      }
      audits: {
        Row: {
          id: string
          website_id: string | null
          organization_id: string | null
          status: 'queued' | 'running' | 'completed' | 'failed'
          score: number | null
          started_at: string
          finished_at: string | null
        }
        Insert: {
          id?: string
          website_id?: string | null
          organization_id?: string | null
          status: 'queued' | 'running' | 'completed' | 'failed'
          score?: number | null
          started_at?: string
          finished_at?: string | null
        }
        Update: {
          id?: string
          website_id?: string | null
          organization_id?: string | null
          status?: 'queued' | 'running' | 'completed' | 'failed'
          score?: number | null
          started_at?: string
          finished_at?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          id: string
          audit_id: string
          type: string
          payload: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          audit_id: string
          type: string
          payload?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          audit_id?: string
          type?: string
          payload?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      pagespeed_reports: {
        Row: {
          id: string
          audit_id: string
          payload: Json | null
          lcp: number | null
          cls: number | null
          inp: number | null
          ttfb: number | null
          fcp: number | null
          speed_index: number | null
          created_at: string
        }
        Insert: {
          id?: string
          audit_id: string
          payload?: Json | null
          lcp?: number | null
          cls?: number | null
          inp?: number | null
          ttfb?: number | null
          fcp?: number | null
          speed_index?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          audit_id?: string
          payload?: Json | null
          lcp?: number | null
          cls?: number | null
          inp?: number | null
          ttfb?: number | null
          fcp?: number | null
          speed_index?: number | null
          created_at?: string
        }
        Relationships: []
      }
      lighthouse_reports: {
        Row: {
          id: string
          audit_id: string
          payload: Json | null
          opportunities: Json | null
          diagnostics: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          audit_id: string
          payload?: Json | null
          opportunities?: Json | null
          diagnostics?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          audit_id?: string
          payload?: Json | null
          opportunities?: Json | null
          diagnostics?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      accessibility_reports: {
        Row: {
          id: string
          audit_id: string
          issues: Json | null
          warnings: Json | null
          passed_count: number | null
          created_at: string
        }
        Insert: {
          id?: string
          audit_id: string
          issues?: Json | null
          warnings?: Json | null
          passed_count?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          audit_id?: string
          issues?: Json | null
          warnings?: Json | null
          passed_count?: number | null
          created_at?: string
        }
        Relationships: []
      }
      seo_reports: {
        Row: {
          id: string
          audit_id: string
          meta: Json | null
          schema: Json | null
          robots: Json | null
          sitemap: Json | null
          headings: Json | null
          links: Json | null
          images: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          audit_id: string
          meta?: Json | null
          schema?: Json | null
          robots?: Json | null
          sitemap?: Json | null
          headings?: Json | null
          links?: Json | null
          images?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          audit_id?: string
          meta?: Json | null
          schema?: Json | null
          robots?: Json | null
          sitemap?: Json | null
          headings?: Json | null
          links?: Json | null
          images?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      ai_reports: {
        Row: {
          id: string
          audit_id: string
          summary: string | null
          recommendations: Json | null
          revenue_analysis: Json | null
          business_analysis: Json | null
          proposal: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          audit_id: string
          summary?: string | null
          recommendations?: Json | null
          revenue_analysis?: Json | null
          business_analysis?: Json | null
          proposal?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          audit_id?: string
          summary?: string | null
          recommendations?: Json | null
          revenue_analysis?: Json | null
          business_analysis?: Json | null
          proposal?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      competitors: {
        Row: {
          id: string
          audit_id: string
          name: string | null
          website: string | null
          score: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          audit_id: string
          name?: string | null
          website?: string | null
          score?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          audit_id?: string
          name?: string | null
          website?: string | null
          score?: number | null
          notes?: string | null
          created_at?: string
        }
        Relationships: []
      }
      crm_leads: {
        Row: {
          id: string
          organization_id: string
          business_name: string | null
          website: string | null
          email: string | null
          phone: string | null
          country: string | null
          city: string | null
          industry: string | null
          status: string
          priority: string | null
          notes: string | null
          assigned_to: string | null
          audit_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          business_name?: string | null
          website?: string | null
          email?: string | null
          phone?: string | null
          country?: string | null
          city?: string | null
          industry?: string | null
          status: string
          priority?: string | null
          notes?: string | null
          assigned_to?: string | null
          audit_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          business_name?: string | null
          website?: string | null
          email?: string | null
          phone?: string | null
          country?: string | null
          city?: string | null
          industry?: string | null
          status?: string
          priority?: string | null
          notes?: string | null
          assigned_to?: string | null
          audit_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      proposals: {
        Row: {
          id: string
          lead_id: string | null
          price_cents: number | null
          currency: string | null
          features: Json | null
          timeline: string | null
          status: string | null
          pdf_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          lead_id?: string | null
          price_cents?: number | null
          currency?: string | null
          features?: Json | null
          timeline?: string | null
          status?: string | null
          pdf_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string | null
          price_cents?: number | null
          currency?: string | null
          features?: Json | null
          timeline?: string | null
          status?: string | null
          pdf_url?: string | null
          created_at?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          id: string
          proposal_id: string | null
          amount_cents: number | null
          currency: string | null
          status: string | null
          payment_provider: string | null
          invoice_pdf_url: string | null
          issued_at: string
        }
        Insert: {
          id?: string
          proposal_id?: string | null
          amount_cents?: number | null
          currency?: string | null
          status?: string | null
          payment_provider?: string | null
          invoice_pdf_url?: string | null
          issued_at?: string
        }
        Update: {
          id?: string
          proposal_id?: string | null
          amount_cents?: number | null
          currency?: string | null
          status?: string | null
          payment_provider?: string | null
          invoice_pdf_url?: string | null
          issued_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string | null
          message: string | null
          read: boolean
          meta: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          message?: string | null
          read?: boolean
          meta?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          message?: string | null
          read?: boolean
          meta?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      rewards: {
        Row: {
          id: string
          customer_id: string | null
          session_id: string | null
          reward_type: string
          reward_name: string
          discount_amount: number
          original_value: number
          final_value: number
          spin_timestamp: string
          expiry_timestamp: string
          status: 'Available' | 'Added to Cart' | 'Applied to Order' | 'Expired' | 'Cancelled'
          created_at: string
        }
        Insert: {
          id: string
          customer_id?: string | null
          session_id?: string | null
          reward_type: string
          reward_name: string
          discount_amount: number
          original_value: number
          final_value: number
          spin_timestamp?: string
          expiry_timestamp: string
          status?: 'Available' | 'Added to Cart' | 'Applied to Order' | 'Expired' | 'Cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string | null
          session_id?: string | null
          reward_type?: string
          reward_name?: string
          discount_amount?: number
          original_value?: number
          final_value?: number
          spin_timestamp?: string
          expiry_timestamp?: string
          status?: 'Available' | 'Added to Cart' | 'Applied to Order' | 'Expired' | 'Cancelled'
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

