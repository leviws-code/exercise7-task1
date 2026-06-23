'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { CartItem, OrderStatus, OrderWithItems } from '@/lib/types'

export async function createOrder(
  formData: FormData,
  items: CartItem[],
  userId?: string
) {
  const supabase = await createClient()

  const customer_name = formData.get('customer_name') as string
  const customer_phone = formData.get('customer_phone') as string
  const customer_email = formData.get('customer_email') as string
  const pickup_date = formData.get('pickup_date') as string
  const notes = (formData.get('notes') as string) || null

  const total_amount = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId ?? null,
      customer_name,
      customer_phone,
      customer_email,
      pickup_date,
      notes,
      total_amount,
    })
    .select('id, order_number')
    .single()

  if (orderError) return { error: orderError.message }

  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.name,
    unit_price: item.price,
    quantity: item.quantity,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

  if (itemsError) return { error: itemsError.message }

  revalidatePath('/admin/orders')
  return { success: true, orderNumber: order.order_number }
}

export async function getOrdersByContact(
  contact: string
): Promise<OrderWithItems[]> {
  const supabase = await createClient()

  const isEmail = contact.includes('@')

  const query = supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })

  const { data } = isEmail
    ? await query.eq('customer_email', contact)
    : await query.eq('customer_phone', contact)

  return (data as OrderWithItems[]) ?? []
}

export async function getOrdersByUserId(userId: string): Promise<OrderWithItems[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return (data as OrderWithItems[]) ?? []
}

export async function getAdminOrders(filters?: {
  status?: string
  date?: string
  search?: string
}): Promise<OrderWithItems[]> {
  const supabase = await createClient()

  let query = supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }
  if (filters?.date) {
    query = query.eq('pickup_date', filters.date)
  }
  if (filters?.search) {
    query = query.or(
      `customer_name.ilike.%${filters.search}%,customer_phone.ilike.%${filters.search}%`
    )
  }

  const { data } = await query
  return (data as OrderWithItems[]) ?? []
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const supabase = await createClient()
  const { error } = await supabase.from('orders').update({ status }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/orders')
  return { success: true }
}

export async function updateOrderPaid(id: string, is_paid: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from('orders').update({ is_paid }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/orders')
  return { success: true }
}
