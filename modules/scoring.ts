export function computeScores(parts: any) {
  // Basic weighted aggregation based on presence of scores
  const weights = { performance: 0.25, accessibility: 0.15, seo: 0.2, security: 0.1, ux: 0.1, business: 0.1, mobile: 0.1 }
  let total = 0
  let weightSum = 0
  for (const k in weights) {
    const w = weights[k as keyof typeof weights]
    const val = parts[k]?.score ?? parts[k]?.value ?? null
    if (typeof val === 'number') {
      total += val * w
      weightSum += w
    }
  }
  const overall = weightSum ? Math.round((total / weightSum) * 100) / 100 : null
  return { overall }
}

export default { computeScores }
