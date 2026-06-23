'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ProductCard } from './product-card'
import type { Product, ProductCategory } from '@/lib/types'

const CATEGORIES: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'כל המוצרים' },
  { value: 'חלות', label: 'חלות' },
  { value: 'עוגות', label: 'עוגות' },
  { value: 'ממתקים', label: 'ממתקים' },
]

export function ProductGrid({ products }: { products: Product[] }) {
  const [activeTab, setActiveTab] = useState('all')

  const filtered =
    activeTab === 'all' ? products : products.filter(p => p.category === activeTab)

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="text-4xl mb-4">🥐</p>
        <p>אין מוצרים זמינים כרגע</p>
      </div>
    )
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-6">
        {CATEGORIES.map(cat => (
          <TabsTrigger key={cat.value} value={cat.value}>
            {cat.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {CATEGORIES.map(cat => (
        <TabsContent key={cat.value} value={cat.value}>
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">אין מוצרים בקטגוריה זו</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}
