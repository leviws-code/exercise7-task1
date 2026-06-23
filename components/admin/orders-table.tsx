'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { he } from 'date-fns/locale'
import { Search } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { OrderStatusBadge } from '@/components/orders/order-status-badge'
import { OrderDetailDialog } from '@/components/orders/order-detail-dialog'
import { EmailDialog } from '@/components/admin/email-dialog'
import { updateOrderStatus, updateOrderPaid } from '@/lib/actions/orders'
import type { OrderStatus, OrderWithItems } from '@/lib/types'

const STATUSES: OrderStatus[] = ['חדש', 'התקבלה', 'מוכן לאיסוף', 'הושלמה']

export function OrdersTable({ orders }: { orders: OrderWithItems[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [emailOrder, setEmailOrder] = useState<OrderWithItems | null>(null)
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)

  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') ?? '')
  const [dateFilter, setDateFilter] = useState(searchParams.get('date') ?? '')

  function applyFilters(overrides: Record<string, string> = {}) {
    const params = new URLSearchParams()
    const s = overrides.search  ?? search
    const st = overrides.status ?? statusFilter
    const d = overrides.date   ?? dateFilter
    if (s) params.set('search', s)
    if (st) params.set('status', st)
    if (d) params.set('date', d)
    startTransition(() => router.replace(`/admin/orders?${params.toString()}`))
  }

  async function handleStatusChange(id: string, status: OrderStatus) {
    const result = await updateOrderStatus(id, status)
    if (result.error) toast.error('שגיאה בעדכון סטטוס')
    else router.refresh()
  }

  async function handlePaidChange(id: string, is_paid: boolean) {
    const result = await updateOrderPaid(id, is_paid)
    if (result.error) toast.error('שגיאה בעדכון תשלום')
    else router.refresh()
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">ניהול הזמנות</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <form
          className="flex gap-2"
          onSubmit={e => { e.preventDefault(); applyFilters() }}
        >
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="חיפוש שם / טלפון"
            className="w-48"
          />
          <Button type="submit" variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        <Select
          value={statusFilter}
          onValueChange={v => { const val = v ?? ''; setStatusFilter(val); applyFilters({ status: val }) }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="כל הסטטוסים" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">כל הסטטוסים</SelectItem>
            {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={dateFilter}
          onChange={e => { setDateFilter(e.target.value); applyFilters({ date: e.target.value }) }}
          className="w-44"
          dir="ltr"
        />
        {(search || statusFilter || dateFilter) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch(''); setStatusFilter(''); setDateFilter('')
              router.replace('/admin/orders')
            }}
          >
            נקה
          </Button>
        )}
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>שם לקוח</TableHead>
              <TableHead>טלפון</TableHead>
              <TableHead>תאריך איסוף</TableHead>
              <TableHead>סכום</TableHead>
              <TableHead>סטטוס</TableHead>
              <TableHead>שולם</TableHead>
              <TableHead className="w-32"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                  אין הזמנות
                </TableCell>
              </TableRow>
            )}
            {orders.map(order => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">{order.order_number}</TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell dir="ltr">{order.customer_phone}</TableCell>
                <TableCell>
                  {format(new Date(order.pickup_date), 'dd/MM/yyyy', { locale: he })}
                </TableCell>
                <TableCell>₪{order.total_amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onValueChange={v => handleStatusChange(order.id, v as OrderStatus)}
                  >
                    <SelectTrigger className="h-8 w-36 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={order.is_paid}
                    onCheckedChange={v => handlePaidChange(order.id, !!v)}
                    aria-label="שולם"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setSelectedOrder(order); setDialogOpen(true) }}
                    >
                      פרטים
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setEmailOrder(order); setEmailDialogOpen(true) }}
                    >
                      מייל
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <OrderDetailDialog
        order={selectedOrder}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <EmailDialog
        order={emailOrder}
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
      />
    </div>
  )
}
