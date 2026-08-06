'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'

export type SupportedCurrency = 'INR' | 'USD' | 'EUR' | 'GBP'

export interface CurrencyConfig {
  code: SupportedCurrency
  symbol: string
  flag: string
  label: string
  rate: number // relative to USD
}

export const CURRENCIES: Record<SupportedCurrency, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', flag: '🇮🇳', label: 'Indian Rupee', rate: 84 },
  USD: { code: 'USD', symbol: '$', flag: '🇺🇸', label: 'US Dollar', rate: 1 },
  EUR: { code: 'EUR', symbol: '€', flag: '🇪🇺', label: 'Euro', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', flag: '🇬🇧', label: 'British Pound', rate: 0.79 },
}

// Bank transfer fee estimate in USD (for international)
export const TRANSFER_FEE_USD = 20

export interface GeoData {
  country: string
  countryCode: string
  city: string
  currency: SupportedCurrency
  isIndia: boolean
  isLoaded: boolean
}

interface GeoContextType {
  geo: GeoData
  activeCurrency: CurrencyConfig
  setCurrency: (currency: SupportedCurrency) => void
  convertPrice: (usdPrice: number) => number
  formatPrice: (usdPrice: number) => string
  transferFee: number
  transferFeeFormatted: string
  isInternational: boolean
}

const defaultGeo: GeoData = {
  country: 'United States',
  countryCode: 'US',
  city: '',
  currency: 'USD',
  isIndia: false,
  isLoaded: false,
}

const GeoContext = createContext<GeoContextType | null>(null)

export function GeoProvider({ children }: { children: ReactNode }) {
  const [geo, setGeo] = useState<GeoData>(defaultGeo)
  const [activeCurrency, setActiveCurrency] = useState<CurrencyConfig>(CURRENCIES.USD)

  useEffect(() => {
    // Check sessionStorage for cached geo
    const cached = sessionStorage.getItem('auditai_geo')
    if (cached) {
      try {
        const parsed: GeoData = JSON.parse(cached)
        setGeo({ ...parsed, isLoaded: true })
        setActiveCurrency(CURRENCIES[parsed.currency] || CURRENCIES.USD)
        return
      } catch {}
    }

    // Fetch from ipapi.co (free, no key required, 1000 req/day)
    fetch('https://ipapi.co/json/', { cache: 'force-cache' })
      .then(r => r.json())
      .then(data => {
        const countryCode: string = data.country_code || 'US'
        const isIndia = countryCode === 'IN'

        let currency: SupportedCurrency = 'USD'
        if (isIndia) currency = 'INR'
        else if (['GB', 'IM', 'JE', 'GG'].includes(countryCode)) currency = 'GBP'
        else if ([
          'DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'AT', 'PT', 'IE', 'FI',
          'SK', 'SI', 'EE', 'LT', 'LV', 'LU', 'MT', 'CY', 'GR',
        ].includes(countryCode)) currency = 'EUR'

        const geoData: GeoData = {
          country: data.country_name || 'United States',
          countryCode,
          city: data.city || '',
          currency,
          isIndia,
          isLoaded: true,
        }

        setGeo(geoData)
        setActiveCurrency(CURRENCIES[currency])
        sessionStorage.setItem('auditai_geo', JSON.stringify(geoData))
      })
      .catch(() => {
        // Fallback: use browser locale
        const locale = navigator.language || 'en-US'
        const isIndiaLocale = locale.startsWith('hi') || locale.includes('IN')
        const currency: SupportedCurrency = isIndiaLocale ? 'INR' : 'USD'
        const fallback: GeoData = {
          country: isIndiaLocale ? 'India' : 'United States',
          countryCode: isIndiaLocale ? 'IN' : 'US',
          city: '',
          currency,
          isIndia: isIndiaLocale,
          isLoaded: true,
        }
        setGeo(fallback)
        setActiveCurrency(CURRENCIES[currency])
      })
  }, [])

  const setCurrency = useCallback((currency: SupportedCurrency) => {
    // India users can only use INR
    if (geo.isIndia && currency !== 'INR') return
    setActiveCurrency(CURRENCIES[currency])
  }, [geo.isIndia])

  const convertPrice = useCallback((usdPrice: number): number => {
    const rate = activeCurrency.rate
    const converted = usdPrice * rate
    // Round to nearest 50 for INR, nearest 5 for others
    if (activeCurrency.code === 'INR') return Math.round(converted / 50) * 50
    return Math.round(converted * 100) / 100
  }, [activeCurrency])

  const formatPrice = useCallback((usdPrice: number): string => {
    const converted = convertPrice(usdPrice)
    if (activeCurrency.code === 'INR') {
      return `₹${converted.toLocaleString('en-IN')}`
    }
    return `${activeCurrency.symbol}${converted.toLocaleString('en-US')}`
  }, [convertPrice, activeCurrency])

  const transferFee = geo.isIndia ? 0 : TRANSFER_FEE_USD
  const transferFeeFormatted = geo.isIndia ? '' : formatPrice(TRANSFER_FEE_USD)
  const isInternational = !geo.isIndia && geo.isLoaded

  return (
    <GeoContext.Provider value={{
      geo,
      activeCurrency,
      setCurrency,
      convertPrice,
      formatPrice,
      transferFee,
      transferFeeFormatted,
      isInternational,
    }}>
      {children}
    </GeoContext.Provider>
  )
}

export function useGeo() {
  const ctx = useContext(GeoContext)
  if (!ctx) throw new Error('useGeo must be used within GeoProvider')
  return ctx
}
