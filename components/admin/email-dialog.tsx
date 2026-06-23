'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { sendCustomerEmail } from '@/lib/actions/email'
import type { OrderWithItems } from '@/lib/types'

interface EmailDialogProps {
  order: OrderWithItems | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmailDialog({ order, open, onOpenChange }: EmailDialogProps) {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  if (!order) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const result = await sendCustomerEmail({
        to: order!.customer_email,
        customerName: order!.customer_name,
        subject,
        message,
        orderNumber: order!.order_number,
      })
      if (result.error) {
        toast.error('שגיאה בשליחת המייל')
      } else {
        toast.success('המייל נשלח בהצלחה')
        onOpenChange(false)
        setSubject('')
        setMessage('')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>שליחת מייל — הזמנה #{order.order_number}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>נמען</Label>
            <Input value={order.customer_email} disabled dir="ltr" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email-subject">נושא</Label>
            <Input
              id="email-subject"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              required
              placeholder="לדוגמה: עדכון לגבי הזמנתך"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email-message">הודעה</Label>
            <Textarea
              id="email-message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
              placeholder="כתוב את ההודעה כאן..."
              rows={5}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              ביטול
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'שולח...' : 'שלח מייל'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
