import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { ingestLeadFromUrl } from '../../../../services/leadIntelligence'

const bodySchema = z.object({ url: z.string().url(), source: z.string().optional(), organization_id: z.string().uuid().optional() })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const parsed = bodySchema.parse(req.body)
      const result = await ingestLeadFromUrl(parsed.url, parsed.source || 'api', parsed.organization_id || null)
      return res.status(201).json({ success: true, data: result })
    }

    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (err: any) {
    res.status(400).json({ success: false, message: err?.message || 'Invalid request' })
  }
}
