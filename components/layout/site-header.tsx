'use client'

import Link from 'next/link'
import { ShoppingCart, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/hooks/use-cart'

export function SiteHeader() {
  const { totalItems } = useCart()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          🥐 <span>מאפיית רונית</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" render={<Link href="/orders" />}>
            ההזמנות שלי
          </Button>
          <Button variant="ghost" size="sm" render={<Link href="/login" />}>
            <LogIn className="h-4 w-4 ms-1" />
            כניסה
          </Button>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              aria-label="סל קניות"
              render={<Link href="/cart" />}
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
            {totalItems > 0 && (
              <Badge
                variant="destructive"
                className="pointer-events-none absolute -top-1 -end-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {totalItems}
              </Badge>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
