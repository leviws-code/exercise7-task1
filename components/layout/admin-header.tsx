'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, Package, ShoppingBag, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import type { Profile } from '@/lib/types'

const navItems = [
  { href: '/admin/products', label: 'מוצרים', icon: Package, roles: ['admin', 'manager'] },
  { href: '/admin/orders',   label: 'הזמנות', icon: ShoppingBag, roles: ['admin'] },
  { href: '/admin/users',    label: 'משתמשים', icon: Users, roles: ['admin'] },
]

export function AdminHeader({ profile }: { profile: Profile | null }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const visibleNav = navItems.filter(
    item => !profile || item.roles.includes(profile.role)
  )

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-lg">🥐 מאפיית רונית</Link>
          <nav className="flex items-center gap-1">
            {visibleNav.map(item => (
              <Button
                key={item.href}
                variant={pathname.startsWith(item.href) ? 'secondary' : 'ghost'}
                size="sm"
                render={<Link href={item.href} />}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {profile && (
            <span className="text-sm text-muted-foreground hidden sm:block">
              {profile.full_name}
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 me-1" />
            יציאה
          </Button>
        </div>
      </div>
    </header>
  )
}
