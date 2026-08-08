/**
 * AuditAI — Centralized Authoritative Pricing & Currency System
 *
 * SINGLE SOURCE OF TRUTH for all pricing calculations, bundle discounts,
 * promotional rewards, currency conversions, tax estimations, and formatted price outputs across
 * Report, Cart, Checkout, Database payloads, Emails, WhatsApp messages, and Order Tracking.
 */

export type SupportedCurrency = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  flag: string;
  label: string;
  rate: number; // relative to USD baseline
}

export const CURRENCIES: Record<SupportedCurrency, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', flag: '🇮🇳', label: 'Indian Rupee', rate: 84 },
  USD: { code: 'USD', symbol: '$', flag: '🇺🇸', label: 'US Dollar', rate: 1 },
  EUR: { code: 'EUR', symbol: '€', flag: '🇪🇺', label: 'Euro', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', flag: '🇬🇧', label: 'British Pound', rate: 0.79 },
};

export const INTERNATIONAL_TRANSFER_FEE_USD = 20;

export interface CartItemInput {
  id: string;
  name: string;
  price: number; // USD base price (customer price)
  originalPrice?: number; // Base price before reward/discount
  quantity?: number;
  timeline?: string;
  benefits?: string[];
  category?: string;
  description?: string;
  isReward?: boolean;
  rewardId?: string;
}

export interface CalculatedOrderSummary {
  itemCount: number;
  totalQuantity: number;
  subtotalUSD: number;
  rewardSavingsUSD: number;
  bundleDiscountPct: number;
  bundleDiscountUSD: number;
  promoDiscountUSD: number;
  totalSavingsUSD: number;
  processingFeeUSD: number;
  taxUSD: number;
  finalTotalUSD: number;

  // Converted Values in Target Currency
  currencyCode: SupportedCurrency;
  currencySymbol: string;
  subtotalConverted: number;
  rewardSavingsConverted: number;
  bundleDiscountConverted: number;
  promoDiscountConverted: number;
  totalSavingsConverted: number;
  processingFeeConverted: number;
  taxConverted: number;
  finalTotalConverted: number;

  // Formatted String Display Values
  subtotalFormatted: string;
  rewardSavingsFormatted: string;
  bundleDiscountFormatted: string;
  promoDiscountFormatted: string;
  totalSavingsFormatted: string;
  processingFeeFormatted: string;
  taxFormatted: string;
  finalTotalFormatted: string;
}

/**
 * Bundle Discount Percentage based on total quantity of distinct paid services
 */
export function getBundleDiscountPercentage(totalQuantity: number): number {
  if (totalQuantity >= 7) return 20;
  if (totalQuantity >= 5) return 15;
  if (totalQuantity >= 3) return 10;
  if (totalQuantity >= 2) return 5;
  return 0;
}

/**
 * Currency Conversion Helper
 */
export function convertUsdToCurrency(usdAmount: number, currency: SupportedCurrency): number {
  const cfg = CURRENCIES[currency] || CURRENCIES.USD;
  const converted = usdAmount * cfg.rate;
  if (currency === 'INR') {
    return Math.round(converted / 50) * 50;
  }
  return Math.round(converted * 100) / 100;
}

/**
 * Format any USD price into the customer's active currency display string
 */
