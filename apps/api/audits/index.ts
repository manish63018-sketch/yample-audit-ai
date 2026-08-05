import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { enqueueAudit } from '../../../services/auditService'

const bodySchema = z.object({ website_id: z.string().uuid(), organization_id: z.string().uuid(), url: z.string().url() })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const parsed = bodySchema.parse(req.body)
      const audit = await enqueueAudit(parsed)
      return res.status(201).json({ success: true, auditId: audit.id })
    }

    if (req.method === 'GET') {
      // list audits for org (basic)
      const { org } = req.query
      const supabase = (await import('../../../lib/supabaseServer')).default
      const { data, error } = await supabase.from('audits').select('*').eq('organization_id', org)
      if (error) return res.status(500).json({ success: false, message: 'DB error' })
      return res.status(200).json({ success: true, data })
    }

    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (err: any) {
    const message = err?.message || 'Invalid request'
    res.status(400).json({ success: false, message })
  }
}
