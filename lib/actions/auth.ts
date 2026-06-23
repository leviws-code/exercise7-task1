'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import type { Profile, UserRole, UserStatus } from '@/lib/types'

export async function registerUser(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const full_name = formData.get('full_name') as string
  const phone = formData.get('phone') as string
  const role = (formData.get('role') as UserRole) || 'customer'

  // Use admin API so email_confirm is skipped — we have our own approval flow
  const adminSupabase = createAdminClient()
  const { error } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, role, phone },
  })

  if (error) {
    if (error.message.includes('already registered') || error.message.includes('already been registered')) {
      return { error: 'כתובת המייל כבר רשומה במערכת' }
    }
    return { error: error.message }
  }

  redirect('/pending')
}

export async function loginUser(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'אימייל או סיסמה שגויים' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', data.user.id)
    .single()

  if (!profile || profile.status === 'pending') {
    redirect('/pending')
  }

  if (profile.status === 'rejected') {
    await supabase.auth.signOut()
    return { error: 'הגישה שלך נדחתה. פנה למנהל המערכת.' }
  }

  if (profile.role === 'admin' || profile.role === 'manager') {
    redirect('/admin/products')
  }

  redirect('/')
}

export async function logoutUser() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return data
}

export async function getAllUsers(): Promise<Profile[]> {
  const adminSupabase = createAdminClient()

  const { data } = await adminSupabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return data ?? []
}

export async function updateUserStatus(userId: string, status: UserStatus, role?: UserRole) {
  const adminSupabase = createAdminClient()

  const updateData: Partial<Profile> = { status }
  if (role) updateData.role = role

  const { error } = await adminSupabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/users')
  return { success: true }
}
