import { z } from 'zod'
import auditRepository from '../repositories/auditRepository'
import Queue from 'bull'

const auditQueue = new Queue('audit-queue', process.env.REDIS_URL || 'redis://127.0.0.1:6379')

const createAuditSchema = z.object({
  website_id: z.string().uuid(),
  organization_id: z.string().uuid(),
  user_id: z.string().uuid().optional(),
  url: z.string().url()
})

export const enqueueAudit = async (input: unknown) => {
  const parsed = createAuditSchema.parse(input)
  const audit = await auditRepository.createAudit(parsed as any)
  // enqueue job
  await auditQueue.add('runAudit', { auditId: audit.id, url: parsed.url }, { attempts: 3, backoff: 5000 })
  return audit
}

export default { enqueueAudit }
