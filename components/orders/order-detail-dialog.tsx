import { format } from 'date-fns'
import { he } from 'date-fns/locale'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { OrderStatusBadge } from './order-status-badge'
import type { OrderWithItems } from '@/lib/types'

interface OrderDetailDialogProps {
  order: OrderWithItems | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDetailDialog({ order, open, onOpenChange }: OrderDetailDialogProps) {
  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>הזמנה #{order.order_number}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">סטטוס</span>
            <OrderStatusBadge status={order.status} />
          </div>

          <Separator />

          <div className="flex flex-col gap-2">
            <p className="font-medium">פרטי לקוח</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground">
              <span>שם:</span>     <span className="text-foreground">{order.customer_name}</span>
              <span>טלפון:</span>  <span className="text-foreground" dir="ltr">{order.customer_phone}</span>
              <span>אימייל:</span> <span className="text-foreground" dir="ltr">{order.customer_email}</span>
              <span>איסוף:</span>  <span className="text-foreground">
                {format(new Date(order.pickup_date), 'dd/MM/yyyy', { locale: he })}
              </span>
            </div>
          </div>

          {order.notes && (
            <>
              <Separator />
              <div>
                <p className="font-medium mb-1">הערות</p>
                <p className="text-muted-foreground">{order.notes}</p>
              </div>
            </>
          )}

          <Separator />

          <div className="flex flex-col gap-2">
            <p className="font-medium">פריטים</p>
            {order.order_items.map(item => (
              <div key={item.id} className="flex justify-between">
                <span>{item.product_name} × {item.quantity}</span>
                <span>₪{(item.unit_price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex justify-between font-semibold">
            <span>סה"כ</span>
            <span>₪{order.total_amount.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">תשלום</span>
            <span className={order.is_paid ? 'text-green-600 font-medium' : 'text-destructive'}>
              {order.is_paid ? 'שולם' : 'לא שולם'}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
