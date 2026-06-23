'use client'

import { useContext } from 'react'
import { CartContext } from '@/components/cart/cart-provider'

export function useCart() {
  return useContext(CartContext)
}
