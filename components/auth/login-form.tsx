'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast.error('אימייל או סיסמה שגויים')
      setLoading(false)
      return
    }

    // redirect to server-side page that checks profile and routes accordingly
    router.push('/auth/me')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">אימייל</Label>
        <Input id="email" name="email" type="email" required placeholder="your@email.com" dir="ltr" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">סיסמה</Label>
        <Input id="password" name="password" type="password" required placeholder="••••••••" dir="ltr" />
      </div>
      <Button type="submit" disabled={loading} className="mt-2">
        {loading ? 'מתחבר...' : 'כניסה'}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        אין לך חשבון?{' '}
        <a href="/register" className="text-primary underline underline-offset-4">
          הרשמה
        </a>
      </p>
    </form>
  )
}
