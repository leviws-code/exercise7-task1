import { Badge } from '@/components/ui/badge'
import type { OrderStatus } from '@/lib/types'

const statusConfig: Record<OrderStatus, { label: string; variant: 'outline' | 'secondary' | 'default' | 'destructive' }> = {
  'חדש':           { label: 'חדש',           variant: 'outline' },
  'התקבלה':        { label: 'התקבלה',        variant: 'secondary' },
  'מוכן לאיסוף':  { label: 'מוכן לאיסוף',  variant: 'default' },
  'הושלמה':        { label: 'הושלמה',        variant: 'secondary' },
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status] ?? { label: status, variant: 'outline' as const }
  return <Badge variant={config.variant}>{config.label}</Badge>
}
