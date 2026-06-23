import { Suspense } from 'react'
import { getAdminOrders } from '@/lib/actions/orders'
import { OrdersTable } from '@/components/admin/orders-table'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = { title: 'ניהול הזמנות | מאפיית רונית' }

interface Props {
  searchParams: Promise<{ status?: string; date?: string; search?: string }>
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const filters = await searchParams
  const orders = await getAdminOrders(filters)
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <OrdersTable orders={orders} />
    </Suspense>
  )
}
