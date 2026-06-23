'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Product, ProductCategory } from '@/lib/types'

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('available', true)
    .order('category')
    .order('name')
  return data ?? []
}

export async function getAdminProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .order('category')
    .order('name')
  return data ?? []
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const category = formData.get('category') as ProductCategory
  const image_url = (formData.get('image_url') as string) || null

  const { error } = await supabase.from('products').insert({
    name, description, price, category, image_url,
  })

  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath('/admin/products')
  return { success: true }
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const category = formData.get('category') as ProductCategory
  const image_url = (formData.get('image_url') as string) || null
  const available = formData.get('available') === 'true'

  const { error } = await supabase
    .from('products')
    .update({ name, description, price, category, image_url, available })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath('/admin/products')
  return { success: true }
}

export async function toggleProductAvailability(id: string, available: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('products')
    .update({ available })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath('/admin/products')
  return { success: true }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath('/admin/products')
  return { success: true }
}
