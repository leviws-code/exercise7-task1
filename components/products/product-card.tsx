'use client'

import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/hooks/use-cart'
import type { Product } from '@/lib/types'

const categoryColors: Record<string, string> = {
  חלות: 'bg-amber-100 text-amber-800',
  עוגות: 'bg-pink-100 text-pink-800',
  ממתקים: 'bg-purple-100 text-purple-800',
}

export function ProductCard({ product }: { product: Product }) {
  const { dispatch } = useCart()

  function addToCart() {
    dispatch({
      type: 'ADD_ITEM',
      item: {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.image_url,
      },
    })
    toast.success(`${product.name} נוסף לסל`)
  }

  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="relative aspect-square bg-muted">
        <Image
          src={product.image_url ?? '/placeholder-product.svg'}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight">{product.name}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${categoryColors[product.category] ?? ''}`}>
            {product.category}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-1">
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-2 border-t">
        <span className="font-bold text-lg">
          ₪{product.price.toFixed(2)}
        </span>
        <Button size="sm" onClick={addToCart}>
          <ShoppingCart className="h-4 w-4 me-1" />
          הוסף לסל
        </Button>
      </CardFooter>
    </Card>
  )
}
