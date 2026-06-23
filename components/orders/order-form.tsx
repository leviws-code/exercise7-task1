'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { he } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { createOrder } from '@/lib/actions/orders'
import { useCart } from '@/hooks/use-cart'
import type { CartItem } from '@/lib/types'

interface OrderFormProps {
  defaultValues?: {
    customer_name?: string
    customer_phone?: string
    customer_email?: string
  }
  userId?: string
}

export function OrderForm({ defaultValues, userId }: OrderFormProps) {
  const router = useRouter()
  const { items, dispatch } = useCart()
  const [loading, setLoading] = useState(false)
  const [pickupDate, setPickupDate] = useState<Date | undefined>()
  const [calendarOpen, setCalendarOpen] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!pickupDate) {
      toast.error('יש לבחור תאריך איסוף')
      return
    }
    if (items.length === 0) {
      toast.error('הסל ריק')
      return
    }

    setLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.set('pickup_date', format(pickupDate, 'yyyy-MM-dd'))

    const result = await createOrder(formData, items, userId)

    if (result.error) {
      toast.error('שגיאה בשליחת ההזמנה: ' + result.error)
      setLoading(false)
      return
    }

    dispatch({ type: 'CLEAR_CART' })
    toast.success(`הזמנה מספר ${result.orderNumber} נשלחה בהצלחה!`)
    router.push('/orders')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="customer_name">שם מלא</Label>
        <Input
          id="customer_name"
          name="customer_name"
          required
          placeholder="ישראל ישראלי"
          defaultValue={defaultValues?.customer_name}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="customer_phone">טלפון</Label>
        <Input
          id="customer_phone"
          name="customer_phone"
          type="tel"
          required
          placeholder="050-0000000"
          dir="ltr"
          defaultValue={defaultValues?.customer_phone}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="customer_email">אימייל</Label>
        <Input
          id="customer_email"
          name="customer_email"
          type="email"
          required
          placeholder="your@email.com"
          dir="ltr"
          defaultValue={defaultValues?.customer_email}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>תאריך איסוף</Label>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger render={<Button variant="outline" className="justify-start font-normal" />}>
            <CalendarIcon className="ms-2 h-4 w-4 text-muted-foreground" />
            {pickupDate
              ? format(pickupDate, 'dd/MM/yyyy', { locale: he })
              : 'בחר תאריך'}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={pickupDate}
              onSelect={(date) => {
                setPickupDate(date)
                setCalendarOpen(false)
              }}
              disabled={(date) => date < new Date()}
              locale={he}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">הערות</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="הערות מיוחדות, אלרגיות, בקשות..."
          rows={3}
        />
      </div>
      <Button type="submit" disabled={loading} size="lg" className="mt-2">
        {loading ? 'שולח הזמנה...' : 'שלח הזמנה'}
      </Button>
    </form>
  )
}
