import type { RevenueCalculationParams, RevenueOpportunityResult } from './types'

/**
 * Revenue Opportunity Calculator
 * Benchmarks:
 * - 1.0 second reduction in LCP = +7.0% conversion rate improvement (Google / Deloitte study benchmark)
 * - Minimum LCP baseline target: 1.8s
 */
export class RevenueOpportunityCalculator {
  static calculate(params: RevenueCalculationParams): RevenueOpportunityResult {
    const {
      monthlyTraffic,
      conversionRatePercent,
      averageOrderValueCents,
      currentLcpSeconds,
      targetLcpSeconds = 1.8,
    } = params

    // Calculate monthly & annual baseline revenue
    const monthlyConversions = monthlyTraffic * (conversionRatePercent / 100)
    const currentMonthlyRevenueCents = monthlyConversions * averageOrderValueCents
    const currentAnnualRevenueCents = currentMonthlyRevenueCents * 12

    // Calculate LCP delta
    const lcpDelta = Math.max(0, currentLcpSeconds - targetLcpSeconds)
    // 7% uplift per second of improvement
    const conversionUpliftPercent = Number((lcpDelta * 7.0).toFixed(1))

    // Calculate projected revenue
    const newConversionRate = conversionRatePercent * (1 + conversionUpliftPercent / 100)
    const projectedMonthlyConversions = monthlyTraffic * (newConversionRate / 100)
    const projectedMonthlyRevenueCents = projectedMonthlyConversions * averageOrderValueCents
    const projectedAnnualRevenueCents = projectedMonthlyRevenueCents * 12

    const monthlyGainCents = Math.round(projectedMonthlyRevenueCents - currentMonthlyRevenueCents)
    const annualGainCents = Math.round(projectedAnnualRevenueCents - currentAnnualRevenueCents)

    const formattedGain = (annualGainCents / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    })

    return {
      currentAnnualRevenueCents: Math.round(currentAnnualRevenueCents),
      projectedAnnualRevenueCents: Math.round(projectedAnnualRevenueCents),
      annualGainCents,
      monthlyGainCents,
      conversionUpliftPercent,
      explanation: `Reducing page load time from ${currentLcpSeconds}s to ${targetLcpSeconds}s yields an estimated +${conversionUpliftPercent}% conversion rate uplift, adding ${formattedGain}/year in incremental revenue.`,
    }
  }
}
