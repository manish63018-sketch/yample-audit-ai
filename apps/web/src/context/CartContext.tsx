'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { CartItemInput, CalculatedOrderSummary } from '@/lib/pricing';
import { calculateOrderSummary, getBundleDiscountPercentage } from '@/lib/pricing';

export { getBundleDiscountPercentage };

export interface ExtendedCartItem extends CartItemInput {
  id: string;
  name: string;
  price: number;
  quantity: number;
  timeline: string;
  benefits: string[];
  category: string;
  description?: string;
}

interface CartContextType {
  items: ExtendedCartItem[];
  addItem: (item: Partial<ExtendedCartItem> & { id: string; name: string; price: number }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  discount: number;
  setDiscount: (amount: number) => void;
  discountLabel: string;
  setDiscountLabel: (label: string) => void;
  itemCount: number;
  totalQuantity: number;
  summary: CalculatedOrderSummary;
  toastMessage: string | null;
  clearToast: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ExtendedCartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [discountLabel, setDiscountLabel] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. Initial hydration from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('auditai_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setItems(parsed.map((i) => ({ ...i, quantity: i.quantity || 1 })));
        }
      }
      const savedDiscount = localStorage.getItem('auditai_discount');
      if (savedDiscount) setDiscount(Number(savedDiscount));
      const savedLabel = localStorage.getItem('auditai_discount_label');
      if (savedLabel) setDiscountLabel(savedLabel);
    } catch {}
  }, []);

  // 2. Persist to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem('auditai_cart', JSON.stringify(items));
    } catch {}
  }, [items]);

  const clearToast = useCallback(() => setToastMessage(null), []);

  const addItem = useCallback(
    (itemInput: Partial<ExtendedCartItem> & { id: string; name: string; price: number }) => {
      setItems((prev) => {
        const existingIndex = prev.findIndex((i) => i.id === itemInput.id);
        if (existingIndex > -1) {
          // If already in cart, increment quantity
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: (updated[existingIndex].quantity || 1) + 1,
          };
          setToastMessage(`Updated quantity for "${itemInput.name}" in your cart!`);
          return updated;
        }

        const newItem: ExtendedCartItem = {
          id: itemInput.id,
          name: itemInput.name,
          price: itemInput.price,
          quantity: itemInput.quantity || 1,
          timeline: itemInput.timeline || '7 Days',
          benefits: itemInput.benefits || ['Standard Performance & Security Suite'],
          category: itemInput.category || 'Website Services',
          description: itemInput.description || '',
        };
        setToastMessage(`Added "${itemInput.name}" to your cart!`);
        return [...prev, newItem];
      });
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setToastMessage('Item removed from cart.');
  }, []);

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(id);
        return;
      }
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setDiscount(0);
    setDiscountLabel('');
    try {
      localStorage.removeItem('auditai_cart');
      localStorage.removeItem('auditai_discount');
      localStorage.removeItem('auditai_discount_label');
    } catch {}
  }, []);

  const handleSetDiscount = useCallback((amount: number) => {
    setDiscount(amount);
    try {
      localStorage.setItem('auditai_discount', String(amount));
    } catch {}
  }, []);

  const handleSetDiscountLabel = useCallback((label: string) => {
    setDiscountLabel(label);
    try {
      localStorage.setItem('auditai_discount_label', label);
    } catch {}
  }, []);

  const summary = useMemo(() => {
    return calculateOrderSummary(items, 'USD', discount, false);
  }, [items, discount]);

  const totalQuantity = useMemo(
    () => items.reduce((acc, i) => acc + (i.quantity || 1), 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        discount,
        setDiscount: handleSetDiscount,
        discountLabel,
        setDiscountLabel: handleSetDiscountLabel,
        itemCount: items.length,
        totalQuantity,
        summary,
        toastMessage,
        clearToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
