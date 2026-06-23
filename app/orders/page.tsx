'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { he } from 'date-fns/locale'
import { Search } from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { OrderStatusBadge } from '@/components/orders/order-status-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getOrdersByContact } from '@/lib/actions/orders'
import type { OrderWithItems } from '@/lib/types'

export default function OrdersPage() {
  const [contact, setContact] = useState('')
  const [orders, setOrders] = useState<OrderWithItems[] | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!contact.trim()) return
    setLoading(true)
    const result = await getOrdersByContact(contact.trim())
    setOrders(result)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">ההזמנות שלי</h1>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                value={contact}
                onChange={e => setContact(e.target.value)}
                placeholder="חפש לפי אימייל או טלפון"
                dir="ltr"
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                <Search className="h-4 w-4 me-1" />
                {loading ? 'מחפש...' : 'חיפוש'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {orders === null && (
          <p className="text-center text-muted-foreground">
            הזן את האימייל או הטלפון שמסרת בהזמנה כדי לראות את ההזמנות שלך
          </p>
        )}

        {orders !== null && orders.length === 0 && (
          <p className="text-center text-muted-foreground">לא נמצאו הזמנות עבור {contact}</p>
        )}

        {orders && orders.length > 0 && (
          <div className="flex flex-col gap-4">
            {orders.map(order => (
              <Card key={order.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">הזמנה #{order.order_number}</CardTitle>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>
                      הוזמן: {format(new Date(order.created_at), 'dd/MM/yyyy', { locale: he })}
                    </span>
                    <span>
                      איסוף: {format(new Date(order.pickup_date), 'dd/MM/yyyy', { locale: he })}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-1.5 mb-3">
                    {order.order_items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.product_name} × {item.quantity}</span>
                        <span>₪{(item.unit_price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>סה"כ</span>
                    <span>₪{order.total_amount.toFixed(2)}</span>
                  </div>
                  {order.notes && (
                    <p className="mt-2 text-sm text-muted-foreground">הערות: {order.notes}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
