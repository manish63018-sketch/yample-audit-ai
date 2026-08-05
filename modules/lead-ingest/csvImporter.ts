import type { RawLeadRow, NormalizedLead, CSVImportResult } from './types'

/**
 * CSV Importer Engine
 * Parses raw CSV content, cleans domains, normalizes fields, and deduplicates leads.
 */
export class CSVImporter {
  /**
   * Parse CSV content string into normalized lead objects
   */
  static parseCSV(csvText: string): CSVImportResult {
    const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0)

    if (lines.length < 2) {
      return {
        totalProcessed: 0,
        importedCount: 0,
        skippedDuplicates: 0,
        errors: ['CSV file must contain a header row and at least one data row.'],
        leads: [],
      }
    }

    const headers = this.parseCSVLine(lines[0]).map((h) => h.toLowerCase().trim())
    const rows = lines.slice(1)

    const rawLeads: RawLeadRow[] = []
    const errors: string[] = []

    rows.forEach((line, idx) => {
      const values = this.parseCSVLine(line)
      if (values.length === 0 || values.every((v) => !v.trim())) return

      const raw: Record<string, string> = {}
      headers.forEach((header, colIdx) => {
        raw[header] = values[colIdx]?.trim() || ''
      })

      const businessName = raw['business_name'] || raw['businessname'] || raw['name'] || raw['company'] || ''
      const website = raw['website'] || raw['url'] || raw['domain'] || ''

      if (!businessName && !website) {
        errors.push(`Row ${idx + 2}: Missing both business name and website URL.`)
        return
      }

      rawLeads.push({
        businessName,
        website,
        email: raw['email'] || raw['contact_email'] || '',
        phone: raw['phone'] || raw['telephone'] || raw['mobile'] || '',
        country: raw['country'] || '',
        city: raw['city'] || raw['location'] || '',
        industry: raw['industry'] || raw['category'] || '',
        notes: raw['notes'] || raw['description'] || '',
      })
    })

    // Deduplicate by website domain
    const seenDomains = new Set<string>()
    const normalizedLeads: NormalizedLead[] = []
    let skippedDuplicates = 0

    rawLeads.forEach((raw) => {
      let cleanWebsite = raw.website || ''
      if (cleanWebsite) {
        cleanWebsite = cleanWebsite
          .toLowerCase()
          .replace(/^https?:\/\//i, '')
          .replace(/^www\./i, '')
          .split('/')[0]
      }

      const domainKey = cleanWebsite || raw.businessName?.toLowerCase() || ''

      if (domainKey && seenDomains.has(domainKey)) {
        skippedDuplicates++
        return
      }

      if (domainKey) {
        seenDomains.add(domainKey)
      }

      normalizedLeads.push({
        businessName: raw.businessName || cleanWebsite || 'Untitled Business',
        website: cleanWebsite ? `https://${cleanWebsite}` : '',
        email: raw.email || null,
        phone: raw.phone || null,
        country: raw.country || null,
        city: raw.city || null,
        industry: raw.industry || null,
        notes: raw.notes || null,
      })
    })

    return {
      totalProcessed: rawLeads.length,
      importedCount: normalizedLeads.length,
      skippedDuplicates,
      errors,
      leads: normalizedLeads,
    }
  }

  private static parseCSVLine(line: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }

    result.push(current)
    return result
  }
}