export function formatCurrencyPrice(usdAmount: number, currency: SupportedCurrency): string {
  const cfg = CURRENCIES[currency] || CURRENCIES.USD;
  const converted = convertUsdToCurrency(usdAmount, currency);
  if (currency === 'INR') {
    return `₹${converted.toLocaleString('en-IN')}`;
  }
  return `${cfg.symbol}${converted.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Master Authoritative Order Calculation Function
 */
export function calculateOrderSummary(
  items: CartItemInput[],
  currency: SupportedCurrency = 'USD',
  promoDiscountUSD: number = 0,
  isIndia: boolean = false
): CalculatedOrderSummary {
  const validItems = (items || []).filter((i) => i && typeof i.price === 'number');

  // Separate regular services and spin rewards
  const regularItems = validItems.filter((i) => !i.isReward);
  const rewardItems = validItems.filter((i) => i.isReward);

  // Total quantity of paid regular items
  const regularQuantity = regularItems.reduce((acc, i) => acc + (i.quantity || 1), 0);
  const totalQuantity = validItems.reduce((acc, i) => acc + (i.quantity || 1), 0);

  // Subtotal calculation (Regular service prices + Reward original values)
  const regularSubtotalUSD = regularItems.reduce((acc, i) => acc + i.price * (i.quantity || 1), 0);
  const rewardOriginalValuesUSD = rewardItems.reduce(
    (acc, i) => acc + (i.originalPrice || i.price || 0) * (i.quantity || 1),
    0
  );

  const subtotalUSD = regularSubtotalUSD + rewardOriginalValuesUSD;

  // Total savings provided by 100% free spin rewards
  const rewardSavingsUSD = rewardItems.reduce(
    (acc, i) => acc + (i.originalPrice || i.price || 0) * (i.quantity || 1) - i.price * (i.quantity || 1),
    0
  );

  // Bundle discount is calculated on paid regular services subtotal
  const bundleDiscountPct = getBundleDiscountPercentage(regularQuantity);
  const bundleDiscountUSD = Math.round((regularSubtotalUSD * bundleDiscountPct) / 100);

  const processingFeeUSD =
    !isIndia && currency !== 'INR' && validItems.length > 0 ? INTERNATIONAL_TRANSFER_FEE_USD : 0;
  const taxUSD = 0;

  const totalSavingsUSD = bundleDiscountUSD + (promoDiscountUSD || 0) + rewardSavingsUSD;
  const finalTotalUSD = Math.max(0, subtotalUSD - totalSavingsUSD + processingFeeUSD);

  const cfg = CURRENCIES[currency] || CURRENCIES.USD;
  const subtotalConverted = convertUsdToCurrency(subtotalUSD, currency);
  const rewardSavingsConverted = convertUsdToCurrency(rewardSavingsUSD, currency);
  const bundleDiscountConverted = convertUsdToCurrency(bundleDiscountUSD, currency);
  const promoDiscountConverted = convertUsdToCurrency(promoDiscountUSD, currency);
  const totalSavingsConverted = convertUsdToCurrency(totalSavingsUSD, currency);
  const processingFeeConverted = convertUsdToCurrency(processingFeeUSD, currency);
  const taxConverted = convertUsdToCurrency(taxUSD, currency);
  const finalTotalConverted = convertUsdToCurrency(finalTotalUSD, currency);

  return {
    itemCount: validItems.length,
    totalQuantity,
    subtotalUSD,
    rewardSavingsUSD,
    bundleDiscountPct,
    bundleDiscountUSD,
    promoDiscountUSD,
    totalSavingsUSD,
    processingFeeUSD,
    taxUSD,
    finalTotalUSD,

    currencyCode: cfg.code,
    currencySymbol: cfg.symbol,
    subtotalConverted,
    rewardSavingsConverted,
    bundleDiscountConverted,
    promoDiscountConverted,
    totalSavingsConverted,
    processingFeeConverted,
    taxConverted,
    finalTotalConverted,

    subtotalFormatted: formatCurrencyPrice(subtotalUSD, currency),
    rewardSavingsFormatted: formatCurrencyPrice(rewardSavingsUSD, currency),
    bundleDiscountFormatted: formatCurrencyPrice(bundleDiscountUSD, currency),
    promoDiscountFormatted: formatCurrencyPrice(promoDiscountUSD, currency),
    totalSavingsFormatted: formatCurrencyPrice(totalSavingsUSD, currency),
    processingFeeFormatted: formatCurrencyPrice(processingFeeUSD, currency),
    taxFormatted: formatCurrencyPrice(taxUSD, currency),
    finalTotalFormatted: formatCurrencyPrice(finalTotalUSD, currency),
  };
}
