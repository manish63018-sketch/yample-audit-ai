export function formatToMarkdown(summary: string, recommendations: any[]) {
  let md = `# Executive Summary\n\n${summary}\n\n## Recommendations\n\n`
  for (const r of recommendations) {
    md += `### ${r.problem}\n- Impact: ${r.impact}\n- Priority: ${r.priority}\n- Recommendation: ${r.recommendation}\n- Estimated Effort: ${r.effort_hours || 'TBD'} hours\n- Confidence: ${r.confidence || 'Medium'}\n\n`
  }
  return md
}

export function toDashboardJson(aiJson: any) {
  return aiJson // identity for now; transform as needed
}

export default { formatToMarkdown, toDashboardJson }
