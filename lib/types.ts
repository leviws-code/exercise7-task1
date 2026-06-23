export type UserRole = 'admin' | 'manager' | 'customer'
export type UserStatus = 'pending' | 'approved' | 'rejected'
export type OrderStatus = 'חדש' | 'התקבלה' | 'מוכן לאיסוף' | 'הושלמה'
export type ProductCategory = 'חלות' | 'עוגות' | 'ממתקים'

export interface Profile {
  id: string
  full_name: string
  email: string
  phone: string | null
  role: UserRole
  status: UserStatus
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category: ProductCategory
  image_url: string | null
  available: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  order_number: number
  user_id: string | null
  customer_name: string
  customer_phone: string
  customer_email: string
  pickup_date: string
  notes: string | null
  total_amount: number
  status: OrderStatus
  is_paid: boolean
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  unit_price: number
  quantity: number
  created_at: string
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[]
}

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  imageUrl: string | null
}
