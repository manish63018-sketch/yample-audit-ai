import Queue from 'bull'
import pipelineManager from '../services/pipelineManager'

const auditQueue = new Queue('audit-queue', process.env.REDIS_URL || 'redis://127.0.0.1:6379')

auditQueue.process('runAudit', async (job: any) => {
  const { auditId, url } = job.data
  console.log('Processing audit', auditId, url)
  try {
    await pipelineManager.processAudit(auditId, url)
    return Promise.resolve()
  } catch (err: any) {
    console.error('Audit pipeline failed', err)
    // update status handled in pipelineManager; rethrow
    return Promise.reject(err)
  }
})

console.log('Audit worker started, waiting for jobs...')
