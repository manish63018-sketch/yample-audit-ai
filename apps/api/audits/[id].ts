import type { NextApiRequest, NextApiResponse } from 'next'
import auditRepository from '../../../repositories/auditRepository'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (req.method !== 'GET') return res.status(405).json({ success: false, message: 'Method not allowed' })
  try {
    const audit = await auditRepository.getAuditById(id as string)
    return res.status(200).json({ success: true, audit })
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Error fetching audit' })
  }
}
