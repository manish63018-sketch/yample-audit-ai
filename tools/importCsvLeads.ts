import fs from 'fs'
import csvParse from 'csv-parse/lib/sync'
import leadRepo from '../repositories/leadRepository'

async function importCsv(path: string) {
  const raw = fs.readFileSync(path, 'utf8')
  const records = csvParse(raw, { columns: true })
  for (const r of records) {
    try {
      await leadRepo.createLead({ source: 'csv', url: r.website || r.url, name: r.name, created_at: new Date().toISOString() })
    } catch (e) {
      console.error('Failed to insert lead', r, e.message)
    }
  }
}

const [, , file] = process.argv
if (!file) { console.error('Usage: ts-node tools/importCsvLeads.ts file.csv'); process.exit(1) }
importCsv(file).then(() => console.log('Import complete')).catch((e) => console.error(e))
