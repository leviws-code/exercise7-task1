'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SiteHeader } from '@/components/layout/site-header'
import { OrderForm } from '@/components/orders/order-form'
import { useCart } from '@/hooks/use-cart'

export default function CartPage() {
  const { items, dispatch, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-4">
          <p className="text-5xl">🛒</p>
          <h2 className="text-xl font-semibold">הסל שלך ריק</h2>
          <p className="text-muted-foreground">חזור/י לתפריט ובחר/י מוצרים</p>
          <Button render={<Link href="/" />}>לתפריט</Button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">סל הקניות</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map(item => (
              <Card key={item.productId}>
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={item.imageUrl ?? '/placeholder-product.svg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ₪{item.price.toFixed(2)} ליחידה
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        dispatch({
                          type: 'UPDATE_QUANTITY',
                          productId: item.productId,
                          quantity: item.quantity - 1,
                        })
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        dispatch({
                          type: 'UPDATE_QUANTITY',
                          productId: item.productId,
                          quantity: item.quantity + 1,
                        })
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="w-20 text-end font-semibold shrink-0">
                    ₪{(item.price * item.quantity).toFixed(2)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-destructive hover:text-destructive"
                    onClick={() =>
                      dispatch({ type: 'REMOVE_ITEM', productId: item.productId })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
            <div className="flex items-center justify-between border-t pt-4">
              <span className="text-lg font-semibold">סה"כ</span>
              <span className="text-xl font-bold">₪{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Order form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>פרטי הזמנה</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
