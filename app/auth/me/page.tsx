import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export default async function AuthMePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Use service role to bypass RLS
  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('role, status')
    .eq('id', user.id)
    .single()

  if (!profile || profile.status === 'pending') redirect('/pending')
  if (profile.status === 'rejected') redirect('/login')

  if (profile.role === 'admin' || profile.role === 'manager') {
    redirect('/admin/products')
  }

  redirect('/')
}
