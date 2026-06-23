'use client'

import { createContext, useReducer, useEffect, type Dispatch } from 'react'
import type { CartItem } from '@/lib/types'

type CartAction =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD'; items: CartItem[] }

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(i => i.productId === action.item.productId)
      if (existing) {
        return state.map(i =>
          i.productId === action.item.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...state, action.item]
    }
    case 'REMOVE_ITEM':
      return state.filter(i => i.productId !== action.productId)
    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        return state.filter(i => i.productId !== action.productId)
      }
      return state.map(i =>
        i.productId === action.productId ? { ...i, quantity: action.quantity } : i
      )
    case 'CLEAR_CART':
      return []
    case 'LOAD':
      return action.items
    default:
      return state
  }
}

export interface CartContextValue {
  items: CartItem[]
  dispatch: Dispatch<CartAction>
  totalItems: number
  totalPrice: number
}

export const CartContext = createContext<CartContextValue>({
  items: [],
  dispatch: () => {},
  totalItems: 0,
  totalPrice: 0,
})

const STORAGE_KEY = 'bakery_cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        dispatch({ type: 'LOAD', items: JSON.parse(stored) })
      }
    } catch {}
  }, [])

  // Sync to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, dispatch, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}
