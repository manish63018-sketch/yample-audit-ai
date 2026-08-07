/**
 * AuditAI Session Manager
 * Saves and restores all critical form/cart/quote progress.
 * Syncs to Supabase after login.
 */

export const SESSION_KEYS = {
  CART: 'auditai_cart',
  QUOTE: 'auditai_active_quote',
  REQUIREMENTS: 'auditai_requirements',
  CURRENCY: 'auditai_currency',
  THEME: 'auditai_theme',
  LANGUAGE: 'auditai_lang',
  AUDIT_URL: 'auditai_last_audit_url',
  DISCOUNT: 'auditai_discount',
  USER: 'auditai_user',
  DRAFT_ORDER: 'auditai_draft_order',
} as const

export type SessionKey = (typeof SESSION_KEYS)[keyof typeof SESSION_KEYS]

// ─────────────────────────────────────────────────
// Save Progress
// ─────────────────────────────────────────────────
export function saveProgress<T>(key: SessionKey, data: T): void {
  if (typeof window === 'undefined') return
  try {
    const payload = JSON.stringify({ data, savedAt: new Date().toISOString() })
    localStorage.setItem(key, payload)
    sessionStorage.setItem(key, payload) // Also keep in session for tab
  } catch (err) {
    console.warn('[SessionManager] Failed to save:', key, err)
  }
}

// ─────────────────────────────────────────────────
// Restore Progress
// ─────────────────────────────────────────────────
export function restoreProgress<T>(key: SessionKey): T | null {
  if (typeof window === 'undefined') return null
  try {
    // Prefer sessionStorage (current tab), fall back to localStorage (persisted)
    const raw = sessionStorage.getItem(key) || localStorage.getItem(key)
    if (!raw) return null
    const { data } = JSON.parse(raw)
    return data as T
  } catch (err) {
    console.warn('[SessionManager] Failed to restore:', key, err)
    return null
  }
}

// ─────────────────────────────────────────────────
// Clear a specific key
// ─────────────────────────────────────────────────
export function clearProgress(key: SessionKey): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(key)
  sessionStorage.removeItem(key)
}

// ─────────────────────────────────────────────────
// Clear ALL AuditAI session data (on logout)
// ─────────────────────────────────────────────────
export function clearAllProgress(): void {
  if (typeof window === 'undefined') return
  Object.values(SESSION_KEYS).forEach((key) => {
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
  })
}

// ─────────────────────────────────────────────────
// Get saved timestamp
// ─────────────────────────────────────────────────
export function getProgressAge(key: SessionKey): Date | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const { savedAt } = JSON.parse(raw)
    return new Date(savedAt)
  } catch {
    return null
  }
}

// ─────────────────────────────────────────────────
// Sync to Supabase (call after successful login)
// ─────────────────────────────────────────────────
export async function syncProgressToAccount(userId: string): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    // Dynamically import Supabase client to avoid SSR issues
    const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs')
    const supabase = createClientComponentClient()

    // Collect all saved drafts
    const draftRequirements = restoreProgress(SESSION_KEYS.REQUIREMENTS)
    const draftCart = restoreProgress(SESSION_KEYS.CART)
    const draftQuote = restoreProgress(SESSION_KEYS.QUOTE)

    // Save requirements draft to Supabase quotes table as 'draft'
    if (draftRequirements) {
      const { error } = await supabase
        .from('quotes')
        .upsert(
          {
            customer_id: userId,
            status: 'draft',
            additional_notes: JSON.stringify(draftRequirements),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'customer_id,status' }
        )
      if (error) console.warn('[SessionManager] Failed to sync requirements:', error.message)
    }

    // Log sync completion
    console.log('[SessionManager] Progress synced to account:', userId)
  } catch (err) {
    console.warn('[SessionManager] Sync failed:', err)
  }
}

// ─────────────────────────────────────────────────
// React hook for auto-save (use in forms)
// ─────────────────────────────────────────────────
export function createAutoSave<T>(key: SessionKey, debounceMs = 500) {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return {
    save: (data: T) => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        saveProgress(key, data)
      }, debounceMs)
    },
    restore: () => restoreProgress<T>(key),
    clear: () => clearProgress(key),
  }
}
