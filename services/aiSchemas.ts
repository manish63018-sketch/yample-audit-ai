import { z } from 'zod'

export const RecommendationSchema = z.object({
  problem: z.string(),
  impact: z.string(),
  priority: z.string(),
  recommendation: z.string(),
  effort_hours: z.number().optional(),
  confidence: z.string().optional()
})

export const AuditOutputSchema = z.object({
  executive_summary: z.string().optional(),
  summary: z.string().optional(),
  recommendations: z.array(RecommendationSchema).optional()
})

export type AuditOutput = z.infer<typeof AuditOutputSchema>

export default { AuditOutputSchema, RecommendationSchema }
