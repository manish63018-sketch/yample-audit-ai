import type { CompetitorBenchmarkResult, AuditScores } from './types'

/**
 * Competitor & Industry Benchmark Engine (Step 10 of Audit Workflow)
 * Compares audit scores against established industry averages for specific business sectors.
 */
export function getCompetitorBenchmark(
  scores: AuditScores,
  category = 'General Business'
): CompetitorBenchmarkResult {
  const cat = category.toLowerCase()

  // Industry average baselines
  let perfAvg = 82
  let seoAvg = 84
  let accessAvg = 88
  let secAvg = 90
  let bizAvg = 85

  if (cat.includes('saas') || cat.includes('tech')) {
    perfAvg = 88
    seoAvg = 89
    secAvg = 94
  } else if (cat.includes('e-commerce') || cat.includes('shop')) {
    perfAvg = 80
    seoAvg = 86
    bizAvg = 88
  } else if (cat.includes('restaurant') || cat.includes('clinic') || cat.includes('gym')) {
    perfAvg = 76
    seoAvg = 80
    bizAvg = 82
  }

  const comparisons = [
    {
      category: 'Performance',
      userScore: scores.performance,
      industryAverage: perfAvg,
      diff: scores.performance - perfAvg,
    },
    {
      category: 'SEO Signal',
      userScore: scores.seo,
      industryAverage: seoAvg,
      diff: scores.seo - seoAvg,
    },
    {
      category: 'Accessibility',
      userScore: scores.accessibility,
      industryAverage: accessAvg,
      diff: scores.accessibility - accessAvg,
    },
    {
      category: 'Security',
      userScore: scores.security,
      industryAverage: secAvg,
      diff: scores.security - secAvg,
    },
    {
      category: 'Business Score',
      userScore: scores.business,
      industryAverage: bizAvg,
      diff: scores.business - bizAvg,
    },
  ]

  return {
    industry: category,
    comparisons,
  }
}
