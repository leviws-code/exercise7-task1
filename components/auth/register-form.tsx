'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'sonner'
import type { UserRole } from '@/lib/types'

export function RegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<UserRole>('customer')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    const confirm = (form.elements.namedItem('confirm') as HTMLInputElement).value
    const full_name = (form.elements.namedItem('full_name') as HTMLInputElement).value
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value

    if (password !== confirm) {
      toast.error('הסיסמאות אינן תואמות')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name, role, phone } },
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    router.push('/pending')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="full_name">שם מלא</Label>
        <Input id="full_name" name="full_name" required placeholder="ישראל ישראלי" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">אימייל</Label>
        <Input id="email" name="email" type="email" required placeholder="your@email.com" dir="ltr" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">טלפון</Label>
        <Input id="phone" name="phone" type="tel" placeholder="050-0000000" dir="ltr" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">סיסמה</Label>
        <Input id="password" name="password" type="password" required minLength={6} placeholder="••••••••" dir="ltr" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirm">אימות סיסמה</Label>
        <Input id="confirm" name="confirm" type="password" required placeholder="••••••••" dir="ltr" />
      </div>
      <div className="flex flex-col gap-2">
        <Label>סוג חשבון</Label>
        <RadioGroup value={role} onValueChange={(v) => setRole(v as UserRole)} className="flex gap-4">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="customer" id="role-customer" />
            <Label htmlFor="role-customer" className="cursor-pointer font-normal">לקוח</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="manager" id="role-manager" />
            <Label htmlFor="role-manager" className="cursor-pointer font-normal">מנהל חנות</Label>
          </div>
        </RadioGroup>
      </div>
      <Button type="submit" disabled={loading} className="mt-2">
        {loading ? 'נרשם...' : 'הרשמה'}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        יש לך חשבון?{' '}
        <a href="/login" className="text-primary underline underline-offset-4">
          כניסה
        </a>
      </p>
    </form>
  )
}
