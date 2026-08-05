export async function runBusinessAnalysis(auditId: string, url: string, websitePayload: any) {
  // Placeholder: use heuristics and AI later
  const detectedIndustry = websitePayload?.industry || 'unspecified'
  return { ok: true, industry: detectedIndustry, recommendations: [] }
}

export default { runBusinessAnalysis }
