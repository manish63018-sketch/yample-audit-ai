import { CSVImporter } from './csvImporter'
import { LeadScorer } from './leadScorer'
import type { NormalizedLead, CSVImportResult } from './types'
import { LeadRepository, createAdminSupabaseClient } from '@auditai/db'

export interface LeadIngestPayload {
  organizationId: string
  csvText?: string
  leadsList?: NormalizedLead[]
}

export class LeadOrchestrator {
  /**
   * Import and score leads, persisting them to Supabase CRM database
   */
  static async importLeads(payload: LeadIngestPayload): Promise<CSVImportResult> {
    const { organizationId, csvText, leadsList } = payload

    let parseResult: CSVImportResult

    if (csvText) {
      parseResult = CSVImporter.parseCSV(csvText)
    } else if (leadsList) {
      parseResult = {
        totalProcessed: leadsList.length,
        importedCount: leadsList.length,
        skippedDuplicates: 0,
        errors: [],
        leads: leadsList,
      }
    } else {
      return {
        totalProcessed: 0,
        importedCount: 0,
        skippedDuplicates: 0,
        errors: ['No CSV content or lead array provided.'],
        leads: [],
      }
    }

    const adminClient = createAdminSupabaseClient()
    const leadRepo = new LeadRepository(adminClient)

    // Save each lead to Supabase
    for (const lead of parseResult.leads) {
      const scoring = LeadScorer.scoreLead(lead)

      try {
        await leadRepo.create({
          organization_id: organizationId,
          business_name: lead.businessName,
          website: lead.website,
          email: lead.email,
          phone: lead.phone,
          country: lead.country,
          city: lead.city,
          industry: lead.industry,
          status: 'new',
          priority: scoring.priority,
          notes: lead.notes,
        })
      } catch (err) {
        console.warn(`Failed to persist lead ${lead.businessName} to DB (continuing):`, err)
      }
    }

    return parseResult
  }
}
