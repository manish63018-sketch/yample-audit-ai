'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  timeline: string
  benefits: string[]
  category: string
}

export function getBundleDiscountPercentage(itemCount: number): number {
  if (itemCount >= 7) return 20
  if (itemCount >= 5) return 15
  if (itemCount >= 3) return 10
  if (itemCount >= 2) return 5
  return 0
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  total: number // subtotal
  discount: number // promo/international timer discount
  setDiscount: (amount: number) => void
  discountLabel: string
  setDiscountLabel: (label: string) => void
  itemCount: number
  bundleDiscountPct: number
  bundleDiscountAmount: number
  totalSavings: number
  finalTotal: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [discountLabel, setDiscountLabel] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('auditai_cart')
      if (saved) setItems(JSON.parse(saved))
      const savedDiscount = localStorage.getItem('auditai_discount')
      if (savedDiscount) setDiscount(Number(savedDiscount))
      const savedLabel = localStorage.getItem('auditai_discount_label')
      if (savedLabel) setDiscountLabel(savedLabel)
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('auditai_cart', JSON.stringify(items))
    } catch {}
  }, [items])

  const addItem = (item: CartItem) => {
    setItems(prev => {
      if (prev.find(i => i.id === item.id)) return prev
      return [...prev, item]
    })
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const clearCart = () => {
    setItems([])
    setDiscount(0)
    setDiscountLabel('')
    localStorage.removeItem('auditai_cart')
    localStorage.removeItem('auditai_discount')
    localStorage.removeItem('auditai_discount_label')
  }

  const handleSetDiscount = (amount: number) => {
    setDiscount(amount)
    localStorage.setItem('auditai_discount', String(amount))
  }

  const handleSetDiscountLabel = (label: string) => {
    setDiscountLabel(label)
    localStorage.setItem('auditai_discount_label', label)
  }

  const total = useMemo(() => items.reduce((sum, item) => sum + item.price, 0), [items])

  const bundleDiscountPct = useMemo(() => getBundleDiscountPercentage(items.length), [items.length])

  const bundleDiscountAmount = useMemo(() => {
    if (bundleDiscountPct === 0) return 0
    return Math.round((total * bundleDiscountPct) / 100 * 100) / 100
  }, [total, bundleDiscountPct])

  const totalSavings = useMemo(() => bundleDiscountAmount + discount, [bundleDiscountAmount, discount])

  const finalTotal = useMemo(() => Math.max(0, total - totalSavings), [total, totalSavings])

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      clearCart,
      total,
      discount,
      setDiscount: handleSetDiscount,
      discountLabel,
      setDiscountLabel: handleSetDiscountLabel,
      itemCount: items.length,
      bundleDiscountPct,
      bundleDiscountAmount,
      totalSavings,
      finalTotal,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
